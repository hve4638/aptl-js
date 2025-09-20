import { Fragment } from '@/types/fragment';

import BuildError from './BuildError';
import { APTLErrorType } from './types';

class FragmentError extends BuildError {
    constructor(message: string, errorType: APTLErrorType, fragment: Fragment) {
        super(message, {
            error_type: errorType,
            position: {
                begin: fragment.position,
                end: fragment.position + fragment.value.length,
            },
            text: fragment.value,
        });
        this.name = 'FragmentError';
    }
}

export default FragmentError;