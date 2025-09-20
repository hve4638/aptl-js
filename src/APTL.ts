import { APTLCompileFailed } from '@/errors';
import { default as Compiler } from '@/features/compiler';
import { default as Executor, type ExecuteArgs } from '@/features/instruction-executor';
import { CompileOutput, TemplateOutput } from '@/types';
import PromptFormatter, { BuildHandler } from '@/features/prompt-formatter';
export { default as PromptGenerator } from '@/PromptGenerator';
export {
    type APTLInstruction,
    type TemplateOutput,
    type CompileOutput,
} from '@/types';

class APTL {
    /**
     * 템플릿 문자열을 컴파일하고 실행하여 최종 결과물을 반환합니다.
     * 컴파일에 실패하면 APTLCompileFailed 예외를 발생시킵니다.
     * @param templateText - 처리할 템플릿 문자열입니다.
     * @param executeArgs - 템플릿 실행에 필요한 변수와 외부 함수(hook)를 포함하는 객체입니다.
     * @returns {TemplateOutput} 템플릿 처리 결과물입니다.
     * @throws {APTLCompileFailed} 컴파일 실패 시 발생하는 예외입니다.
     */
    static run(templateText: string, executeArgs: ExecuteArgs): Generator<TemplateOutput> {
        const compileOutput = this.compile(templateText);
        if (compileOutput.ok) {
            return this.execute(compileOutput, executeArgs);
        }
        else {
            throw new APTLCompileFailed(compileOutput.errors);
        }
    }

    /**
     * 템플릿 문자열을 컴파일하여 실행 가능한 명령어 집합으로 변환합니다.
     * @param templateText - 컴파일할 템플릿 문자열입니다.
     * @returns {CompileOutput} 컴파일 결과물 또는 오류 정보를 포함하는 객체입니다.
     */
    static compile(templateText: string): CompileOutput {
        return Compiler.compile(templateText);
    }

    /**
     * 컴파일된 결과물을 실행하여 최종 템플릿 결과물을 생성합니다.
     * @param compileOutput - `compile` 메서드로부터 반환된 컴파일 결과물입니다.
     * @param executeArgs - 템플릿 실행에 필요한 변수와 외부 함수(hook)를 포함하는 객체입니다.
     * @returns {Generator<TemplateOutput>} 최종적으로 렌더링된 템플릿 결과물입니다.
     */
    static execute(compileOutput: CompileOutput, executeArgs: ExecuteArgs): Generator<TemplateOutput> {
        return Executor.execute(compileOutput, executeArgs);
    }

    static format(output: Generator<TemplateOutput> | TemplateOutput[], handler: BuildHandler) {
        const formatter = new PromptFormatter(handler);

        formatter.format(output);
    }
}

export default APTL;