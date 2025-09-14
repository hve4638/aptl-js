import ExpressionTokenizer from '../';
import { APTLErrorType } from '@/errors';
import { expectAPTLFail, getThrownError } from '@/test';

describe('Expression Tokenizer Error Test', () => {
    test('INVALID_TOKEN : invalid identifier', () => {
        const expressionText = '1a';
        const e = getThrownError(() => ExpressionTokenizer.tokenizeRaw(expressionText));
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.INVALID_TOKEN,
                text: '1a',
                position: {
                    begin: 0,
                    end: 2,
                }
            }
        );
    });

    test('INVALID_TOKEN : invalid operator', () => {
        const expressionText = 'a @ b';
        try {
            ExpressionTokenizer.tokenizeRaw(expressionText); // expected error
        }
        catch (e: any) {
            expectAPTLFail(
                e,
                {
                    error_type: APTLErrorType.INVALID_TOKEN,
                    text: '@',
                    position: {
                        begin: 2,
                        end: 3,
                    }
                }
            );
            return;
        }
        throw new Error('Expected error but not thrown');
    });
});