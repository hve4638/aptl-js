import { DirectiveFragment, DirectiveKeywords, ExpressionFragment, Fragment, TextContentFragment } from '@/types/fragment';
import { APTLInstruction, DirectiveInstructions } from '@/types/instruction';
import { InstructionCmd, InstructionType } from '@/types/instruction/base';
import type { BuildOption, DirectiveHandlers } from './types';
import type { IInstructionBuilder } from './interfaces';
import { APTLErrorType, FragmentError } from '@/errors';
import ExpressionBuilder from './ExpressionBuilder';

class InstructionBuilder implements IInstructionBuilder {
    #directiveHandler: DirectiveHandlers = {
        [DirectiveKeywords.Split]: InstructionBuilder.#makeSimpleDirectiveInstruction,
        [DirectiveKeywords.Role]: InstructionBuilder.#makeSimpleDirectiveInstruction,
    };

    constructor() {

    }

    updateDirectiveHandlers(handlers: DirectiveHandlers) {
        this.#directiveHandler = { ...this.#directiveHandler, ...handlers };
    }

    build(
        current: Fragment,
        fragmentGen: Generator<Fragment>,
        { priorityDirectiveHandlers }: BuildOption
    ): APTLInstruction | null {
        switch (current.type) {
            case 'text-content':
                return this.#makeTextInstruction(current);
            case 'expression-element':
                return this.#makeExpressionInstruction(current);
            case 'directive-element':
                return this.#parseDirective(current, fragmentGen, priorityDirectiveHandlers);
            case 'whitespace':
                return null;
            default:
                throw new Error(`Unsupported fragment type: ${(current as any).type}`);
        }
    }

    #makeTextInstruction(fragment: TextContentFragment): APTLInstruction {
        return {
            instruction_type: InstructionType.Single,
            fragment: fragment,

            cmd: InstructionCmd.Text,
            text: fragment.value,
        };
    }

    #makeExpressionInstruction(fragment: ExpressionFragment): APTLInstruction {
        const expression = ExpressionBuilder.build(
            fragment.expression.text,
            { position: fragment.expression.position }
        );

        return {
            instruction_type: InstructionType.Single,
            cmd: InstructionCmd.Expression,
            fragment,

            expression,
        };
    }

    #parseDirective(
        current: DirectiveFragment,
        gen: Generator<Fragment>,
        priorityHandlers?: DirectiveHandlers,
    ): APTLInstruction | null {
        const keyword = current.directive.value;
        
        if (priorityHandlers && keyword in priorityHandlers) {
            const parser = priorityHandlers[keyword];
            return parser(current, gen);
        }
        else if (keyword in this.#directiveHandler) {
            const parser = this.#directiveHandler[keyword];
            return parser(current, gen);
        }
        else {
            throw new FragmentError(
                `Unexpected directive '${keyword}'`,
                APTLErrorType.INVALID_DIRECTIVE,
                current
            );
        }
    }

    static #makeSimpleDirectiveInstruction(fragment: DirectiveFragment, gen: Generator<Fragment>): DirectiveInstructions {
        const directive = fragment.directive.text.toLowerCase();
        switch (directive) {
            case DirectiveKeywords.Split:
                return {
                    instruction_type: InstructionType.Single,
                    cmd: InstructionCmd.Directive,
                    keyword: DirectiveKeywords.Split,
                    fragment: fragment,
                };
                break;
            case DirectiveKeywords.Role:
                return {
                    instruction_type: InstructionType.Single,
                    cmd: InstructionCmd.Directive,
                    keyword: DirectiveKeywords.Role,
                    fragment: fragment,

                    role: fragment.field.text,
                };
                break;
            default:
                throw new FragmentError(
                    `Unsupported directive: ${directive}`,
                    APTLErrorType.INVALID_DIRECTIVE,
                    fragment
                );
        }
    }
}

export default InstructionBuilder;