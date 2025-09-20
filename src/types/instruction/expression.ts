import { EvaluatableExpression } from '@/types/expressions';
import { ExpressionFragment } from '@/types/fragment';

import { BaseInstruction, InstructionType, InstructionCmd } from './base';

export interface ExpressionInstruction extends BaseInstruction {
    instruction_type: typeof InstructionType.Single;
    fragment: ExpressionFragment;

    cmd: typeof InstructionCmd.Expression;
    expression: EvaluatableExpression;
}