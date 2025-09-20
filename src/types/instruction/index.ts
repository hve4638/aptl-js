import { BaseInstruction, InstructionType } from './base';
import { ActionInstructions } from './actions';
import { DirectiveInstructions } from './directive';
import { ExpressionInstruction } from './expression';
import { TextContentInstruction } from './text';
import { NewlineInstruction } from './newline';

export type APTLInstruction = (
    ActionInstructions
    | DirectiveInstructions
    | ExpressionInstruction
    | TextContentInstruction
    | NewlineInstruction
    | GroupInstruction
)

export interface GroupInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Group;

    instructions: APTLInstruction[];
}

export type { DirectiveInstructions, DirectiveInstruction }  from './directive';
export { InstructionType, InstructionCmd } from './base';
export { ActionCmd } from './actions';