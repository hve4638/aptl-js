type StringResult = {
    value: string;
    left: string;
    right: string;
    position: number;
}

/**
 * Utility class for string manipulation operations with detailed tracking of positions and context.
 */
export class StringUtils {
    /**
     * Removes whitespace from both ends of a string and returns detailed information.
     * @param text - The string or StringResult to trim
     * @returns Object containing the trimmed value, removed whitespace, and original position
     */
    static trim(text: string | StringResult): StringResult {
        if (typeof text === 'string') {
            const value = text.trim();
            const leftTrimmed = text.trimStart();
            const position = text.length - leftTrimmed.length;
            const left = text.slice(0, position);
            const right = leftTrimmed.slice(value.length);

            return { value, left, right, position };
        }
        else {
            const value = text.value.trim();
            const leftTrimmed = text.value.trimStart();
            const leftWhitespace = text.value.slice(0, text.value.length - leftTrimmed.length);
            const rightWhitespace = leftTrimmed.slice(value.length);

            return {
                value,
                left: text.left + leftWhitespace,
                right: rightWhitespace + text.right,
                position: text.position + leftWhitespace.length
            };
        }
    }

    /**
     * Removes whitespace from the left end of a string and returns detailed information.
     * @param text - The string or StringResult to trim
     * @returns Object containing the trimmed value, removed left whitespace, and original position
     */
    static trimLeft(text: string | StringResult): StringResult {
        if (typeof text === 'string') {
            const value = text.trimStart();
            const position = text.length - value.length;
            const left = text.slice(0, position);

            return { value, left, right: '', position };
        }
        else {
            const value = text.value.trimStart();
            const leftWhitespace = text.value.slice(0, text.value.length - value.length);

            return {
                value,
                left: text.left + leftWhitespace,
                right: text.right,
                position: text.position + leftWhitespace.length
            };
        }
    }

    /**
     * Removes whitespace from the right end of a string and returns detailed information.
     * @param text - The string or StringResult to trim
     * @returns Object containing the trimmed value and removed right whitespace
     */
    static trimRight(text: string | StringResult): StringResult {
        if (typeof text === 'string') {
            const value = text.trimEnd();
            const right = text.slice(value.length);

            return { value, left: '', right, position: 0 };
        }
        else {
            const value = text.value.trimEnd();
            const rightWhitespace = text.value.slice(value.length);

            return {
                value,
                left: text.left,
                right: rightWhitespace + text.right,
                position: text.position
            };
        }
    }

    /**
     * Splits a string by delimiter and tracks positions with left/right context.
     * @param text - The string or StringResult to split
     * @param delimiter - The delimiter to split by
     * @returns Array of objects containing each part, position, and surrounding context
     */
    static split(text: string | StringResult, delimiter: string): StringResult[] {
        const result: StringResult[] = [];

        if (typeof text === 'string') {
            const parts = text.split(delimiter);
            let currentPosition = 0;

            for (let i = 0; i < parts.length; i++) {
                const value = parts[i];
                const left = text.substring(0, currentPosition);
                const right = text.substring(currentPosition + value.length);

                result.push({ value, position: currentPosition, left, right });
                currentPosition += value.length + (i < parts.length - 1 ? delimiter.length : 0);
            }

            return result;
        }
        else {
            const parts = text.value.split(delimiter);
            let valuePosition = 0;
            let currentPosition = text.position;
            const fullText = text.left + text.value + text.right;

            for (let i = 0; i < parts.length; i++) {
                const value = parts[i];
                const left = fullText.substring(0, currentPosition);
                const right = fullText.substring(currentPosition + value.length);

                result.push({ value, position: currentPosition, left, right });

                valuePosition += value.length + (i < parts.length - 1 ? delimiter.length : 0);
                currentPosition = text.position + valuePosition;
            }

            return result;
        }
    }
}