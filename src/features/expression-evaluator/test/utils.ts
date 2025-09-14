import { BuildError } from '@/errors';
import { APTLErrorType } from '@/errors';
import Evaluator from '../Evaluator';

import ExpressionTokenizer from '@/features/expression-tokenizer';
import TokenPostfixTransformer from '@/features/token-postfix-transformer';
import ASTParser from '@/features/ast-parser';

import type { ExpressionArgs } from '../types/hooks';

export function evaluate(text: string, exprArgs: ExpressionArgs) {
    const tokens = ExpressionTokenizer.tokenizeRaw(text);
    const transformed = TokenPostfixTransformer.transform(tokens);
    const ast = ASTParser.parse(transformed);

    const evaluator = new Evaluator(exprArgs);
    return evaluator.evaluate(ast);
}
export function evaluateAndStringify(expressionText: string, exprArgs: ExpressionArgs) {
    const tokens = ExpressionTokenizer.tokenizeRaw(expressionText);
    const transformed = TokenPostfixTransformer.transform(tokens);
    const ast = ASTParser.parse(transformed);

    const evaluator = new Evaluator(exprArgs);
    return evaluator.evaluateAndStringify(ast);
}
export function evaluateAndIterate(expressionText: string, exprArgs: ExpressionArgs) {
    const tokens = ExpressionTokenizer.tokenizeRaw(expressionText);
    const transformed = TokenPostfixTransformer.transform(tokens);
    const ast = ASTParser.parse(transformed);

    const evaluator = new Evaluator(exprArgs);
    return evaluator.evaluateAndIterate(ast);
}

export function getThrownError(callback: () => any) {
    try {
        callback();
    } catch (error) {
        return error;
    }
    throw new Error('Expected error but no error was thrown');
}