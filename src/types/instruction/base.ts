export const InstructionType = {
    Single: 'single',
    Group: 'group',
    Action: 'action',
    Noop: 'noop',
} as const;
export type InstructionType = typeof InstructionType[keyof typeof InstructionType];

export const InstructionCmd = {
    Directive: 'directive',
    Expression: 'expression',
    Text: 'text',
} as const;
export type InstructionCmd = typeof InstructionType[keyof typeof InstructionType];

export type BaseInstruction = {
    instruction_type: InstructionType;
}
