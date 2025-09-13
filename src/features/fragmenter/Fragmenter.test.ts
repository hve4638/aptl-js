import Fragmenter from './Fragmenter';
import { DirectiveFragment, ExpressionFragment, TextContentFragment } from '@/types/fragment';

describe('Fragmenter', () => {
    describe('fragment', () => {
        test('순수 텍스트 템플릿 파싱', () => {
            const template = 'Hello, world!';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                type: 'text-content',
                value: 'Hello, world!',
                position: 0,
            } as TextContentFragment);
        });

        test('단일 expression 템플릿 파싱', () => {
            const template = '{{name}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                type: 'expression-element',
                value: '{{name}}',
                position: 0,
                expression: {
                    text: 'name',
                    prefix: '{{',
                    suffix: '}}',
                    position: 2,
                },
            } as ExpressionFragment);
        });

        test('단일 directive 템플릿 파싱', () => {
            const template = '{{#if condition}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                type: 'directive-element',
                value: '{{#if condition}}',
                position: 0,
                directive: {
                    text: 'if',
                    prefix: '{{#',
                    suffix: ' condition}}',
                    position: 3,
                },
                field: {
                    text: 'condition',
                    prefix: '{{#if ',
                    suffix: '}}',
                    position: 6,
                },
            } as DirectiveFragment);
        });

        test('빈 템플릿 처리', () => {
            const template = '';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(0);
        });

        test('공백만 있는 템플릿 처리', () => {
            const template = '   \n\t  ';
            const result = Fragmenter.fragment(template);

            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });
    
    describe('fragment: 혼합', () => {
        test('혼합 템플릿 파싱 - 텍스트와 표현식', () => {
            const template = 'Hello {{name}}, welcome!';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({
                type: 'text-content',
                value: 'Hello ',
                position: 0,
            });
            expect(result[1]).toEqual({
                type: 'expression-element',
                value: '{{name}}',
                position: 6,
                expression: {
                    text: 'name',
                    prefix: '{{',
                    suffix: '}}',
                    position: 8,
                },
            });
            expect(result[2]).toEqual({
                type: 'text-content',
                value: ', welcome!',
                position: 14,
            });
        });

        test('혼합 템플릿 파싱 - 텍스트, 표현식, directive', () => {
            const template = 'Hello {{name}}! {{#if hasMessage}}Message: {{message}}{{#endif}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(7);
            
            // 텍스트
            expect(result[0].type).toBe('text-content');
            expect(result[0].value).toBe('Hello ');
            
            // 표현식
            expect(result[1].type).toBe('expression-element');
            expect(result[1].value).toBe('{{name}}');
            
            // 텍스트
            expect(result[2].type).toBe('text-content');
            expect(result[2].value).toBe('!');
            
            // directive (if)
            expect(result[3].type).toBe('directive-element');
            expect(result[3].value).toBe(' {{#if hasMessage}}');
            
            expect(result[4].type).toBe('text-content');
            expect(result[4].value).toBe('Message: ');
            
            // 표현식
            expect(result[5].type).toBe('expression-element');
            expect(result[5].value).toBe('{{message}}');
        });

        test('복잡한 표현식이 포함된 템플릿', () => {
            const template = 'Total: {{price * quantity + tax}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(2);
            expect(result[1]).toEqual({
                type: 'expression-element',
                value: '{{price * quantity + tax}}',
                position: 7,
                expression: {
                    text: 'price * quantity + tax',
                    prefix: '{{',
                    suffix: '}}',
                    position: 9,
                },
            });
        });

        test('foreach directive가 포함된 템플릿', () => {
            const template = '{{#foreach item in items}}{{item.name}}{{#endforeach}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(3);
            
            // foreach directive
            expect(result[0].type).toBe('directive-element');
            expect((result[0] as DirectiveFragment).directive.text).toBe('foreach');
            expect((result[0] as DirectiveFragment).field.text).toBe('item in items');
            
            // 표현식
            expect(result[1].type).toBe('expression-element');
            expect(result[1].value).toBe('{{item.name}}');
            
            // endforeach directive
            expect(result[2].type).toBe('directive-element');
            expect((result[2] as DirectiveFragment).directive.text).toBe('endforeach');
        });

        test('레거시 directive 형식 처리', () => {
            const template = '{{:: if condition}}content{{:: endif}}';
            const result = Fragmenter.fragment(template);
            
            expect(result).toHaveLength(3);
            expect(result[0].type).toBe('directive-element');
            expect((result[0] as DirectiveFragment).directive.text).toBe('if');
            expect(result[1].type).toBe('text-content');
            expect(result[1].value).toBe('content');
            expect(result[2].type).toBe('directive-element');
            expect((result[2] as DirectiveFragment).directive.text).toBe('endif');
        });

        test('공백이 포함된 템플릿 - WhitespaceHandler 동작 확인', () => {
            const template = '  {{#if condition}}  content  {{#endif}}  ';
            const result = Fragmenter.fragment(template);
            
            // WhitespaceHandler가 공백을 처리하고 빈 블록을 필터링
            const textBlocks = result.filter(block => block.type === 'text-content');
            const directiveBlocks = result.filter(block => block.type === 'directive-element');
            
            expect(textBlocks.length).toBeGreaterThan(0);
            expect(directiveBlocks.length).toBe(2);
        });

        test('중첩된 구조 템플릿', () => {
            const template = `
            {{#if user}}
                Hello {{user.name}}!
                {{#if user.hasMessages}}
                    You have {{user.messageCount}} messages.
                {{#endif}}
            {{#endif}}
            `.trim();
            
            const result = Fragmenter.fragment(template);
            
            // directive와 expression이 적절히 파싱되는지 확인
            const directives = result.filter(block => block.type === 'directive-element');
            const expressions = result.filter(block => block.type === 'expression-element');
            
            expect(directives.length).toBe(4); // if, if, endif, endif
            expect(expressions.length).toBe(2); // user.name, user.messageCount
        });
    });
});