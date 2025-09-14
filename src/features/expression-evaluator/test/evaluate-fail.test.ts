import { expectAPTLFail } from '@/test';
import type { ExpressionArgs } from '../types/hooks';
import {
    evaluate,
    evaluateAndIterate,
    evaluateAndStringify,
    getThrownError,
} from './utils';
import { APTLErrorType } from '@/errors';
import { ExpressionType, IdentifierExpression } from '@/types/expressions';

const EMPTY_ARGS = {
    vars : {},
    expressionEventHooks : {},
    builtInVars:{},
    scope : {}
} as ExpressionArgs;

describe('evaluate error', () => {
    const identifier = (value:string, hint:{ position:number, size:number }) => {
        return {
            type : ExpressionType.IDENTIFIER,
            value : value,
            ...hint
        } as IdentifierExpression;
    }

    test('IDENTIFIER_RESOLVE_FAIL: var', () => {
        const e = getThrownError(()=>evaluate('num', EMPTY_ARGS))
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.IDENTIFIER_RESOLVE_FAIL,
                text : 'num',
                position: {
                    begin: 0,
                    end: 3,
                }
            }
        );
    });
    
    test('IDENTIFIER_RESOLVE_FAIL: built-in var', () => {
        const e = getThrownError(()=>evaluate(':chat', EMPTY_ARGS))
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.IDENTIFIER_RESOLVE_FAIL,
                text : ':chat',
                position: {
                    begin: 0,
                    end: 5,
                }
            }
        );
    });

    test('NO_HOOK: call', () => {
        const args = {
            ...EMPTY_ARGS,
            vars : {
                num : {}
            },
            expressionEventHooks : {
                objectify(value) {
                    return value;
                }
            }
        };
        
        const e = getThrownError(()=>evaluate('num()', args));
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.NO_HOOK,
                text : '()',
                position: {
                    begin: 0,
                    end: 5,
                }
            }
        );
    });

    test('NO_HOOK : stringify', () => {
        const args = {
            ...EMPTY_ARGS,
            vars : {
                num : {}
            },
            expressionEventHooks : {
                objectify(value) {
                    return value;
                }
            }
        };

        const e = getThrownError(()=>evaluateAndStringify('num', args))
        expectAPTLFail(
            e,
            
            {
                error_type: APTLErrorType.NO_HOOK,
                text : args.vars.num.toString(),
                position: {
                    begin: 0,
                    end: 3,
                }
            }
        );
    });

    // literal의 경우 미리 정의된 내부 hook를 사용하며
    // 지원하지 않는 연산자는 NO_HOOK대신 OPERATOR_NOT_SUPPORTED 예외를 발생시킴
    test('OPERATOR_NOT_SUPPORTED : literal iterate', () => {
        const e = getThrownError(()=>evaluateAndIterate('5', EMPTY_ARGS))
        expectAPTLFail(
            e,
            {
                error_type: APTLErrorType.OPERATOR_NOT_SUPPORTED,
                text : '5',
                position: {
                    begin: 0,
                    end: 1,
                }
            }
        );
    });
});

