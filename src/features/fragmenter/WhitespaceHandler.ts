import { DirectiveFragment, DirectiveKeywords, Fragment, TextContentFragment, WhitespaceFragment } from '@/types/fragment';
import { StringUtils } from '@/utils';

const WS_OPEN = [
    DirectiveKeywords.If,
    DirectiveKeywords.Foreach,
    DirectiveKeywords.IfInline,
    DirectiveKeywords.ForeachInline,
] as string[];
const WS_CLOSE = [
    DirectiveKeywords.EndIf,
    DirectiveKeywords.EndForeach,
] as string[];
const WS_NOTRIM_OPEN = [
    DirectiveKeywords.IfInline,
    DirectiveKeywords.ForeachInline,
] as string[];

class WhitespaceHandler {
    static process(blocks: Fragment[]): Fragment[] {
        const result = blocks.map(b => ({ ...b }));
        let prevBlock: Fragment | null = null;
        let isPrevText = false;
        let isPrevDirective = false;

        const directiveStack: DirectiveFragment[] = [];
        for (const block of result) {
            const isText = (block.type === 'text-content');
            const isDirective = (
                block.type === 'directive-element'
                && this.#isDirective(block, directiveStack)
            );

            if (isText && isPrevDirective) {
                this.#moveLeftWS(block, prevBlock as DirectiveFragment);
            }
            else if (isDirective && isPrevText) {
                this.#moveRightWS(prevBlock as TextContentFragment, block);
            }

            prevBlock = block;
            isPrevText = isText;
            isPrevDirective = isDirective;
        }

        if (result.length > 0) {
            const startBlock = result.at(0);
            if (startBlock?.type === 'text-content') {
                const extracted = this.#extractLeftWS(startBlock);
                if (extracted) {
                    const [ws, text] = extracted;
                    result[0] = text;
                    result.unshift(ws);
                }
            }

            const endBlock = result.at(-1);
            if (endBlock?.type === 'text-content') {
                const extracted = this.#extractRightWS(endBlock);
                if (extracted) {
                    const [text, ws] = extracted;
                    result.pop();
                    result.push(text);
                    result.push(ws);
                }
            }
        }

        return result;
    }

    static #isDirective(block: DirectiveFragment, stack: DirectiveFragment[]): boolean {
        if (WS_OPEN.includes(block.directive.value)) {
            stack.push(block);
            
            return !WS_NOTRIM_OPEN.includes(block.directive.value);
        }
        else if (WS_CLOSE.includes(block.directive.value)) {
            const poped = stack.pop();

            return !WS_NOTRIM_OPEN.includes(poped?.directive.value as any);
        }
        else {
            return true;
        }
    }

    static #extractLeftWS(block: TextContentFragment): [WhitespaceFragment, TextContentFragment] | null {
        const extracted = StringUtils.trimLeft({ value: block.value, left: '', right: '', position: block.position });

        if (extracted.left.length === 0) return null;

        const ws: WhitespaceFragment = {
            type: 'whitespace',
            value: extracted.left,
            position: block.position,
        }
        const text: TextContentFragment = {
            type: 'text-content',
            value: extracted.value,
            position: block.position + extracted.left.length,
        }
        return [ws, text];
    }

    static #extractRightWS(block: TextContentFragment): [TextContentFragment, WhitespaceFragment] | null {
        const extracted = StringUtils.trimRight({ value: block.value, left: '', right: '', position: block.position });

        if (extracted.right.length === 0) return null;

        const text: TextContentFragment = {
            type: 'text-content',
            value: extracted.value,
            position: block.position,
        }
        const ws: WhitespaceFragment = {
            type: 'whitespace',
            value: extracted.right,
            position: block.position + extracted.value.length,
        }
        return [text, ws];
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