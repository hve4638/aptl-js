import { CBFResult } from '@/types';

class PromptGenerator {
    constructor(private generator:()=>Generator<CBFResult>) {

    }

    [Symbol.iterator]() {
        return this.generator();
    }
}

export default PromptGenerator;