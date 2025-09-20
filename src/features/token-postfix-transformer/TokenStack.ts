import { InternalError } from '@/errors';
import { APTLErrorType } from '@/errors';
import type { Token } from '@/types/token';

import {
    OPERATOR_PRECEDENCE,
    EXCEPT_PRECEDENCE,
    HIGHEST_PRECEDENCE,
    ParenType,
} from './types/transform';
import { Tokens } from './Tokens';

class TokenStacks {
    #result:Token[] = [];
    #operatorStack:{ operator:string, position:number, size:number }[] = [];
    #parenStack:ParenType[] = [];

    get result() {
        return this.#result;
    }

    get lastParenType() {
        return this.#parenStack.at(-1);
    }

    add(token:Token) {
        this.#result.push(token);
    }

    addOperator(operator:string, noPrecedenceCheck:boolean, hint:{position:number, size:number}) {
        if (!noPrecedenceCheck && OPERATOR_PRECEDENCE[operator] !== EXCEPT_PRECEDENCE) {
            this.moveOperatorUntilLowerPrecedence(operator);
        }
        this.#operatorStack.push({operator, ...hint});
    }

    addOpenParen(parenType:ParenType, hint:{position:number, size:number}) {
        this.#parenStack.push(parenType);
        if (parenType === ParenType.EXPRESSION) {
            this.addOperator('(', true, hint);
        }
        else if (parenType === ParenType.FUNCTION) {
            this.moveOperatorUntilLowerPrecedence(HIGHEST_PRECEDENCE);
            this.add(Tokens.param());
            this.addOperator('(', true, hint);
        }
        else {
            // addOpenParen() 호출 전 반드시 parenType이 지정되어야 함
            throw new InternalError(
                'Logic Error (SyntaxTokenStacks.addOpenParen)',
                APTLErrorType.LOGIC_ERROR,
            )
        }
    }
    addCloseParen(hint:{position:number, size:number}):void {
        const parenType = this.#parenStack.pop();
        if (parenType === ParenType.EXPRESSION) {
            this.moveOperatorUntilChar('(', APTLErrorType.MISSING_OPEN_PAREN);
        }
        else if (parenType === ParenType.FUNCTION) {
            const beginParen = this.moveOperatorUntilChar('(', APTLErrorType.MISSING_OPEN_PAREN);
            const parenHint = {
                position: beginParen.position,
                size: hint.position + hint.size - beginParen.position,
            }
            this.addOperator('()', false, parenHint);
            this.#moveOperator();
        }
        else {
            // '(' 토큰에서 parenType이 지정되므로 '('가 없는 경우 발생
            throw new InternalError(
                `Could not find matching '('`,
                APTLErrorType.MISSING_OPEN_PAREN,
            )
        }
    }

    moveOperatorUntilLowerPrecedence(target:string|number) {
        let targetPrecedence = 0;
        
        if (typeof target === 'string') {
            targetPrecedence = OPERATOR_PRECEDENCE[target];    
        }
        else {
            targetPrecedence = target;
        }
        
        while (
            !this.#isOperatorStackEmpty()
            && OPERATOR_PRECEDENCE[this.#topOperatorStack().operator] !== EXCEPT_PRECEDENCE
            && OPERATOR_PRECEDENCE[this.#topOperatorStack().operator] >= targetPrecedence
        ) {
            this.#moveOperator();
        }
    }

    moveOperatorAll() {
        while (!this.#isOperatorStackEmpty()) {
            this.#moveOperator();
        }
    }

    // 타겟 operator를 찾을 때까지 operatorStack -> resultStack으로 이동
    // 타겟 operator는 추가되지 않고 반환
    moveOperatorUntilChar(target:string, errorTypeWhenThrow:APTLErrorType) {
        while (
            !this.#isOperatorStackEmpty()
            && this.#topOperatorStack().operator !== target
        ) {
            this.#moveOperator();
        }
        
        if (this.#isOperatorStackEmpty()) {
            // char를 찾지 못한 경우
            throw new InternalError(
                `Token '${target}' not found`,
                errorTypeWhenThrow,
            );
        }
        else {
            return this.#operatorStack.pop()!;
        }
    }

    #moveOperator() {
        const op = this.#operatorStack.pop()!;
        this.add(Tokens.operator(op.operator, { position: op.position, size: op.size }));
    }
    
    #isOperatorStackEmpty() {
        return this.#operatorStack.length == 0;
    }

    #topOperatorStack() {
        return this.#operatorStack[this.#operatorStack.length-1];
    }
}

export default TokenStacks;