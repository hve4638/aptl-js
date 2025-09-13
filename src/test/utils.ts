import { APTLFail, APTLFailHint, APTLErrorType } from '@/errors';

export function getThrownError(callback: () => any) {
    try {
        callback();
    } catch (error) {
        return error;
    }
    throw new Error('Expected error but no error was thrown');
}

export function expectCBFFail(
    actualError: unknown,
    failType: APTLErrorType,
    hint: APTLFailHint
) {
    expect(actualError).toBeInstanceOf(APTLFail);
    if (actualError instanceof APTLFail) {
        const actual = {
            text: actualError.text,
            type: actualError.type,
            positionBegin: actualError.positionBegin,
            positionEnd: actualError.positionEnd,
        }
        const expected = {
            type: failType,
            text: hint.text,
            positionBegin: hint.positionBegin,
            positionEnd: hint.positionEnd,
        }
        expect(actual).toEqual(expected);
    }
}

export type PromptResult = {
    role: string;
    children: string[];
};