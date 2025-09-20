
export namespace TemplateOutput {
    export interface Text {
        type: 'TEXT';
        text: string;
    }
    export interface Role {
        type: 'ROLE';
        role: string;
    }
    export interface Image {
        type: 'IMAGE';
        filename: string;
        data: string;
        dataType: 'image/png' | 'image/jpeg' | 'image/webp';
    }
    export interface File {
        type: 'FILE';
        filename: string;
        data: string;
        dataType: 'application/pdf' | 'text/plain';
    }
    export interface Split {
        type: 'SPLIT';
    }
}
export type TemplateOutput = (
    TemplateOutput.Text |
    TemplateOutput.Role |
    TemplateOutput.Image |
    TemplateOutput.File |
    TemplateOutput.Split
);