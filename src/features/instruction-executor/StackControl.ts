import { Vars } from '@/types';
import { APTLInstruction, GroupInstruction } from '@/types/instruction';

class StackControl {
    private offsetStack: number[] = [0];
    private nodeStack: APTLInstruction[][] = [];
    private scopeStack: Vars[] = [{}];
    private scopeIterStack: Vars[] = [{}];

    constructor(instructions: APTLInstruction[]) {
        this.nodeStack = [instructions];
    }

    jumpOffset(jumpTo: number) {
        this.offsetStack[this.offsetStack.length - 1] = jumpTo;
    }

    pushNodeStack(inst: GroupInstruction) {
        this.offsetStack.push(0);
        this.nodeStack.push(inst.instructions);
    }

    popNodeStack() {
        this.offsetStack.pop();
        this.nodeStack.pop();
    }

    pushScopeStack() {
        this.scopeStack.push({
            ...this.scopeStack.at(-1),
        });
        this.scopeIterStack.push({
            ...this.scopeIterStack.at(-1),
        });
    }

    popScopeStack() {
        this.scopeStack.pop();
        this.scopeIterStack.pop();
    }

    initIter(key: string, iter: Iterator<any>) {
        const iterKey = `--iter-${key}`;
        const iterKeyDone = `--iter-${key}-done`;

        this.setScopeVar(iterKey, iter);
        this.setScopeVar(iterKeyDone, false);
    }
    nextIter(key: string, element: string) {
        const iterKey = `--iter-${key}`;
        const iterKeyDone = `--iter-${key}-done`;

        const iter = this.getScopeVar(iterKey);
        const result = iter.next();

        this.setScopeVar(element, result.value);
        this.setScopeVar(iterKeyDone, result.done);
    }
    isIterDone(key: string) {
        const iterKey = `--iter-${key}`;
        const iterKeyDone = `--iter-${key}-done`;

        return this.getScopeVar(iterKeyDone);
    }
    setScopeVar(key: string, value: any) {
        this.scopeStack[this.scopeStack.length - 1][key] = value;
    }
    getScopeVar(key: string) {
        return this.scopeStack[this.scopeStack.length - 1][key];
    }

    nextOffset() {
        if (this.offsetStack.length > 0) {
            this.offsetStack[this.offsetStack.length - 1] += 1;
        }
    }

    getLastOffset() {
        return this.offsetStack[this.offsetStack.length - 1];
    }
    getCurrentNode() {
        return this.nodeStack[this.nodeStack.length - 1];
    }

    currentScope() {
        return this.scopeStack[this.scopeStack.length - 1];
    }


    isStackEmpty() {
        return this.nodeStack.length === 0;
    }
}

export default StackControl;