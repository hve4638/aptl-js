export type TemplateOutput = {
    type: 'TEXT';
    text: string;
} | {
    type: 'ROLE';
    role: string;
} | {
    type: 'IMAGE';
    filename: string;
    data: string;
    dataType: 'image/png' | 'image/jpeg' | 'image/webp';
} | {
    type: 'FILE';
    filename: string;
    data: string;
    dataType: 'application/pdf' | 'text/plain';
} | {
    type: 'SPLIT';
}