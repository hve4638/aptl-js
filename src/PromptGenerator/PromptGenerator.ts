import type{ TemplateOutput } from '@/types';

class PromptGenerator {
    constructor(private generator:()=>Generator<TemplateOutput>) {

    }

    [Symbol.iterator]() {
        return this.generator();
    }
}

export default PromptGenerator;