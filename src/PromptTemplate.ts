import { CBFNode, CBFResult, CBFParserExecuteArgs, Fragment } from './types';
import TemplateSplitter from './template-splitter';
import NodeBuilder from './node-builder';
import cbfExecute from './cbf-execute';
import { CBFFail } from './errors';

class PromptTemplate {
    static #templateSplitter:TemplateSplitter = new TemplateSplitter();
    static #nodeBuilder:NodeBuilder = new NodeBuilder();

    /**
     * 템플릿 텍스트를 CBFNode로 빌드
     * 
     * CBFNode는 execute() 함수를 통해 최종 결과물인 CBFResult로 변환 가능
     */
    static build(template: string):{ nodes:CBFNode[], errors:CBFFail[] } {
        const fragments:Fragment[] = this.#templateSplitter.splitTemplate(template);
        const result = this.#nodeBuilder.build(fragments);
        return result;
    }

    static execute(nodes:CBFNode[], executeArgs:CBFParserExecuteArgs):Generator<CBFResult> {
        return cbfExecute(nodes, executeArgs);
    }
}

export default PromptTemplate;