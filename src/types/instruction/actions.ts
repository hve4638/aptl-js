import { EvaluatableExpression } from '../expressions';
import { DirectiveFragment } from '../fragment';
import { BaseInstruction, InstructionType, InstructionCmd } from './base';

export const ActionCmd = {
    Jump: 'JUMP',
    ConditionalJump: 'CONDITIONAL_JUMP',
    JumpIfIterateDone: 'JUMP_IF_ITERATE_DONE',
    Break: 'BREAK',
    EnterScope: 'ENTER_SCOPE',
    ExitScope: 'EXIT_SCOPE',
    IterateInit: 'ITERATE_INIT',
    IterateNext: 'ITERATE_NEXT',
} as const;
export type ActionCmd = typeof ActionCmd[keyof typeof ActionCmd];

interface BaseActionInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Action;

    cmd: ActionCmd;
}

export namespace ActionInstruction {
    export interface Jump extends BaseActionInstruction {
        cmd: typeof ActionCmd.Jump;

        jump_to: number;
    }
    
    export interface ConditionalJump extends BaseActionInstruction {
        cmd: typeof ActionCmd.ConditionalJump;
        fragment: DirectiveFragment;
        
        expression: EvaluatableExpression;
        not: boolean;
        jump_to: number;
    }

    export interface JumpIfIterateDone extends BaseActionInstruction {
        cmd: typeof ActionCmd.JumpIfIterateDone;

        iterator_variable: string;
        jump_to: number;
    }

    export interface Break extends BaseActionInstruction {
        cmd: typeof ActionCmd.Break;
    }
    export interface EnterScope extends BaseActionInstruction {
        cmd: typeof ActionCmd.EnterScope;
    }

    export interface ExitScope extends BaseActionInstruction {
        cmd: typeof ActionCmd.ExitScope;
    }

    export interface IterateInit extends BaseActionInstruction {
        cmd: typeof ActionCmd.IterateInit;
        
        expression: EvaluatableExpression;
        iterator_variable: string;
    }

    export interface IterateNext extends BaseActionInstruction {
        cmd: typeof ActionCmd.IterateNext;
        iterator_variable: string;
        result_variable: string;
    }
}

export type ActionInstructions = (
    ActionInstruction.Jump
    | ActionInstruction.ConditionalJump
    | ActionInstruction.JumpIfIterateDone
    | ActionInstruction.Break
    | ActionInstruction.EnterScope
    | ActionInstruction.ExitScope
    | ActionInstruction.IterateInit
    | ActionInstruction.IterateNext
);