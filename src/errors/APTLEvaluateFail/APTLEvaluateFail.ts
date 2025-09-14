import BuildError from '../BuildError';
import { APTLErrorType } from '@/errors';
import { AnyExpression, ParamExpression } from '@/types/expressions';

export type FailExpression = Exclude<AnyExpression, ParamExpression>;

class APTLEvaluateFail extends BuildError {
    constructor(message: string, type:APTLErrorType, expr: FailExpression) {
        let text:string;
        try {
            text = expr.value.toString();
        }
        catch (e) {
            text = 'UNKNOWN';
        }

        super(message, {
            error_type: type,
            text : text,
            position: {
                begin: expr.position,
                end: expr.position + expr.size,
            },
        });
        this.name = 'APTLEvaluateFail';
    }
}

export default APTLEvaluateFail;