import ExpressionTokenizer from '@/features/expression-tokenizer';
import TokenPostfixTransformer from '@/features/token-postfix-transformer';
import ASTParser from '@/features/ast-parser';

import { BuildError, FragmentError } from '@/errors';

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
            if (e instanceof FragmentError) {
                const reason = e.reason;
                
                throw new BuildError(
                    e.message,
                    {
                        error_type: reason.error_type,
                        position: {
                            begin: position + reason.position.begin,
                            end: position + reason.position.end,
                        },
                        text: reason.text,
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