import { DirectiveFragment, DirectiveKeywords } from '@/types/fragment';
import { BaseInstruction, InstructionType, InstructionCmd } from './base';

interface BaseDirectiveInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Single;
    fragment: DirectiveFragment;

    cmd: typeof InstructionCmd.Directive;
    keyword: DirectiveKeywords;
}

export namespace DirectiveInstruction {
    export interface Role extends BaseDirectiveInstruction {
        keyword: typeof DirectiveKeywords.Role;
        role: string;
    }
    export interface Split extends BaseDirectiveInstruction {
        keyword: typeof DirectiveKeywords.Split;
    }
}

export type DirectiveInstructions = (
    DirectiveInstruction.Role
    | DirectiveInstruction.Split
);