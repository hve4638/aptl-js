import APTL from '@/APTL';
import { TemplateOutput } from '@/types';

export type PromptResult = {
    role: string;
    text: string[];
};

export function formatPrompt(output: Generator<TemplateOutput>) {
    const result: PromptResult[] = [];

    APTL.format(output, {
        role: ({ role }) => {
            result.push({ role, text: [] });
        },
        text: ({ text }) => {
            const last = result.at(-1);

            if (last) last.text.push(text);
        },
    });

    return result;
}