import { expectCBFFail, getThrownError } from '@/test';
import { APTLErrorType } from '@/errors';

import {
    tokenizeAndTrasfrom,
} from './utils';

/*
 * transformToken에서 발생할 수 있는 예외 목록
 * - MULTIPLE_EXPRESSION
 * - MISSING_OPEN_PAREN
 * - MISSING_OPEN_INDEXOR
*/
describe('SyntaxTransform Test', () => {
    test('MULTIPLE_EXPRESSION', ()=>{ 
        const expressionText = 'a , b';
        try {
            tokenizeAndTrasfrom(expressionText);
        }
        catch (e: any) {
            expectCBFFail(
                e,
                APTLErrorType.MULTIPLE_EXPRESSION,
                {
                    text: ',',
                    positionBegin: 2,
                    positionEnd: 3,
                }
            );
        }
    });

    test.skip('INVALID_TOKEN', ()=>{
        // tokenize 단계에서 검증되므로 정상적인 진행에서 발생할 수 없음
    });
    
    test('MISSING_OPEN_PAREN', ()=>{
        const expressionText = 'a + b)';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectCBFFail(
            e,
            APTLErrorType.MISSING_OPEN_PAREN,
            {
                text: ')',
                positionBegin: 5,
                positionEnd: 6,
            }
        )
    });
    
    test('MISSING_OPEN_INDEXOR', ()=>{
        const expressionText = 'a + b]';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectCBFFail(
            e,
            APTLErrorType.MISSING_OPEN_INDEXOR,
            {
                text: ']',
                positionBegin: 5,
                positionEnd: 6,
            }
        )
    });

    /// @TODO: 구현 필요
    test.skip('MISSING_CLOSE_INDEXOR', ()=>{
        const expressionText = '[a + b';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectCBFFail(
            e,
            APTLErrorType.MISSING_CLOSE_INDEXOR,
            {
                text: '[',
                positionBegin: 0,
                positionEnd: 1,
            }
        );
    });
    
    /// @TODO: 구현 필요
    test.skip('MISSING_CLOSE_INDEXOR', ()=>{
        const expressionText = '(a + b';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectCBFFail(
            e,
            APTLErrorType.MISSING_CLOSE_PAREN,
            {
                text: '(',
                positionBegin: 0,
                positionEnd: 1,
            }
        );
    });
});