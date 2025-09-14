import { EvaluatableExpression } from '@/types/expressions';
import { DirectiveFragment, ExpressionFragment } from '@/types/fragment';
import { InstructionType } from '@/types/instruction';
import { ActionCmd, ActionInstructions } from '@/types/instruction/actions';
import ExpressionBuilder from './ExpressionBuilder';
import { APTLErrorType, FragmentError } from '@/errors';

class ActionTemplate {
    static enterScope(): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.EnterScope,
        };
    }
    static exitScope(): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.ExitScope,
        };
    }
    static jump(jumpTo: number): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.Jump,
            jump_to: jumpTo,
        };
    }
    static break(): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.Break,
        };
    }
    static jumpConditional(fragment: DirectiveFragment, jumpTo: number): ActionInstructions {
        const directive = fragment.directive.text.toLowerCase();
        if (directive !== 'if' && directive !== 'elseif') {
            throw new FragmentError(
                `Use '#if' or '#elseif' directive with condition expression`,
                APTLErrorType.INVALID_DIRECTIVE,
                fragment
            );
        }
        
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.ConditionalJump,
            fragment: fragment,

            expression: ExpressionBuilder.build(fragment.field.text, { position: fragment.field.position }),
            not: false,
            jump_to: jumpTo,
        };
    }
    static iterateInit(expression: EvaluatableExpression, iterator_variable: string): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.IterateInit,

            expression: expression,
            iterator_variable: iterator_variable,
        };
    }
    static iterateNext(iterate_variable: string, result_variable: string): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.IterateNext,

            iterator_variable: iterate_variable,
            result_variable: result_variable,
        };
    }
    static jumpIfIterateDone(iterator_variable: string, jumpTo: number): ActionInstructions {
        return {
            instruction_type: InstructionType.Action,
            cmd: ActionCmd.JumpIfIterateDone,

            iterator_variable: iterator_variable,
            jump_to: jumpTo,
        };
    }
}

export default ActionTemplate;