import { APTLCompileFailed } from '@/errors';
import { default as Compiler } from '@/features/compiler';
import { default as Executor, type ExecuteArgs } from '@/features/instruction-executor';
import { CompileOutput } from '@/types';
export { default as PromptGenerator } from '@/PromptGenerator';
export {
    type APTLInstruction,
    type TemplateOutput,
    type CompileOutput,
} from '@/types';

class APTL {
    static run(templateText: string, executeArgs: ExecuteArgs) {
        const compileOutput = this.compile(templateText);
        if (compileOutput.ok) {
            return this.execute(compileOutput, executeArgs);
        }
        else {
            throw new APTLCompileFailed(compileOutput.errors);
        }
    }

    static compile(templateText: string) {
        return Compiler.compile(templateText);
    }

    static execute(compileOutput: CompileOutput, executeArgs: ExecuteArgs) {
        return Executor.execute(compileOutput, executeArgs);
    }
}

export default APTL;