import { BuildError, APTLErrorType } from '@/errors';
import { CompileFailReason } from '@/types/fail';

export function getThrownError(callback: () => any) {
    try {
        callback();
    } catch (error) {
        return error;
    }
    throw new Error('Expected error but no error was thrown');
}

export function expectAPTLFail(
    actualError: unknown,
    compileFail: CompileFailReason,
) {
    expect(actualError).toBeInstanceOf(BuildError);
    if (actualError instanceof BuildError) {
        const actual = actualError.reason;
        
        expect(actual).toEqual(compileFail);
    }
}

export type PromptResult = {
    role: string;
    children: string[];
};