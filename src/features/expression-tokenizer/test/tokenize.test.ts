import { RawTokenType } from '@/types/raw-token';

import ExpressionTokenizer from '../';

const tokenize = ExpressionTokenizer.tokenizeRaw;
const token = (type: RawTokenType, value: any) => ({ type, value });

/**
 * 토크나이저 표현식 토큰화 테스트
 */
describe('Expression Tokenizer Test', () => {
    test('number', () => {
        const actual = tokenize('10');
        const expected = [
            token('number', '10')
        ];
        expect(actual).toEqual(expected);
    });

    test('string', () => {
        const actual = tokenize('"hello world"');
        const expected = [
            token('string', '"hello world"')
        ];
        expect(actual).toEqual(expected);
    });

    test('operator', () => {
        const actual = tokenize('1 + 1.5');
        const expected = [
            token('number', '1'),
            token('space', ' '),
            token('operator', '+'),
            token('space', ' '),
            token('number', '1.5'),
        ];
        expect(actual).toEqual(expected);
    });

    test('operator 2', () => {
        const actual = tokenize('17 % 3');
        const expected = [
            token('number', '17'),
            token('space', ' '),
            token('operator', '%'),
            token('space', ' '),
            token('number', '3'),
        ];
        expect(actual).toEqual(expected);
    });

    test('identifier', () => {
        const actual = tokenize('variable');
        const expected = [
            token('identifier', 'variable'),
        ];
        expect(actual).toEqual(expected);
    });

    test('identifier and property access', () => {
        const actual = tokenize('variable.name');
        const expected = [
            token('identifier', 'variable'),
            token('operator', '.'),
            token('identifier', 'name'),
        ];
        expect(actual).toEqual(expected);
    });

    test('identifier and function call', () => {
        const actual = tokenize('variable.func()');
        const expected = [
            token('identifier', 'variable'),
            token('operator', '.'),
            token('identifier', 'func'),
            token('paren', '('),
            token('paren', ')'),
        ];
        expect(actual).toEqual(expected);
    });

    test('function with arguments', () => {
        const actual = tokenize('func(i, 10)');
        const expected = [
            token('identifier', 'func'),
            token('paren', '('),
            token('identifier', 'i'),
            token('delimiter', ','),
            token('space', ' '),
            token('number', '10'),
            token('paren', ')'),
        ];
        expect(actual).toEqual(expected);
    });

    test('array indexing', () => {
        const actual = tokenize('array[0]');
        const expected = [
            token('identifier', 'array'),
            token('indexor', '['),
            token('number', '0'),
            token('indexor', ']'),
        ];
        expect(actual).toEqual(expected);
    });

    test('expression in indexor', () => {
        const actual = tokenize('array[10 + i]');
        const expected = [
            token('identifier', 'array'),
            token('indexor', '['),
            token('number', '10'),
            token('space', ' '),
            token('operator', '+'),
            token('space', ' '),
            token('identifier', 'i'),
            token('indexor', ']'),
        ];
        expect(actual).toEqual(expected);
    });
});

describe('Built-in Variable Tokenizer Test', () => {
    test('built-in variable', () => {
        const actual = tokenize(':var');
        const expected = [
            token('identifier', ':var'),
        ];
        expect(actual).toEqual(expected);
    });

    test('built-in variable property access', () => {
        const actual = tokenize(':var.length');
        const expected = [
            token('identifier', ':var'),
            token('operator', '.'),
            token('identifier', 'length'),
        ];
        expect(actual).toEqual(expected);
    });

    test('built-in variable indexing', () => {
        const actual = tokenize(':var[0]');
        const expected = [
            token('identifier', ':var'),
            token('indexor', '['),
            token('number', '0'),
            token('indexor', ']'),
        ];
        expect(actual).toEqual(expected);
    });

    test('built-in variable function call', () => {
        const actual = tokenize(':var()');
        const expected = [
            token('identifier', ':var'),
            token('paren', '('),
            token('paren', ')'),
        ];
        expect(actual).toEqual(expected);
    });
});