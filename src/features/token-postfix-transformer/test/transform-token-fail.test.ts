import { expectAPTLFail, getThrownError } from '@/test';
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
            expectAPTLFail(
                e,
                {
                    error_type: APTLErrorType.MULTIPLE_EXPRESSION,
                    text: ',',
                    position: {
                        begin: 2,
                        end: 3,
                    }
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
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.MISSING_OPEN_PAREN,
                text: ')',
                position: {
                    begin: 5,
                    end: 6,
                }
            }
        )
    });
    
    test('MISSING_OPEN_INDEXOR', ()=>{
        const expressionText = 'a + b]';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.MISSING_OPEN_INDEXOR,
                text: ']',
                position: {
                    begin: 5,
                    end: 6,
                }
            }
        )
    });

    /// @TODO: 구현 필요
    test.skip('MISSING_CLOSE_INDEXOR', ()=>{
        const expressionText = '[a + b';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.MISSING_CLOSE_INDEXOR,
                text: '[',
                position: {
                    begin: 0,
                    end: 1,
                }
            }
        );
    });
    
    /// @TODO: 구현 필요
    test.skip('MISSING_CLOSE_INDEXOR', ()=>{
        const expressionText = '(a + b';

        const e = getThrownError(()=>tokenizeAndTrasfrom(expressionText));
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.MISSING_CLOSE_PAREN,
                text: '(',
                position: {
                    begin: 0,
                    end: 1,
                },
            }
        );
    });
});