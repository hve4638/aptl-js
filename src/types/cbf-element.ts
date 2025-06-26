import { ExpressionEventHooks } from '../expr-eval/types/expr-hooks';

export type CBFResult = {
    type : 'TEXT';
    text : string;
} | {
    type : 'ROLE';
    role : string;
} | {
    type : 'IMAGE';
    filename: string;
    data : string;
    dataType: 'image/png' | 'image/jpeg' | 'image/webp';
} | {
    type : 'FILE';
    filename: string;
    data : string;
    dataType: 'application/pdf' | 'text/plain';
} | {
    type : 'SPLIT';
}

export type CBFParserExecuteArgs = {
    vars:{[key:string]:any};
    builtInVars:{[key:string]:any};
    hook:Partial<ExpressionEventHooks>;
}