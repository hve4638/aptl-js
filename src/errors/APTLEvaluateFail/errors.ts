import { APTLErrorType } from '../types';

import APTLEvaluateFail, { FailExpression } from './APTLEvaluateFail';

export class NoHookError extends APTLEvaluateFail {
    constructor(hookName: string, expr: FailExpression) {
        super(
            `No hook found for '${hookName}'`,
            APTLErrorType.NO_HOOK,
            expr
        );
        this.name = 'NoHookError';
    }
}

export class HookError extends APTLEvaluateFail {
    constructor(error: Error, expr: FailExpression) {
        super(
            `${error.name} in hook : '${error.message}'`,
            APTLErrorType.EXCEPTION_IN_HOOK,
            expr
        );
        this.name = 'HookError';
    }
}

export class IdentifierResolveFail extends APTLEvaluateFail {
    constructor(message: string, expr: FailExpression) {
        super(message, APTLErrorType.IDENTIFIER_RESOLVE_FAIL, expr);
        this.name = 'IdentifierResolveFail';
    }
}

export class OperatorNotSupportedError extends APTLEvaluateFail {
    constructor(operator: string, expr: FailExpression) {
        super(
            `Unsupport operator : '${operator}'`,
            APTLErrorType.OPERATOR_NOT_SUPPORTED,
            expr
        );
        this.name = 'OperatorNotSupportedError';
    }
}

export class InvalidASTFormatError extends APTLEvaluateFail {
    constructor(message: string, expr: FailExpression) {
        super(message, APTLErrorType.INVALID_AST_FORMAT, expr);
        this.name = 'InvalidASTFormatError';
    }
}

