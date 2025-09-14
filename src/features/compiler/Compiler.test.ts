import Compiler from './Compiler';
import { InstructionType, InstructionCmd } from '@/types/instruction';

describe('Compiler', () => {
    describe('compile', () => {
        test('순수 텍스트 템플릿 컴파일', () => {
            const template = 'Hello, world!';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(1);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Text,
                text: 'Hello, world!'
            });
        });

        test('단일 expression 템플릿 컴파일', () => {
            const template = '{{name}}';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(1);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Expression
            });
        });

        test('혼합 템플릿 컴파일', () => {
            const template = 'Hello {{name}}, welcome!';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(3);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Text,
                text: 'Hello '
            });
            expect(instructions[1]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Expression
            });
            expect(instructions[2]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Text,
                text: ', welcome!'
            });
        });

        test('if 디렉티브가 포함된 템플릿 컴파일', () => {
            const template = '{{#if condition}}Show this{{#endif}}';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(1);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Group
            });
        });

        test('foreach 디렉티브가 포함된 템플릿 컴파일', () => {
            const template = '{{#foreach item in items}}{{item}}{{#endforeach}}';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(1);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Group
            });
        });

        test('복잡한 중첩 템플릿 컴파일', () => {
            const template = `
            Hello {{name}}!
            {{#if showItems}}
            Items:
            {{#foreach item in items}}
            - {{item.name}}: {{item.value}}
            {{#endforeach}}
            {{#endif}}
            Thank you!
            `;
            const { instructions } = Compiler.compile(template);

            expect(instructions.length).toBeGreaterThan(0);

            const ifInstruction = instructions.find(inst => inst.instruction_type === InstructionType.Group);
            expect(ifInstruction).toBeDefined();
        });

        test('빈 템플릿 컴파일', () => {
            const template = '';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(0);
        });

        test('공백만 있는 템플릿 컴파일', () => {
            const template = '   \n\t  ';
            const { instructions } = Compiler.compile(template);

            expect(instructions).toHaveLength(1);
            expect(instructions[0]).toMatchObject({
                instruction_type: InstructionType.Single,
                cmd: InstructionCmd.Text
            });
        });
    });
});