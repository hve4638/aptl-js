import { ExpressionType } from '@/types/expressions';

import ExpressionTokenizer from '@/features/expression-tokenizer';
import TokenPostfixTransformer from '@/features/token-postfix-transformer';

import ASTParser from '../';

export function generateTokens(expressionText: string) {
    const tokens = ExpressionTokenizer.tokenizeRaw(expressionText);
    const transformed = TokenPostfixTransformer.transform(tokens);
    return transformed;
}

export function generateAST(expressionText: string) {
    const tokens = ExpressionTokenizer.tokenizeRaw(expressionText);
    const transformed = TokenPostfixTransformer.transform(tokens);
    const ast = ASTParser.parse(transformed);
    return ast;
}



export function callExpr(operator: string, operands: any, hint: {position: number, size: number}) {
    return {
        type : ExpressionType.CALL,
        value : operator,
        operands : operands,
        ...hint,
    }
}

export function argsExpr(args: any) {
    return {
        type : ExpressionType.PARAM,
        args : args,
    }
}

export { Tokens } from '@/features/token-postfix-transformer/Tokens';