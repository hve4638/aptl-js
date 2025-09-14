import { CompileFailReason } from '@/types/fail';

class BuildError extends Error {
    #reason: CompileFailReason;

    constructor(message: string, reason: CompileFailReason) {
        super(message);
        this.name = 'BuildError';
        this.#reason = reason;
    }

    get reason() {
        return this.#reason;
    }
}

export default BuildError;