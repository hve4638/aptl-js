import { RawTokenType } from '@/types/raw-token';

export const TOKEN_PATTERNS = {
    // 숫자: 정수 또는 소수 (예: 42, 3.14)
    number: /\d+(\.\d+)?/,
    // 문자열: 따옴표로 둘러싸인 문자열 (예: "hello", 'world')
    string: /(["'])(?:(?=(\\?))\2.)*?\1/,
    // 연산자: 산술, 비교, 논리, 접근 연산자 (예: +, -, ==, &&, .)
    operator: /(\+|-|\*|\/|%|!=|==|<=|>=|<|>|&&|\|\||\.)/,
    // 식별자: 변수명, 함수명 (콜론으로 시작하는 내장 변수 포함) (예: variable, :var)
    identifier: /\:?[a-zA-Z_]\w*/,
    // 괄호: 함수 호출 및 그룹핑 (예: (, ))
    paren: /(\(|\))/,
    // 공백
    space: /\s+/,
    // 인덱서: 배열 접근을 위한 대괄호 (예: [, ])
    indexor: /(\[|\])/,
    // 구분자: 함수 인자나 배열 요소 구분을 위한 쉼표
    delimiter: /\,/,
} satisfies Record<RawTokenType, RegExp>;
// export type RawTokenType = keyof typeof TOKEN_PATTERNS;

export const INVALID_TOKEN_PATTERNS = {
    // 숫자로 시작하는 식별자 (ex. 1a, 3.14variable)
    IDENTIFIER : /\:?\d+(?:\.\d+)?[a-zA-Z_]\w*/
}