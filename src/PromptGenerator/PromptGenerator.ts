import { TemplateResult } from './types';

class PromptGenerator {
    constructor(private generator:()=>Generator<TemplateResult>) {

    }

    [Symbol.iterator]() {
        return this.generator();
    }
}

export default PromptGenerator;