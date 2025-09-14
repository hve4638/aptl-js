import { BuildError } from '@/errors';
import { APTLErrorType } from '@/errors';
import {
    Token,
    OperatorToken,
    TokenType,
} from '@/types/token';
import {
    ExpressionType,
    EvaluatableExpression,
    ParamExpression,
    LiteralExpression,
    IdentifierExpression,
    AnyExpression,
    CallExpression
} from '@/types/expressions';

class ASTParser {
    #tokens: Token[];
    #output: (AnyExpression | Token)[];

    static parse(tokens: Token[]): EvaluatableExpression {
        const parser = new ASTParser(tokens);

        return parser.parse();
    }

    private constructor(tokens: Token[]) {
        this.#tokens = tokens;
        this.#output = [];
    }

    parse(): EvaluatableExpression {
        // 후위 표기법 변환된 토큰을 순회하며 AST 생성
        // 값은 this.#output 스택에 쌓고, 연산자는 스택에서 값을 꺼내 새로운 표현식을 생성 후 다시 스택에 쌓음
        // 순회 종료 시 스택에 하나의 표현식만 남아야 함
        for (const token of this.#tokens) {
            if (token.type === TokenType.OPERATOR) {
                if (token.value === '()') {
                    const expr = this.#parseCallOperator(token);
                    this.#output.push(expr);
                }
                else {
                    const expr = this.#parseBinaryOperator(token);
                    this.#output.push(expr);
                }
            }
            else {
                this.#output.push(token);
            }
        }


        if (this.#output.length === 1) {
            return this.#output[0] as EvaluatableExpression;
        }
        else if (this.#output.length === 0) {
            throw new BuildError(
                'empty expression',
                {
                    error_type: APTLErrorType.NO_EXPRESSION,
                    position: {
                        begin: 0,
                        end: 0,
                    },
                    text: '',
                }
            );
        }
        else {
            // 여러 표현식 리턴시 이곳에 도달
            // 정상적인 입력의 경우 이곳에 도달하지 않음
            throw new BuildError(
                'unprocessed expression remaining',
                {
                    error_type: APTLErrorType.UNPROCESSED_EXPRESSION_REMAIN,
                    position: {
                        begin: 0,
                        end: 0,
                    },
                    text: '',
                }
            );
        }
    }

    // 이항 연산자 처리 메서드
    // [operand1, operand2, operator] 형태이며
    // operator는 외부에서 pop() 되어 인자로 전달됨
    #parseBinaryOperator(token: OperatorToken) {
        let operand2 = this.#output.pop() as AnyExpression;
        const operand1 = this.#output.pop() as EvaluatableExpression;

        if (operand1 == null || operand2 == null) {
            throw new BuildError(
                `Invalid formula : missing operand`,
                {
                    error_type: APTLErrorType.INVALID_FORMULA,
                    text: token.value,
                    position: {
                        begin: token.position,
                        end: token.position + token.size,
                    },
                }
            );
        }
        if (operand2.type === TokenType.PARAM) {
            // 1 + (1,2) 의 형태일 경우
            // 이전 token-postfix-transformer 단계에서 '(1, 2)' 과 같은 식을 허용하지 않으므로
            // 정상 흐름에서 발생하지 않음
            throw new BuildError(
                `Invalid operand : right operand is param`,
                {
                    error_type: APTLErrorType.INVALID_OPERAND,
                    text: '',
                    position: {
                        begin: operand2.position || 0,
                        end: (operand2.position || 0) + (operand2.size || 0),
                    },
                }
            );
        }

        if (token.value === '.') {
            // access 연산의 operand2는 토크나이저에서 identifier로 분류하지만
            // 실제로는 문자열을 통해 엑세스하므로 literal 변환 필요
            if (operand2.type === 'identifier') {
                operand2 = {
                    type: ExpressionType.LITERAL,
                    value: operand2.value,
                    position: operand2.position,
                    size: operand2.size,
                } as LiteralExpression;
            }
            else {
                throw new BuildError(
                    `right operand '${operand2.value}' is not identifier`,
                    {
                        error_type: APTLErrorType.INVALID_ACCESSOR,
                        text: token.value,
                        position: {
                            begin: token.position,
                            end: token.position + token.size,
                        }
                    }
                );
            }
        }

        const operands = [operand1, operand2];
        const expr = this.#getOperatorExpression(
            token.value,
            operands,
            {
                position: operand1.position,
                size: (
                    operand2.size + operand2.position - operand1.position
                    + (token.value === '[]' ? 1 : 0)
                ),
            }
        )
        return expr;
    }

    // [caller, [PARAM], param1, param2, ..., ()] 형태의 token 흐름
    // '()' 는 외부에서 pop() 되어 인자로 전달됨
    #parseCallOperator(token: OperatorToken) {
        const args: EvaluatableExpression[] = [];

        // PARAM 토큰 직전까지 operand 수집
        while (
            this.#output.length > 0
            && this.#output.at(-1)?.type !== TokenType.PARAM
        ) {
            args.unshift(this.#output.pop() as EvaluatableExpression);
        }

        if (this.#output.length == 0) {
            // PARAM 토큰 누락시
            // 정상 흐름(tokenize -> transfromToken)을 통해 전달된 입력을 통해서는 발생하지 않음

            throw new BuildError(
                'Missing PARAM token',
                {
                    error_type: APTLErrorType.MISSING_PARAM_TOKEN,
                    text: token.value,
                    position: {
                        begin: token.position,
                        end: token.position + token.size,
                    },
                }
            );
        }
        this.#output.pop(); // PARAM 토큰

        const caller = this.#output.pop() as EvaluatableExpression;
        return this.#getOperatorExpression(
            token.value, // '()'
            [
                caller,
                {
                    type: ExpressionType.PARAM,
                    args: args
                } as ParamExpression
            ],
            {
                position: caller.position,
                size: token.size + token.position - caller.position,
            }
        )
    }

    #getOperatorExpression(value: string, operands: AnyExpression[], hint: { position: number, size: number }): CallExpression {
        return {
            type: ExpressionType.CALL,
            value: value,
            operands: operands,
            ...hint,
        };
    }
}

export default ASTParser;