import { TextContentFragment } from '@/types/fragment';

import { BaseInstruction, InstructionType, InstructionCmd } from './base';

export interface TextContentInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Single;
    fragment: TextContentFragment;

    cmd: typeof InstructionCmd.Text;
    text: string;
}