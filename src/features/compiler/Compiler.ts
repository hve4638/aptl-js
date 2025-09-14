import { BuildError } from '@/errors';
import Fragmenter from '@/features/fragmenter';
import { ForeachSequenceBuilder, IfSequenceBuilder, InstructionBuilder } from '@/features/instruction-builder';
import { CompileOutput } from '@/types/compile';
import { CompileFailReason } from '@/types/fail';

import { DirectiveKeywords, Fragment } from '@/types/fragment';
import { APTLInstruction } from '@/types/instruction';

class Compiler {
    static #initialized = false;
    static #instructionBuilder: InstructionBuilder;

    static #init() {
        if (this.#initialized) return;
        this.#initialized = true;

        this.#instructionBuilder = new InstructionBuilder();
        this.#instructionBuilder.updateDirectiveHandlers({
            [DirectiveKeywords.If]: (c, gen) => {
                const ifSeqBuilder = new IfSequenceBuilder(c, gen, this.#instructionBuilder);
                return ifSeqBuilder.build();
            },
            [DirectiveKeywords.Foreach]: (c, gen) => {
                const foreachSeqBuilder = new ForeachSequenceBuilder(c, gen, this.#instructionBuilder);
                return foreachSeqBuilder.build();
            },
        });
    }

    static compile(text: string): CompileOutput {
        this.#init();
        const fragments = this.fragment(text);
        const insts = this.build(fragments);

        return insts;
    }

    static fragment(text: string): Fragment[] {
        return Fragmenter.fragment(text);
    }

    static build(fragments: Fragment[]): CompileOutput {
        Compiler.#init();

        function* genFragment(frags: Fragment[]) {
            for (const frag of frags) {
                yield frag;
            }
        }
        const gen = genFragment(fragments)

        const errors: CompileFailReason[] = [];
        const instructions: APTLInstruction[] = [];
        while (true) {
            const { value: fragment, done } = gen.next();
            if (done) break;

            try {
                const inst = Compiler.#instructionBuilder.build(fragment, gen, {});
                if (inst) instructions.push(inst);
            }
            catch (error) {
                if (error instanceof BuildError) {
                    errors.push(error.reason);
                }
                else {
                    throw error;
                }
            }
        }

        if (errors.length > 0) {
            return {
                ok: false,
                instructions,
                errors,
            }
        }
        else {
            return {
                ok: true,
                instructions,
                errors: [],
            }
        }
    }
}

export default Compiler;