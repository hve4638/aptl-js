import { Fragment } from '@/types/fragment';

import { APTLErrorType } from './APTLErrorType';
import APTLFail, { APTLFailHint } from './APTLFail';

class APTLBuildError extends APTLFail {
    constructor(message: string, errorType: APTLErrorType, fragment: Fragment) {
        let hint: APTLFailHint;
        try {
            hint = {
                positionBegin: fragment.position,
                positionEnd: fragment.position + fragment.value.length,
                text: fragment.value,
            }
        }
        catch (e) {
            hint = {
                positionBegin: 0,
                positionEnd: 0,
                text: 'UNKNOWN'
            }
        }

        super(message, errorType, hint);
        this.name = 'BuildError';
    }
}

export default APTLBuildError;