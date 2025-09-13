import ExpressionTokenizer from '../';
import { APTLErrorType } from '@/errors';
import { expectCBFFail, getThrownError } from '@/test';

describe('Expression Tokenizer Error Test', () => {
    test('INVALID_TOKEN : invalid identifier', () => {
        const expressionText = '1a';
        const e = getThrownError(() => ExpressionTokenizer.tokenizeRaw(expressionText));
        expectCBFFail(
            e,
            APTLErrorType.INVALID_TOKEN,
            {
                text: '1a',
                positionBegin: 0,
                positionEnd: 2,
            }
        );
    });

    test('INVALID_TOKEN : invalid operator', () => {
        const expressionText = 'a @ b';
        try {
            ExpressionTokenizer.tokenizeRaw(expressionText); // expected error
        }
        catch (e: any) {
            expectCBFFail(
                e,
                APTLErrorType.INVALID_TOKEN,
                {
                    text: '@',
                    positionBegin: 2,
                    positionEnd: 3,
                }
            );
            return;
        }
        throw new Error('Expected error but not thrown');
    });
});