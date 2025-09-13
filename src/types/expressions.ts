export const ExpressionType = {
    LITERAL: 'literal',
    IDENTIFIER: 'identifier',
    OBJECT: 'object',
    PARAM: 'param',
    CALL: 'call',
    CUSTOM: 'custom',
} as const;

export type ExpressionType = typeof ExpressionType[keyof typeof ExpressionType];

export type AnyExpression = EvaluatableExpression | UnevaluatableExpression;
export type EvaluatableExpression = CallExpression | LiteralExpression | ObjectExpression | IdentifierExpression;
export type UnevaluatableExpression = ParamExpression;

export interface CallExpression {
    readonly type: typeof ExpressionType.CALL;
    readonly value: string;
    readonly operands: AnyExpression[];
    readonly position: number;
    readonly size: number;
}

export interface LiteralExpression {
    readonly type: typeof ExpressionType.LITERAL;
    readonly value: string | number | boolean;
    readonly position: number;
    readonly size: number;
}

export interface ObjectExpression {
    readonly type: typeof ExpressionType.OBJECT;
    readonly value: any;
    readonly position: number;
    readonly size: number;
}

export interface IdentifierExpression {
    readonly type: typeof ExpressionType.IDENTIFIER;
    readonly value: string;
    readonly position: number;
    readonly size: number;
}

export interface ParamExpression {
    readonly type: typeof ExpressionType.PARAM;
    readonly args: EvaluatableExpression[];
    readonly position?: number;
    readonly size?: number;
}