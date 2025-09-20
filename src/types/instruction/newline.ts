import { BaseInstruction, InstructionCmd, InstructionType } from './base';

export interface NewlineInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Single;
    cmd: typeof InstructionCmd.Newline;
}