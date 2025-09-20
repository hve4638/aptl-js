import APTL, { TemplateOutput } from './APTL';
import { formatPrompt, PromptResult } from './test';


describe('APTL README Examples', () => {
    test('Basic', () => {
        const template = `
        {{#role system}}

        You are a helpful AI assistant. Please provide a helpful and accurate response.

        {{#role user}}

        {{:input}}
        `;

        const result = APTL.run(template, {
            vars: {},
            builtInVars: { input: '1 + 1 = ?' },
            hook: {}
        });
        const actual = formatPrompt(result);

        const expected: PromptResult[] = [
            {
                role: 'system',
                text: [
                    'You are a helpful AI assistant. Please provide a helpful and accurate response.'
                ]
            },
            {
                role: 'user',
                text: [
                    '1 + 1 = ?'
                ]
            }
        ]

        expect(actual).toEqual(expected);
    });

    describe('if', () => {
        test('Translation with conditional context', () => {
            const template = `
            Translate the following text from {{sourceLanguage}} to {{targetLanguage}}.

            {{#if context}}
            Context: {{context}}
            {{#endif}}

            {{#if tone}}
            Desired tone: {{tone}}
            {{#endif}}

            Text: {{:input}}
            `;

            const result = APTL.run(template, {
                vars: {
                    sourceLanguage: 'English',
                    targetLanguage: 'Korean',
                    context: 'Technical documentation',
                    tone: 'formal',
                },
                builtInVars: { input: 'The API endpoint accepts JSON payloads.', nl: '\n' },
                hook: {}
            });
            const actual = formatPrompt(result);
            const expected: PromptResult[] = [
                {
                    role: 'user',
                    text: [
                        'Translate the following text from English to Korean.\n'
                        + 'Context: Technical documentation\n'
                        + 'Desired tone: formal\n'
                        + 'Text: The API endpoint accepts JSON payloads.'
                    ]
                }
            ]

            expect(actual).toEqual(expected);
        });
    });

    describe('foreach', () => {
        test('Generate prompts for multiple API endpoints', () => {
            const template = `
Refer to the dictionary and translate the following text.

Dictionary
{{#foreach d in dict}}
- {{d.key}}: {{d.value}}
{{#endforeach}}

text: {{:input}}
            `;

            const result = APTL.run(template, {
                vars: {
                    dict: [
                        {
                            key: 'apple',
                            value: '애플'
                        },
                        {
                            key: 'samsung',
                            value: '삼성'
                        }
                    ]
                },
                builtInVars: { input: 'Apple and Samsung are tech companies.' },
                hook: {
                    iterate: (array: any) => array.values(),
                    access: (obj: any, key) => obj[key],
                }
            });
            const actual = formatPrompt(result);
            const expected: PromptResult[] = [
                {
                    role: 'user',
                    text: [
                        'Refer to the dictionary and translate the following text.\n'
                        + '\n'
                        + 'Dictionary\n'
                        + '- apple: 애플\n'
                        + '- samsung: 삼성\n'
                        + 'text: Apple and Samsung are tech companies.'
                    ]
                }
            ];

            expect(actual).toEqual(expected);
        });

        test('Reusable prompt template', () => {
            const template = `
Refer to the dictionary and translate the following text.

Dictionary:{{#foreach_inline d in dict}} {{d.key}}({{d.value}});{{#endforeach}}

text: {{:input}}
            `;

            const result = APTL.run(template, {
                vars: {
                    dict: [
                        {
                            key: 'apple',
                            value: '애플'
                        },
                        {
                            key: 'samsung',
                            value: '삼성'
                        }
                    ]
                },
                builtInVars: { input: 'Apple and Samsung are tech companies.' },
                hook: {
                    iterate: (array: any) => array.values(),
                    access: (obj: any, key) => obj[key],
                }
            });

            const actual = formatPrompt(result);
            const expected: PromptResult[] = [
                {
                    role: 'user',
                    text: [
                        'Refer to the dictionary and translate the following text.\n'
                        + '\n'
                        + 'Dictionary: apple(애플); samsung(삼성);\n'
                        + '\n'
                        + 'text: Apple and Samsung are tech companies.'
                    ]
                }
            ];

            expect(actual).toEqual(expected);
        });

        test('if_inline', () => {
            const template = `
Translate the following text. {{#if_inline detail}}Write the original text and its translation in alternating order.{{#endif}}

text: {{:input}}
            `;

            const result = APTL.run(template, {
                vars: {
                    detail: true,
                },
                builtInVars: { input: 'Hello world' },
                hook: {}
            });

            const actual = formatPrompt(result);
            const expected: PromptResult[] = [
                {
                    role: 'user',
                    text: [
                        'Translate the following text. Write the original text and its translation in alternating order.\n'
                        + '\n'
                        + 'text: Hello world'
                    ]
                },
            ];

            expect(actual).toEqual(expected);
        });
    });
});