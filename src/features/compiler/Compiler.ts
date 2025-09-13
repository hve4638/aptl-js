import { APTLFail } from '@/errors';
import Fragmenter from '@/features/fragmenter';
import { ForeachSequenceBuilder, IfSequenceBuilder, InstructionBuilder } from '@/features/instruction-builder';
import { CompileResult } from '@/types/compile';

import { DirectiveKeywords, Fragment } from '@/types/fragment';
import { APTLInstruction } from '@/types/instruction';

class Compiler {
    #instructionBuilder: InstructionBuilder;

    constructor() {
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

    compile(text: string): CompileResult {
        const fragments = this.fragment(text);
        const insts = this.build(fragments);

        return insts;
    }

    fragment(text: string): Fragment[] {
        return Fragmenter.fragment(text);
    }

    build(fragments: Fragment[]): CompileResult {
        function* genFragment(frags: Fragment[]) {
            for (const frag of frags) {
                yield frag;
            }
        }
        const gen = genFragment(fragments)

        const errors: APTLFail[] = [];
        const instructions: APTLInstruction[] = [];
        while (true) {
            const { value: fragment, done } = gen.next();
            if (done) break;

            try {
                const inst = this.#instructionBuilder.build(fragment, gen, {});
                if (inst) instructions.push(inst);
            }
            catch (error) {
                if (error instanceof APTLFail) {
                    errors.push(error);
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