interface BaseFragment {
    type: 'whitespace' | 'text-content' | 'expression-element' | 'directive-element';
    value: string;
    position: number;
}

export interface WhitespaceFragment extends BaseFragment {
    type: 'whitespace';
}

export interface TextContentFragment extends BaseFragment {
    type: 'text-content';
}

export interface ExpressionFragment extends BaseFragment {
    type: 'expression-element';

    expression: {
        text: string;
        prefix: string;
        suffix: string;

        position: number;
    };
}

export interface DirectiveFragment extends BaseFragment {
    type: 'directive-element';

    directive: {
        value: string;
        
        text: string;
        prefix: string;
        suffix: string;

        position: number;
    };
    field: {
        text: string;
        prefix: string;
        suffix: string;

        position: number;
    };
}

export type Fragment = WhitespaceFragment | TextContentFragment | ExpressionFragment | DirectiveFragment;


// 반드시 소문자로 표기
export const DirectiveKeywords = {
    Role: 'role',
    If: 'if',
    ElseIf: 'elseif',
    Elif: 'elif',
    Else: 'else',
    EndIf: 'endif',

    Foreach: 'foreach',
    EndForeach: 'endforeach',

    IfInline: 'if_inline',
    ForeachInline: 'foreach_inline',
    Split: 'split',
} as const;
export type DirectiveKeywords = typeof DirectiveKeywords[keyof typeof DirectiveKeywords];