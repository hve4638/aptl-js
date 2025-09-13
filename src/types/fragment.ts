interface BaseFragment {
    type: 'text-content' | 'expression-element' | 'directive-element';
    value: string;
    position: number;
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

export type Fragment = TextContentFragment | ExpressionFragment | DirectiveFragment;

export const DirectiveKeywords = {
    Role: 'role',
    If: 'if',
    ElseIf: 'elseif',
    Elif: 'elif',
    Else: 'else',
    EndIf: 'endif',
    Foreach: 'foreach',
    EndForeach: 'endforeach',
    Split: 'split',
} as const;
export type DirectiveKeywords = typeof DirectiveKeywords[keyof typeof DirectiveKeywords];