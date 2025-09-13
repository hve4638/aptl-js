import { Vars } from '@/types';
import { ExpressionEventHooks } from '@/features/expression-evaluator';


export type ExecuteArgs = {
    vars: Vars;
    builtInVars: Vars;
    hook: Partial<ExpressionEventHooks>;
}
