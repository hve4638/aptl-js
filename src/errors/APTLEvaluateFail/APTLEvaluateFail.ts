import APTLFail from '../APTLFail';
import { APTLErrorType } from '@/errors';
import { AnyExpression, ParamExpression } from '@/types/expressions';

export type FailExpression = Exclude<AnyExpression, ParamExpression>;

class APTLEvaluateFail extends APTLFail {
    constructor(message: string, type:APTLErrorType, expr: FailExpression) {
        let text:string;
        try {
            text = expr.value.toString();
        }
        catch (e) {
            text = 'UNKNOWN';
        }

        super(message, type, {
            text : text,
            positionBegin : expr.position,
            positionEnd : expr.position + expr.size,
        });
        this.name = 'APTLEvaluateFail';
    }
}

export default APTLEvaluateFail;