import { TemplatePattern } from './patterns';

describe('TemplatePattern', () => {
    describe('splitElements', () => {
        test('{{}} 패턴으로 템플릿을 분할해야 함', () => {
            const template = 'Hello {{name}}, welcome to {{place}}!';
            const result = TemplatePattern.splitElements(template);
            expect(result).toEqual(['Hello ', '{{name}}', ', welcome to ', '{{place}}', '!']);
        });

        test('패턴이 없는 템플릿을 처리해야 함', () => {
            const template = 'Just plain text';
            const result = TemplatePattern.splitElements(template);
            expect(result).toEqual(['Just plain text']);
        });

        test('패턴만 있는 템플릿을 처리해야 함', () => {
            const template = '{{first}}{{second}}';
            const result = TemplatePattern.splitElements(template);
            expect(result).toEqual(['', '{{first}}', '', '{{second}}', '']);
        });

        test('인접한 패턴들을 처리해야 함', () => {
            const template = '{{a}}{{b}}{{c}}';
            const result = TemplatePattern.splitElements(template);
            expect(result).toEqual(['', '{{a}}', '', '{{b}}', '', '{{c}}', '']);
        });
    });

    describe('isDirective', () => {
        test('directive 식별', () => {
            expect(TemplatePattern.isDirective('{{#if condition}}')).toBe(true);
            expect(TemplatePattern.isDirective('{{#foreach items}}')).toBe(true);
            expect(TemplatePattern.isDirective('{{#endif}}')).toBe(true);
        });

        test('directive 식별 (레거시)', () => {
            expect(TemplatePattern.isDirective('{{:: if condition}}')).toBe(true);
            expect(TemplatePattern.isDirective('{{::foreach items}}')).toBe(true);
        });

        test('expression을 directive 식별하지 않아야 함', () => {
            expect(TemplatePattern.isDirective('{{variable}}')).toBe(false);
            expect(TemplatePattern.isDirective('{{obj.prop}}')).toBe(false);
            expect(TemplatePattern.isDirective('{{func()}}')).toBe(false);
        });

        test('공백 변형 처리', () => {
            expect(TemplatePattern.isDirective('{{ #if condition }}')).toBe(true);
            expect(TemplatePattern.isDirective('{{  ::  if  condition  }}')).toBe(true);
            expect(TemplatePattern.isDirective('{{    ::if  condition  }}')).toBe(true);
            expect(TemplatePattern.isDirective('{{::    if  condition  }}')).toBe(true);
        });
    });

    describe('isExpression', () => {
        test('expression 식별', () => {
            expect(TemplatePattern.isExpression('{{variable}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{obj.prop}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{func()}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{a + b * c}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{arr[index]}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{obj.method().prop}}')).toBe(true);
        });

        test('directive를 expression으로 식별하지 않아야 함', () => {
            expect(TemplatePattern.isExpression('{{#if condition}}')).toBe(false);
            expect(TemplatePattern.isExpression('{{:: if condition}}')).toBe(false);
        });

        test('공백 변형 처리', () => {
            expect(TemplatePattern.isExpression('{{ variable }}')).toBe(true);
            expect(TemplatePattern.isExpression('{{  complex.expression  }}')).toBe(true);
        });
    });

    describe('parseDirective', () => {
        test('표준 directive 형식 파싱', () => {
            const result = TemplatePattern.parseDirective('{{#if condition}}');
            expect(result).toBeTruthy();
            expect(result!.directive).toEqual({
                text: 'if',
                prefix: '{{#',
                suffix: ' condition}}',
            });
            expect(result!.field).toEqual({
                text: 'condition',
                prefix: '{{#if ',
                suffix: '}}',
            });
        });

        test('레거시 directive 형식 파싱', () => {
            const result = TemplatePattern.parseDirective('{{:: if condition}}');
            expect(result).toBeTruthy();
            expect(result!.directive).toEqual({
                text: 'if',
                prefix: '{{:: ',
                suffix: ' condition}}',
            });
            expect(result!.field).toEqual({
                text: 'condition',
                prefix: '{{:: if ',
                suffix: '}}',
            });
        });

        test('빈 필드 directive 형식 파싱', () => {
            const result = TemplatePattern.parseDirective('{{#endif}}');
            expect(result).toBeTruthy();
            expect(result!.directive).toEqual({
                text: 'endif',
                prefix: '{{#',
                suffix: '}}',
            });
            expect(result!.field).toEqual({
                text: '',
                prefix: '{{#endif',
                suffix: '}}',
            });
        });

        test('공백 변형을 처리', () => {
            const result = TemplatePattern.parseDirective('{{ #if  condition  }}');
            expect(result).toBeTruthy();
            expect(result!.directive).toEqual({
                text: 'if',
                prefix: '{{ #',
                suffix: '  condition  }}',
            });
            expect(result!.field).toEqual({
                text: 'condition',
                prefix: '{{ #if  ',
                suffix: '  }}',
            });
        });

        test('non-directive: null을 반환', () => {
            expect(TemplatePattern.parseDirective('{{variable}}')).toBe(null);
            expect(TemplatePattern.parseDirective('plain text')).toBe(null);
            expect(TemplatePattern.parseDirective('{incomplete')).toBe(null);
        });

        test('복잡한 필드 내용을 처리해야 함', () => {
            const result = TemplatePattern.parseDirective('{{#foreach item in items}}');
            expect(result).toBeTruthy();
            expect(result!.directive).toEqual({
                text: 'foreach',
                prefix: '{{#',
                suffix: ' item in items}}',
            });
            expect(result!.field).toEqual({
                text: 'item in items',
                prefix: '{{#foreach ',
                suffix: '}}',
            });
        });
    });

    describe('parseExpression', () => {
        test('expression 파싱1', () => {
            const result = TemplatePattern.parseExpression('{{variable}}');
            expect(result).toBeTruthy();
            expect(result!.expression).toEqual({
                text: 'variable',
                prefix: '{{',
                suffix: '}}',
            });
            expect(result!.fullText).toBe('{{variable}}');
        });

        test('expression 파싱2', () => {
            const result = TemplatePattern.parseExpression('{{obj.prop[0] + func()}}');
            expect(result).toBeTruthy();
            expect(result!.expression).toEqual({
                text: 'obj.prop[0] + func()',
                prefix: '{{',
                suffix: '}}',
            });
        });

        test('공백 처리', () => {
            const result = TemplatePattern.parseExpression('{{ variable }}');
            expect(result).toBeTruthy();
            expect(result!.expression).toEqual({
                text: 'variable',
                prefix: '{{ ',
                suffix: ' }}',
            });
        });

        test('non-expression에 대해 null을 반환', () => {
            expect(TemplatePattern.parseExpression('plain text')).toBe(null);
            expect(TemplatePattern.parseExpression('{incomplete')).toBe(null);
            expect(TemplatePattern.parseExpression('')).toBe(null);
        });

        test('빈 표현식을 처리', () => {
            const result = TemplatePattern.parseExpression('{{}}');
            expect(result).toBeTruthy();
            expect(result!.expression).toEqual({
                text: '',
                prefix: '{{',
                suffix: '}}',
            });
        });
    });

    describe('엣지 케이스', () => {
        test('중첩된 브레이스 처리', () => {
            const template = '{{obj[{nested: true}]}}';
            const elements = TemplatePattern.splitElements(template).filter(el => el.length > 0);

            expect(elements)
                .toEqual(['{{obj[{nested: true}]}}']);
        });

        test('멀티라인 템플릿 처리', () => {
            let template = `Hello {{name}},\n`
            template += `Welcome to {{place}}!\n`
            template += `{{#if hasMessage}}\n`
            template += `Your message: {{message}}\n`
            template += `{{#endif}}`;

            const elements = TemplatePattern.splitElements(template).filter(el => el.length > 0);
            expect(elements)
                .toEqual([
                    'Hello ',
                    '{{name}}',
                    ',\nWelcome to ',
                    '{{place}}',
                    '!\n',
                    '{{#if hasMessage}}',
                    '\nYour message: ',
                    '{{message}}',
                    '\n',
                    '{{#endif}}'
                ]);
        });

        test('표현식 내 특수문자를 처리해야 함', () => {
            expect(TemplatePattern.isExpression('{{user["first-name"]}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{items[0].value}}')).toBe(true);
            expect(TemplatePattern.isExpression('{{a + b - c * d / e}}')).toBe(true);
        });

        test('이스케이프된 문자를 처리해야 함', () => {
            const result = TemplatePattern.parseExpression('{{"\\"quoted string\\""}}');

            expect(result).toBeTruthy();
            expect(result!.expression.text).toBe('"\\"quoted string\\""');
        });
    });
});