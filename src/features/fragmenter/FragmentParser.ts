import { Fragment } from '@/types/fragment';
import { TemplatePattern } from './patterns';

export class FragmentParser {
    /**
     * 템플릿 문자열을 Fragment 배열로 분리
     */
    static parse(template: string): Fragment[] {
        const blocks: Fragment[] = [];
        const parts = TemplatePattern.splitElements(template);

        let position = 0;
        for (const part of parts) {
            if (part.length === 0) continue;

            const block = this.#parseElementBlock(part, position);
            blocks.push(block);

            position += part.length;
        }

        return blocks;
    }

    static #parseElementBlock(text: string, position: number): Fragment {
        if (!(text.startsWith('{{') && text.endsWith('}}'))) {
            return { type: 'text-content', value: text, position };
        }
        else if (TemplatePattern.isDirective(text)) {
            const info = TemplatePattern.parseDirective(text);
            if (info) {
                const { directive, field } = info;
                return {
                    type: 'directive-element',
                    value: text,
                    position,

                    directive: {
                        text: directive.text,
                        prefix: directive.prefix,
                        suffix: directive.suffix,
                        position: position + directive.prefix.length,
                    },
                    field: {
                        text: field.text,
                        prefix: field.prefix,
                        suffix: field.suffix,
                        position: position + field.prefix.length,
                    },
                };
            }
        }
        else if (TemplatePattern.isExpression(text)) {
            const info = TemplatePattern.parseExpression(text);

            if (info) {
                const { expression } = info;

                return {
                    type: 'expression-element',
                    value: text,
                    position,

                    expression: {
                        text: expression.text,
                        prefix: expression.prefix,
                        suffix: expression.suffix,
                        position: position + expression.prefix.length,
                    },
                };
            }
        }

        return { type: 'text-content', value: text, position }; //fallback
    }
}