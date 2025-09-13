import { FragmentParser } from './FragmentParser';
import WhitespaceHandler from './WhitespaceHandler';
import { Fragment } from '@/types/fragment';

class Fragmenter {
    static fragment(template: string): Fragment[] {
        const rawBlocks = FragmentParser.parse(template);
        const wsProcessed = WhitespaceHandler.process(rawBlocks);
        const emptyFiltered = WhitespaceHandler.filterNotEmptyBlocks(wsProcessed);

        return emptyFiltered;
    }
}

export default Fragmenter;