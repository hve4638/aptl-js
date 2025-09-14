import { CompileFailReason } from '@/types/fail';

class APTLCompileFailed extends Error {

    constructor(public reason: CompileFailReason[]) {
        super('APTL Compile Failed');
        this.name = 'APTLCompileFailed';
    }
}

export default APTLCompileFailed;