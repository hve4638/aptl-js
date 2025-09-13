import TokenPostfixTransformer from '../';
import ExpressionTokenizer from '@/features/expression-tokenizer';


export function tokenizeAndTrasfrom(text: string) {
    const tokens = ExpressionTokenizer.tokenizeRaw(text);
    const transformed = TokenPostfixTransformer.transform(tokens);
    return transformed;
}

export { Tokens } from '../Tokens';

// export function generateAST(expressionText: string) {
//     const tokens = tokenize(expressionText);
//     const transformed = transformToken(tokens);
//     const ast = parseAST(transformed);
//     return ast;
// }

