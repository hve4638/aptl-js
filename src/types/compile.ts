import { APTLFail } from '@/errors';
import { APTLInstruction } from '@/types/instruction';

export type CompileResult = {
    ok: boolean;
    instructions: APTLInstruction[];
    errors: APTLFail[];
}