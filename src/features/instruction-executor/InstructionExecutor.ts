import { InstructionCmd, InstructionType } from '@/types/instruction';

import StackControl from './StackControl';
import Evaluator from '@/features/expression-evaluator';

import { ExecuteArgs } from './types';
import { TemplateOutput, CompileOutput } from '@/types';
import { ActionCmd, ActionInstructions } from '@/types/instruction/actions';
import { DirectiveKeywords } from '@/types/fragment';


type ProcessResult = {
    moveOffset: boolean;
}

class InstructionExecutor {
    #stackControl: StackControl;
    #executeArgs: ExecuteArgs;

    static execute(CompileOutput: CompileOutput, executeArgs: ExecuteArgs) {
        const executor = new InstructionExecutor(CompileOutput, executeArgs);
        return executor.execute();
    }

    private constructor({ instructions }: CompileOutput, executeArgs: ExecuteArgs) {
        this.#stackControl = new StackControl(instructions);
        this.#executeArgs = executeArgs;
    }

    #getEvaluator() {
        return new Evaluator({
            vars: this.#executeArgs.vars,
            builtInVars: this.#executeArgs.builtInVars,
            expressionEventHooks: this.#executeArgs.hook,
            scope: this.#stackControl.currentScope() ?? {},
        });
    }

    *execute(): Generator<TemplateOutput> {
        const sc = this.#stackControl;

        // offset을 이동시키며 순차적으로 처리
        // SequenceNode를 만나면 처리 스택에 추가. 새 스택에서 offset 0으로 시작
        // continue 는 offset을 증가시키지 않기 위한 용도
        // TEXT, ROLE, SPLIT 타입에 대해 yield
        while (!sc.isStackEmpty()) {
            const offset = sc.getLastOffset();
            const currentNodes = sc.getCurrentNode();

            if (offset >= currentNodes.length) {
                sc.popNodeStack();
                sc.nextOffset();
                continue;
            }

            const inst = currentNodes[offset];
            if (inst.instruction_type === InstructionType.Action) {
                const {
                    moveOffset,
                } = this.#processActionInstruction(inst);

                if (!moveOffset) continue;
            }
            else if (inst.instruction_type === InstructionType.Group) {
                sc.pushNodeStack(inst);
                continue;
            }
            else if (inst.instruction_type === InstructionType.Single) {
                if (inst.cmd === InstructionCmd.Directive) {
                    if (inst.keyword === DirectiveKeywords.Role) {
                        yield {
                            type: 'ROLE',
                            role: inst.role,
                        };
                    }
                    else if (inst.keyword === DirectiveKeywords.Split) {
                        yield {
                            type: 'SPLIT',
                        };
                    }
                    else {
                        throw new Error(`Unknown directive: ${(inst as any).keyword}`);
                    }
                }
                else if (inst.cmd === InstructionCmd.Expression) {
                    const evaluator = this.#getEvaluator();

                    const output = evaluator.evaluateOutput(inst.expression);

                    if (typeof output === 'string') {
                        yield {
                            type: 'TEXT',
                            text: output,
                        }
                    }
                    else {
                        // PromptGenerator의 경우
                        for (const result of output) {
                            yield result;
                        }
                    }
                }
                else if (inst.cmd === InstructionCmd.Text) {
                    yield {
                        type: 'TEXT',
                        text: inst.text,
                    };
                }
            }

            sc.nextOffset();
        }
    }

    #processActionInstruction(inst: ActionInstructions): ProcessResult {
        const sc = this.#stackControl;

        if (inst.cmd === ActionCmd.Jump) {
            sc.jumpOffset(inst.jump_to);
            return { moveOffset: false };
        }
        else if (inst.cmd === ActionCmd.ConditionalJump) {
            const evaluator = this.#getEvaluator();
            const result = evaluator.evaluate(inst.expression);

            if (result) {
                sc.jumpOffset(inst.jump_to);
                return { moveOffset: false };
            }
            // no continue
        }
        else if (inst.cmd === ActionCmd.Break) {
            sc.popNodeStack();
            // no continue
        }
        else if (inst.cmd === ActionCmd.EnterScope) {
            sc.pushScopeStack();
            // no continue
        }
        else if (inst.cmd === ActionCmd.ExitScope) {
            sc.popScopeStack();
            // no continue
        }
        else if (inst.cmd === ActionCmd.IterateInit) {
            const evaluator = this.#getEvaluator();
            const iter = evaluator.evaluateAndIterate(inst.expression);
            sc.initIter(inst.iterator_variable, iter);
            // no continue
        }
        else if (inst.cmd === ActionCmd.IterateNext) {
            sc.nextIter(inst.iterator_variable, inst.result_variable);
            // no continue
        }
        else if (inst.cmd === ActionCmd.JumpIfIterateDone) {
            const done = sc.isIterDone(inst.iterator_variable);

            if (done) {
                sc.jumpOffset(inst.jump_to);
                return { moveOffset: false };
            }
            // no continue
        }
        return { moveOffset: true };
    }
}

export default InstructionExecutor;