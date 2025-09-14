import { DirectiveFragment, DirectiveKeywords, Fragment } from '@/types/fragment';
import { APTLInstruction, GroupInstruction, InstructionType } from '@/types/instruction';
import { IInstructionBuilder } from './interfaces';
import { FragmentError } from '@/errors';
import { APTLErrorType } from '@/errors';
import ActionTemplate from './ActionTemplate';
import { DirectiveHandlers } from './types';

type ConditionalBlock = {
    fragment: DirectiveFragment,    // 조건 디렉티브 Fragment
    instruction: GroupInstruction,  // 해당 조건에서 실행될 명령어 그룹
};

class IfSequenceBuilder {
    #directiveHandler: DirectiveHandlers = {
        [DirectiveKeywords.ElseIf]: (f) => this.#handleElseIf(f),
        [DirectiveKeywords.Elif]: (f) => this.#handleElseIf(f),
        [DirectiveKeywords.Else]: (f) => this.#handleElse(f),
        [DirectiveKeywords.EndIf]: () => {
            this.#exitSignal = true;
            return null;
        },
    }

    /** 각 조건 블럭(if, elseif)을 저장하는 배열 */
    #conditions: ConditionalBlock[] = [];
    /** else 블럭이 존재하는 경우 */
    #elseCondition: ConditionalBlock | null = null;
    /** #endif 만날시 true 지정 */
    #exitSignal = false;

    #fragmentGen: Generator<Fragment>;
    #instBuilder: IInstructionBuilder;

    constructor(
        current: DirectiveFragment,
        fragmentGen: Generator<Fragment>,
        instructionBuilder: IInstructionBuilder,
    ) {
        this.#fragmentGen = fragmentGen;
        this.#instBuilder = instructionBuilder;

        this.#addCondition(current);
    }

    build(): GroupInstruction {
        // #endif를 만날 때까지 Fragment를 처리
        while (!this.#exitSignal) {
            const { value: fragment, done } = this.#fragmentGen.next();
            if (done) {
                throw new FragmentError(
                    `missing '#endif' directive`,
                    APTLErrorType.MISSING_ENDIF,
                    fragment
                );
            }

            const inst = this.#instBuilder.build(
                fragment,
                this.#fragmentGen,
                { priorityDirectiveHandlers: this.#directiveHandler }
            );
            if (inst) {
                this.#addInstructionToCurrentCondition(inst);
            }
        }

        const jumpSectionSize = this.#conditions.length;
        const elseSectionSize = this.#elseCondition ? 2 : 1;
        const totalSize = jumpSectionSize + elseSectionSize + this.#conditions.length * 2;
        const conditionSectionPosition = jumpSectionSize + elseSectionSize;

        const group: GroupInstruction = {
            instruction_type: InstructionType.Group,
            instructions: [],
        }
        group.instructions.length = totalSize;

        // 각 조건(#if, #elseif)에 대한 점프 액션과 실행 블록 배치
        for (const index in this.#conditions) {
            const condition = this.#conditions[index];
            const jumpPosition = conditionSectionPosition + 2 * Number(index);

            const jumpAction = ActionTemplate.jumpConditional(condition.fragment, jumpPosition)

            group.instructions[index] = jumpAction;
            group.instructions[jumpPosition] = condition.instruction;
            group.instructions[jumpPosition + 1] = ActionTemplate.break();
        }

        // #else 블록 처리
        const elseSectionPosition = jumpSectionSize;
        if (this.#elseCondition) {
            group.instructions[elseSectionPosition] = this.#elseCondition.instruction;
            group.instructions[elseSectionPosition + 1] = ActionTemplate.break();

        }
        else {
            group.instructions[elseSectionPosition] = ActionTemplate.break();
        }

        return group;
    }

    #addCondition(fragment: DirectiveFragment) {
        const condition = {
            fragment: fragment,
            instruction: {
                instruction_type: InstructionType.Group,
                fragment: fragment,
                instructions: [],
            }
        };
        this.#conditions.push(condition);
    }

    #addInstructionToCurrentCondition(instruction: APTLInstruction) {
        if (this.#elseCondition) {
            this.#elseCondition.instruction.instructions.push(instruction);
        }
        else {
            const lastBlock = this.#conditions.at(-1)!
            lastBlock.instruction.instructions.push(instruction);
        }
    }

    #handleElseIf(fragment: DirectiveFragment) {
        if (this.#elseCondition) {
            throw new FragmentError(
                `Unexpected '${fragment.directive}' directive after 'else' directive`,
                APTLErrorType.INVALID_DIRECTIVE,
                fragment
            )
        }

        this.#addCondition(fragment);

        return null;
    }

    #handleElse(fragment: DirectiveFragment) {
        if (this.#elseCondition) {
            throw new FragmentError(
                'Duplicate else directive',
                APTLErrorType.DUPLICATE_ELSE_DIRECTIVE,
                fragment
            );
        }

        this.#elseCondition = {
            fragment: fragment,
            instruction: {
                instruction_type: InstructionType.Group,
                instructions: [],
            }
        };
        return null;
    }
}

export default IfSequenceBuilder;