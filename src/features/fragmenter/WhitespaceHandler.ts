import { DirectiveFragment, Fragment, TextContentFragment } from '@/types/fragment';

class WhitespaceHandler {
    static process(blocks: Fragment[]): Fragment[] {
        const result = blocks.map(b => ({ ...b }));
        let prevBlock: Fragment | null = null;

        for (const block of result) {
            if (block.type === 'text-content') {
                if (prevBlock && prevBlock.type === 'directive-element') {
                    this.#moveLeftWS(block, prevBlock);
                }
            }
            else if (block.type === 'directive-element') {
                if (prevBlock && prevBlock.type === 'text-content') {
                    this.#moveRightWS(prevBlock, block);
                }
            }
            
            prevBlock = block;
        }

        return result;
    }

    static #moveLeftWS(from: TextContentFragment, to: DirectiveFragment) {
        const trimmed = from.value.trimStart();
        const leftWS = from.value.slice(0, from.value.length - trimmed.length);
        
        if (leftWS.length > 0) {
            from.value = trimmed;
            from.position += leftWS.length;

            to.value = to.value + leftWS;
        }
    }

    static #moveRightWS(from: TextContentFragment, to: DirectiveFragment) {
        const trimmed = from.value.trimEnd();
        const rightWS = from.value.slice(trimmed.length);
        
        if (rightWS.length > 0) {
            from.value = trimmed;
            to.value = rightWS + to.value;
            to.position -= rightWS.length;
        }
    }

    static filterNotEmptyBlocks(blocks: Fragment[]): Fragment[] {
        return blocks.filter(block => (
            !(block.type === 'text-content' && block.value.length === 0)
        ));
    }
}

export default WhitespaceHandler;