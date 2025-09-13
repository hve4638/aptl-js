// {{}} 패턴
export const TEMPLATE_ELEMENT_PATTERN = /(\{\{.*?\}\})/ms;

// directive 파싱용 정규식 - 키워드와 필드 추출
export const DIRECTIVE_PARSER = /(\{\{\s*)(#)(\S+)(\s*)(?:(.*?))?(\s*\}\})/ms;
export const DIRECTIVE_LEGACY_PARSER = /(\{\{\s*)(::)(\s*)(\S+)(\s*)(?:(.*?))?(\s*\}\})/ms;

// 표현식 분할용 정규식 패턴 - {{...}} 형태 매칭
export const EXPRESSION_PATTERN = /(\{\{[^{}]*?\}\})/ms;
export const EXPRESSION_PARSER = /(\{\{\s*)(.*?)(\s*\}\})/ms;


export class TemplatePattern {
    /** {{}} 패턴 기준으로 분할 */
    static splitElements(template: string): string[] {
        return template.split(TEMPLATE_ELEMENT_PATTERN);
    }

    static isDirective(text: string): boolean {
        return DIRECTIVE_PARSER.test(text) || DIRECTIVE_LEGACY_PARSER.test(text);
    }

    static isExpression(text: string): boolean {
        return EXPRESSION_PARSER.test(text) && !this.isDirective(text);
    }

    static parseDirective(text: string) {
        const match = text.match(DIRECTIVE_PARSER);
        if (match) {
            const [_, open, marker, directive, ws, field = '', close] = match;

            return {
                directive: {
                    text: directive,
                    prefix: open + marker,
                    suffix: ws + field + close,
                },
                field: {
                    text: field,
                    prefix: open + marker + directive + ws,
                    suffix: close
                }
            };
        }

        const matchLegacy = text.match(DIRECTIVE_LEGACY_PARSER);
        if (matchLegacy) {
            const [_, open, marker, ws1, directive, ws2, field = '', close] = matchLegacy;

            return {
                directive: {
                    text: directive,
                    prefix: open + marker + ws1,
                    suffix: ws2 + field + close,
                },
                field: {
                    text: field,
                    prefix: open + marker + ws1 + directive + ws2,
                    suffix: close
                }
            };
        }

        return null;
    }

    static parseExpression(text: string) {
        const match = text.match(EXPRESSION_PARSER);
        if (!match) return null;

        return {
            fullText: match[0],

            expression: {
                text: match[2],
                prefix: match[1],
                suffix: match[3],
            },
        };
    }
}