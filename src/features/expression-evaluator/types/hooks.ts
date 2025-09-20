import { Vars } from '@/types';
import {
    LiteralExpression,
    ObjectExpression
} from '@/types/expressions';

type AnyResult = ObjectExpression | LiteralExpression | string | number | boolean;
type ComparisonResult = LiteralExpression | boolean;

export type ExpressionEventHooks = {
    /** a + b */
    'add': (a: any, b: any) => AnyResult;
    /** a - b */
    'subtract': (a: any, b: any) => AnyResult;
    /** a * b */
    'multiply': (a: any, b: any) => AnyResult;
    /** a / b */
    'divide': (a: any, b: any) => AnyResult;
    /** a % b */
    'modulo': (a: any, b: any) => AnyResult;

    /** a >= b */
    'greaterOrEqual': (a: any, b: any) => ComparisonResult;
    /** a <= b */
    'lessOrEqual': (a: any, b: any) => ComparisonResult;
    /** a > b */
    'greater': (a: any, b: any) => ComparisonResult;
    /** a < b */
    'less': (a: any, b: any) => ComparisonResult;
    /** a != b */
    'notEqual': (a: any, b: any) => ComparisonResult;
    /** a == b */
    'equal': (a: any, b: any) => ComparisonResult;
    /** a && b */
    'logicalAnd': (a: any, b: any) => ComparisonResult;
    /** a || b */
    'logicalOr': (a: any, b: any) => ComparisonResult;

    /** expr.index */
    'access': (expr: any, field: any) => AnyResult;
    /** a[b] */
    'indexor': (expr: any, index: string | number) => AnyResult;
    /** a(...b) */
    'call': (expr: any, args: any[]) => AnyResult;

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
    'stringify': (expr: any) => string;
    'iterate': (expr: any) => Iterator<unknown>;
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
