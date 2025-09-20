import { Fragment } from '@/types/fragment';
import { APTLInstruction } from '@/types/instruction';

import { BuildOption } from './types';

export interface IInstructionBuilder {
    build(
        current: Fragment,
        fragmentGen: Generator<Fragment>,
        { priorityDirectiveHandlers }: BuildOption
    ): APTLInstruction | null;
}