import { DirectiveFragment, Fragment } from '@/types/fragment';
import { APTLInstruction } from '@/types/instruction';

export type BuildOption = {
    priorityDirectiveHandlers?: DirectiveHandlers;
}

export type DirectiveHandlers = Record<
    string,
    (fragment: DirectiveFragment, gen: Generator<Fragment>) => APTLInstruction | null
>;

