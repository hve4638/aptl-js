import { BuildError, InternalError } from '@/errors';
import { APTLErrorType } from '@/errors';
import type { RawToken } from '@/types/raw-token';
import type { Token } from '@/types/token';

import { Tokens } from './Tokens';
import TokenStacks from './TokenStack';
import { 
    ParenType
} from './types';

class TokenPostfixTransformer {
    static transform(tokens: RawToken[]): Token[] {
        const stacks = new TokenStacks();

        let position = 0;

        // 마지막 토큰이 표현(number/string/identifier)인지 아닌지 여부
        // '(', ')' 토큰의 용도가 함수 호출인지, 우선순위 처리인지 확인
        let isPrevTokenExpression = false;
        for (const token of tokens) {
            const size = token.value.length;
            try {
                switch (token.type) {
                    case 'number':
                        stacks.add(Tokens.number(token.value, { position, size }));
                        isPrevTokenExpression = true;
                        break;
                    case 'string':
                        stacks.add(Tokens.string(token.value, { position, size }));
                        isPrevTokenExpression = true;
                        break;
                    case 'identifier':
                        stacks.add(Tokens.identifier(token.value, { position, size }));
                        isPrevTokenExpression = true;
                        break;
                    case 'indexor':
                        if (token.value === '[') {
                            stacks.addOperator('[', false, { position, size });
                        }
                        else if (token.value === ']') {
                            const beginIndexor = stacks.moveOperatorUntilChar('[', APTLErrorType.MISSING_OPEN_INDEXOR);
                            stacks.add(Tokens.operator('[]', {
                                position: beginIndexor.position,
                                size: size + position - beginIndexor.position,
                            }));
                        }
                        isPrevTokenExpression = false;
                        break;
                    case 'operator':
                        stacks.addOperator(token.value, false, { position, size });
                        isPrevTokenExpression = false;
                        break;
                    case 'delimiter':
                        // ',' 는 함수 인자 구분자로만 사용
                        if (stacks.lastParenType !== ParenType.FUNCTION) {
                            throw new InternalError(
                                'Multiple value in a single expression are not allowed',
                                APTLErrorType.MULTIPLE_EXPRESSION
                            );
                        }
                        break;
                    case 'paren':
                        if (token.value === '(') {
                            if (isPrevTokenExpression) {
                                stacks.addOpenParen(ParenType.FUNCTION, { position, size });
                            }
                            else {
                                stacks.addOpenParen(ParenType.EXPRESSION, { position, size });
                            }
                        }
                        else if (token.value === ')') {
                            stacks.addCloseParen({ position, size });
                        }
                        isPrevTokenExpression = false;
                        break;
                    case 'space':
                        break;
                    default:
                        throw new InternalError(
                            'Invalid Token',
                            APTLErrorType.INVALID_TOKEN
                        );
                }
            }
            catch (e: unknown) {
                if (e instanceof InternalError) {
                    const text = token.value;

                    throw new BuildError(
                        e.message,
                        {
                            error_type: e.type,
                            position: {
                                begin: position,
                                end: position + text.length,
                            },
                            text,
                        }
                    );
                }
                else {
                    throw e;
                }
            }

            position += token.value.length;
        }

        stacks.moveOperatorAll();
        return stacks.result;
    }
}

export default TokenPostfixTransformer;