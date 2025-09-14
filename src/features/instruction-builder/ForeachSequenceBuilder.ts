import { DirectiveFragment, DirectiveKeywords, Fragment } from '@/types/fragment';
import { APTLInstruction, GroupInstruction, InstructionType } from '@/types/instruction';
import { IInstructionBuilder } from './interfaces';
import { FragmentError } from '@/errors';
import { APTLErrorType } from '@/errors';
import ActionTemplate from './ActionTemplate';
import ExpressionBuilder from './ExpressionBuilder';
import { StringUtils } from '@/utils';

class ForeachSequenceBuilder {
    #directiveHandler: Record<
        string,
        (fragment: DirectiveFragment) => APTLInstruction | null
    > = {
            [DirectiveKeywords.EndForeach]: (fragment) => {
                this.#exitSignal = true;
                return null;
            },
        }

    /** #endif 만날시 true 지정 */
    #exitSignal = false;

    #current: DirectiveFragment;
    #fragmentGen: Generator<Fragment>;
    #instBuilder: IInstructionBuilder;

    constructor(
        current: DirectiveFragment,
        fragmentGen: Generator<Fragment>,
        instructionBuilder: IInstructionBuilder,
    ) {
        this.#current = current;
        this.#fragmentGen = fragmentGen;
        this.#instBuilder = instructionBuilder;
    }

    build(): GroupInstruction {
        const {
            iterator,
            element,
        } = this.#parseForeachField();

        const instruction: GroupInstruction = {
            instruction_type: InstructionType.Group,
            instructions: [],
        }

        while (!this.#exitSignal) {
            const { value: fragment, done } = this.#fragmentGen.next();
            if (done) {
                throw new FragmentError(
                    `missing #endforeach`,
                    APTLErrorType.MISSING_ENDFOREACH,
                    fragment
                );
            }

            const inst = this.#instBuilder.build(
                fragment,
                this.#fragmentGen,
                {
                    priorityDirectiveHandlers: this.#directiveHandler
                }
            );
            if (inst) {
                instruction.instructions.push(inst);
            }
        }

        return {
            instruction_type: InstructionType.Group,
            instructions: [
                ActionTemplate.enterScope(),
                ActionTemplate.iterateInit(iterator.expression, iterator.text),
                ActionTemplate.iterateNext(iterator.text, element.text),
                ActionTemplate.jumpIfIterateDone(iterator.text, 6),
                instruction,
                ActionTemplate.jump(2),
                ActionTemplate.exitScope(),
            ],
        } satisfies GroupInstruction;
    }

    #parseForeachField() {
        const {
            iterator,
            element,
        } = this.#extractForeachField('in');

        const iteratorExpr = ExpressionBuilder.build(iterator.text, { position: iterator.position });
        const elementExpr = ExpressionBuilder.build(element.text, { position: element.position });

        if (elementExpr.type !== 'identifier') {
            throw new FragmentError(
                `'${element.text}' is not a valid identifier`,
                APTLErrorType.INVALID_DIRECTIVE,
                this.#current
            )
        }

        return {
            iterator: {
                text: iterator.text,
                expression: iteratorExpr
            },
            element: {
                text: element.text,
                expression: elementExpr
            },
        }
    }

    /** foreach directive 필드에서 iterator 식별자 및 variable 식별자 추출 */
    #extractForeachField(delimiter: string = 'in'): { iterator: { text: string, position: number }, element: { text: string, position: number } } {
        const field = this.#current.field;

        const splitted = StringUtils.split({
            value: field.text,
            left: field.prefix,
            right: field.suffix,
            position: field.position,
        }, delimiter);
        if (splitted.length !== 2) {
            throw new FragmentError(
                `Invalid foreach directive field. Expected '<element> ${delimiter} <iterator>'`,
                APTLErrorType.INVALID_DIRECTIVE,
                this.#current
            );
        }

        const [elementRaw, iteratorRaw] = splitted;
        const element = StringUtils.trim(elementRaw);
        const iterator = StringUtils.trim(iteratorRaw);

        return {
            iterator: {
                text: iterator.value,
                position: this.#current.field.position + iterator.position,
            },
            element: {
                text: element.value,
                position: this.#current.field.position + element.position,
            },
        };
    }
}

export default ForeachSequenceBuilder;