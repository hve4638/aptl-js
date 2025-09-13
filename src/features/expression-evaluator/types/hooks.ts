import { Vars } from '@/types';
import {
    LiteralExpression,
    ObjectExpression
} from '@/types/expressions';

type AnyResult = ObjectExpression | LiteralExpression | string | number | boolean;
type ComparisonResult = LiteralExpression | boolean;

export type ExpressionEventHooks = {
    /** a + b */
    'add': (a: unknown, b: unknown) => AnyResult;
    /** a - b */
    'subtract': (a: unknown, b: unknown) => AnyResult;
    /** a * b */
    'multiply': (a: unknown, b: unknown) => AnyResult;
    /** a / b */
    'divide': (a: unknown, b: unknown) => AnyResult;
    /** a % b */
    'modulo': (a: unknown, b: unknown) => AnyResult;

    /** a >= b */
    'greaterOrEqual': (a: unknown, b: unknown) => ComparisonResult;
    /** a <= b */
    'lessOrEqual': (a: unknown, b: unknown) => ComparisonResult;
    /** a > b */
    'greater': (a: unknown, b: unknown) => ComparisonResult;
    /** a < b */
    'less': (a: unknown, b: unknown) => ComparisonResult;
    /** a != b */
    'notEqual': (a: unknown, b: unknown) => ComparisonResult;
    /** a == b */
    'equal': (a: unknown, b: unknown) => ComparisonResult;
    /** a && b */
    'logicalAnd': (a: unknown, b: unknown) => ComparisonResult;
    /** a || b */
    'logicalOr': (a: unknown, b: unknown) => ComparisonResult;

    /** expr.index */
    'access': (expr: unknown, field: any) => AnyResult;
    /** a[b] */
    'indexor': (expr: unknown, index: string | number) => AnyResult;
    /** a(...b) */
    'call': (expr: unknown, args: unknown[]) => AnyResult;

    /**
     * number, string, boolean이 아닌 식별자에 대해 호출됨
     * 
     * vars, builtInVars 등으로 가져온 변수의 전처리를 수행
     * 
     * @param obj
    */
    'objectify': (obj: object | Function) => unknown;
    /**
     * number, string, boolean이 아닌 값이 프롬프트에 반영될 때 호출됨
    */
    'stringify': (expr: unknown) => string;
    'iterate': (expr: unknown) => Iterator<unknown>;
}

export const OPERATOR_HOOKS = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'modulo',
    '>=': 'greaterOrEqual',
    '<=': 'lessOrEqual',
    '>': 'greater',
    '<': 'less',
    '!=': 'notEqual',
    '==': 'equal',
    '&&': 'logicalAnd',
    '||': 'logicalOr',
    '.': 'access',
    '[]': 'indexor',
    '()': 'call',
    'TOSTRING': 'stringify',
    'STRINGIFY': 'stringify',
    'OBJECTIFY': 'objectify',
    'ITERATE': 'iterate'
} as const;

export type ExpressionArgs = {
    // 사용자 지정
    vars: Vars;
    builtInVars: Vars
    expressionEventHooks: Partial<ExpressionEventHooks>;

    scope?: Vars;
}
