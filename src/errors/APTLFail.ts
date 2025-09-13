import { APTLErrorType } from '@/errors';

export type APTLFailHint = {
    positionBegin: number;
    positionEnd: number;
    text: string;
}

class APTLFail extends Error {
    #hint: APTLFailHint;
    #type: APTLErrorType;

    constructor(message: string, errorType: APTLErrorType, hint: APTLFailHint) {
        super(message);
        this.name = 'CBFFailError';
        this.#type = errorType;
        this.#hint = hint;
    }

    get type() {
        return this.#type;
    }
    get positionBegin() {
        return this.#hint.positionBegin;
    }
    get positionEnd() {
        return this.#hint.positionEnd;
    }
    get text() {
        return this.#hint.text;
    }
}

export default APTLFail;