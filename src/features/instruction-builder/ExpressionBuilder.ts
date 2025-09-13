import ExpressionTokenizer from '@/features/expression-tokenizer';
import TokenPostfixTransformer from '@/features/token-postfix-transformer';
import ASTParser from '@/features/ast-parser';

import { APTLFail } from '@/errors';

import { EvaluatableExpression } from '@/types/expressions';

class ExpressionBuilder {
    static build(expressionText: string, { position }: { position: number }): EvaluatableExpression {
        try {
            const rawTokens = ExpressionTokenizer.tokenizeRaw(expressionText);
            const tokens = TokenPostfixTransformer.transform(rawTokens);
            const ast = ASTParser.parse(tokens);

            return ast;
        }
        catch (e) {
            if (e instanceof APTLFail) {
                throw new APTLFail(
                    e.message,
                    e.type,
                    {
                        positionBegin: position + e.positionBegin,
                        positionEnd: position + e.positionEnd,
                        text: e.text,
                    }
                );
            }
            else {
                throw e;
            }
        }
    }
}

export default ExpressionBuilder;