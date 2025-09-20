import { Vars } from '@/types';
import { ExpressionEventHooks } from '@/features/expression-evaluator';


export type ExecuteArgs = {
    /**
     * {{ variableName }} 형태로 템플릿에서 접근하게되는 심볼의 값
     */
    vars: Vars;
    /**
     * {{ :variableName }} 형태로 템플릿에서 접근하게되는 심볼의 값
     */
    builtInVars: Vars;
    /**
     * 템플릿 실행 중 호출할 수 있는 외부 함수(훅)
     */
    hook: Partial<ExpressionEventHooks>;
}
