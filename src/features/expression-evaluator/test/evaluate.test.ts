import type { ExpressionArgs, ExpressionEventHooks } from '../types';
import {
    evaluate,
    evaluateAndIterate,
} from './utils'

const EMPTY_ARGS = {
    vars: {},
    expressionEventHooks: {},
    builtInVars: {},
    scope: {}
} as ExpressionArgs;

describe('Evaluate Test', () => {
    test('literal', () => {
        expect(evaluate('0', EMPTY_ARGS)).toEqual(0);
        expect(evaluate('1', EMPTY_ARGS)).toEqual(1);
        expect(evaluate('2', EMPTY_ARGS)).toEqual(2);
        expect(evaluate('3', EMPTY_ARGS)).toEqual(3);
        expect(evaluate('4', EMPTY_ARGS)).toEqual(4);
        expect(evaluate('"hello world"', EMPTY_ARGS)).toEqual('hello world');
        expect(evaluate("'hello world'", EMPTY_ARGS)).toEqual('hello world');
    });
    test('operation', () => {
        expect(evaluate('1 + 2', EMPTY_ARGS)).toEqual(3);
        expect(evaluate('5 - 3', EMPTY_ARGS)).toEqual(2);
        expect(evaluate('4 * 3', EMPTY_ARGS)).toEqual(12);
        expect(evaluate('8 / 2', EMPTY_ARGS)).toEqual(4);
        expect(evaluate('7 % 3', EMPTY_ARGS)).toEqual(1);
    });

    test('complex expressions', () => {
        expect(evaluate('1 + 2 * 3', EMPTY_ARGS)).toEqual(7);
        expect(evaluate('1 * 2 + 3', EMPTY_ARGS)).toEqual(5);
    });

    test('should evaluate comparison operations', () => {
        expect(evaluate('5 > 3', EMPTY_ARGS)).toEqual(true);
        expect(evaluate('2 < 1', EMPTY_ARGS)).toEqual(false);
        expect(evaluate('5 >= 5', EMPTY_ARGS)).toEqual(true);
        expect(evaluate('3 <= 2', EMPTY_ARGS)).toEqual(false);
        expect(evaluate('5 == 5', EMPTY_ARGS)).toEqual(true);
        expect(evaluate('3 != 4', EMPTY_ARGS)).toEqual(true);
    });

    test('should evaluate logical operations', () => {
        expect(evaluate('1 && 0', EMPTY_ARGS)).toEqual(0);
        expect(evaluate('1 || 0', EMPTY_ARGS)).toEqual(1);
    });

    test('variable', () => {
        const args = {
            ...EMPTY_ARGS,
            vars: { 'num': 5 },
            builtInVars: { 'no': 10 }
        };
        expect(evaluate('num', args)).toEqual(5);
        expect(evaluate('num + 2', args)).toEqual(7);
        expect(evaluate(':no', args)).toEqual(10);
        expect(evaluate(':no + 5', args)).toEqual(15);
    });

    test('variable2', () => {
        const args = {
            ...EMPTY_ARGS,
            vars: { 'a': 1, 'b': 2, 'c': 3 },
        };
        expect(evaluate('a + b * c', args)).toEqual(7);
    });
});

describe('Iterate Test', () => {
    const hooks: Partial<ExpressionEventHooks> = {
        indexor(array, index) {
            if (Array.isArray(array)) {
                return array[index];
            }
            else {
                throw new Error(`${array} is not an array`);
            }
        },
        access(obj, index) {
            if (obj == null) {
                throw new Error('obj is null');
            }
            else if (typeof (obj) !== 'object') {
                throw new Error(`${obj} is not an object`);
            }
            else {
                return obj[index];
            }
        },
        call(caller, args: unknown[]) {
            if (typeof (caller) === 'function') {
                return caller.apply({}, args);
            }
            else {
                throw new Error('caller is not a function');
            }
        },
        objectify(value) {
            return value;
        },
        iterate(array) {
            if (Array.isArray(array)) {
                return array.values();
            }
            else {
                throw new Error(`${array} is not an array`);
            }
        }
    }

    const iterateResult = (iterator: Iterator<any>) => {
        const result: any[] = [];
        while (true) {
            const next = iterator.next();
            if (next.done) {
                break;
            }
            result.push(next.value);
        }
        return result;
    }

    test('array', () => {
        const args = {
            ...EMPTY_ARGS,
            vars: {
                'array': [0, 1, 2, 3]
            },
            expressionEventHooks: hooks
        }
        const result = evaluateAndIterate('array', args);
        const actual = iterateResult(result);
        const expected = [0, 1, 2, 3];

        expect(actual).toEqual(expected);
    });
});