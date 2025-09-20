export type RawTokenType = (
    'number'
    | 'string'
    | 'operator'
    | 'identifier'
    | 'paren'
    | 'space'
    | 'indexor'
    | 'delimiter'
);

export type RawToken = {
    type: RawTokenType,
    value: string,
}