import { APTLInstruction } from '@/types/instruction';
import { CompileFailReason } from './fail';

export type CompileOutput = {
    ok: boolean;
    instructions: APTLInstruction[];
    errors: CompileFailReason[];
}