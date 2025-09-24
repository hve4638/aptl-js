# Advanced Prompt Template Language (APTL)

A powerful TypeScript template engine designed for AI prompt generation with expression evaluation, conditional logic, and control flow directives.

## Installation

```bash
npm install advanced-prompt-template-lang
```

## Quick Start

```typescript
import APTL from 'advanced-prompt-template-lang';

const template = `
{{#role system}}
You are a helpful AI assistant.

{{#role user}}
{{:input}}
`;

// Generate and format the output
const output = APTL.run(template, {
    vars: {},
    builtInVars: { input: 'What is 1 + 1?' },
    hook: {}
});

// Format as structured messages
const messages = [];
APTL.format(output, {
    role: ({ role }) => {
        messages.push({ role, content: [] });
    },
    text: ({ text }) => {
        const last = messages.at(-1);
        last?.content.push(text);
    }
});

console.log(messages);
// [
//   { role: 'system', content: ['You are a helpful AI assistant.'] },
//   { role: 'user', content: ['What is 1 + 1?'] }
// ]
```

## API Reference

### `APTL.run(templateText, executeArgs)`

The primary method that compiles and executes a template in one step. Internally uses `APTL.compile()` and `APTL.execute()` to process templates.

**Parameters:**
- `templateText` (string): The template string to process
- `executeArgs` (ExecuteArgs): Execution context containing variables and hooks

**Returns:** `Generator<TemplateOutput>` - Stream of template outputs

**Throws:** `APTLCompileFailed` if compilation fails

### `APTL.format(output, handler)`

Formats the raw template output into structured data using custom handlers.

**Parameters:**
- `output` (Generator<TemplateOutput> | TemplateOutput[]): Output from `APTL.run()`
- `handler` (BuildHandler): Object with callbacks for different output types

For more complex scenarios, you can use the lower-level methods:
- `APTL.compile(templateText)` - Compile template to instructions
- `APTL.execute(compileOutput, executeArgs)` - Execute compiled instructions

### Types

#### `ExecuteArgs`

```typescript
interface ExecuteArgs {
    vars: Record<string, any>;        // User-defined variables
    builtInVars: Record<string, any>; // Built-in variables (input, nl, etc.)
    hook: Record<string, Function>;   // External functions
}
```

#### `BuildHandler`

```typescript
interface BuildHandler {
    role: (output: { role: string }) => void;      // Handle role changes
    text: (output: { text: string }) => void;      // Handle text content
    image?: (output: { filename: string, data: any, dataType: string }) => void;
    file?: (output: { filename: string, data: any, dataType: string }) => void;
}
```

## Template Syntax

### Variables

Use `{{variableName}}` for variable substitution and `{{:builtInVar}}` for built-in variables:

```typescript
const template = `Hello {{name}}, your input is: {{:input}}`;

const output = APTL.run(template, {
    vars: { name: 'Alice' },
    builtInVars: { input: 'Hello world' },
    hook: {}
});

// Format as simple string
let result = '';
APTL.format(output, {
    role: ({ role }) => { /* handle roles if needed */ },
    text: ({ text }) => { result += text; }
});

console.log(result);
// "Hello Alice, your input is: Hello world"
```

### Roles

Define conversation roles using `{{#role roleName}}`:

```typescript
const template = `
{{#role system}}
You are a helpful assistant.

{{#role user}}
{{:input}}

{{#role assistant}}
Output:
`;

const output = APTL.run(template, {
    vars: {},
    builtInVars: { input: 'How do I learn TypeScript?' },
    hook: {}
});

// Format as chat messages
const messages = [];
APTL.format(output, {
    role: ({ role }) => {
        messages.push({ role, content: '' });
    },
    text: ({ text }) => {
        const last = messages.at(-1);
        if (last) last.content += text;
    }
});

console.log(messages);
// [
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'user', content: 'How do I learn TypeScript?' },
//   { role: 'assistant', content: "Output:" }
// ]
```

### Conditional Logic

Use `IF/ELSE/ENDIF` for conditional content:

```typescript
const template = `
Translate from {{sourceLanguage}} to {{targetLanguage}}.

{{#if context}}
Context: {{context}}
{{#endif}}

{{#if tone}}
Desired tone: {{tone}}
{{#endif}}

Text: {{:input}}
`;

const output = APTL.run(template, {
    vars: {
        sourceLanguage: 'English',
        targetLanguage: 'Korean',
        context: 'Technical documentation',
        tone: 'formal'
    },
    builtInVars: { input: 'The API endpoint accepts JSON payloads.' },
    hook: {}
});

// Format as plain text
let prompt = '';
APTL.format(output, {
    role: ({ role }) => { /* default to user role */ },
    text: ({ text }) => { prompt += text; }
});

console.log(prompt);
// "Translate from English to Korean.
// Context: Technical documentation
// Desired tone: formal
// Text: The API endpoint accepts JSON payloads."
```

#### Inline Conditionals

For single-line conditional content:

```typescript
const template = `
Translate the text. {{#if_inline detail}}Include original and translation.{{#endif}}

Text: {{:input}}
`;

const output = APTL.run(template, {
    vars: { detail: true },
    builtInVars: { input: 'Hello world' },
    hook: {}
});

let result = '';
APTL.format(output, {
    role: ({ role }) => { /* handle roles */ },
    text: ({ text }) => { result += text; }
});

console.log(result);
// "Translate the text. Include original and translation.\n\nText: Hello world"
```

### Loops

Iterate over arrays using `FOREACH/ENDFOREACH`:

```typescript
const template = `
Dictionary:
{{#foreach item in dict}}
- {{item.key}}: {{item.value}}
{{#endforeach}}

Text: {{:input}}
`;

const output = APTL.run(template, {
    vars: {
        dict: [
            { key: 'apple', value: '애플' },
            { key: 'samsung', value: '삼성' }
        ]
    },
    builtInVars: { input: 'Apple and Samsung are tech companies.' },
    hook: {
        iterate: (array) => array.values(),
        access: (obj, key) => obj[key]
    }
});

let content = '';
APTL.format(output, {
    role: ({ role }) => { /* handle roles */ },
    text: ({ text }) => { content += text; }
});

console.log(content);
// "Dictionary:\n- apple: 애플\n- samsung: 삼성\n\nText: Apple and Samsung are tech companies."
```

#### Inline Loops

For single-line iterations:

```typescript
const template = `
Dictionary:{{#foreach_inline d in dict}} {{d.key}}({{d.value}});{{#endforeach}}
`;

const output = APTL.run(template, {
    vars: {
        dict: [
            { key: 'apple', value: '애플' },
            { key: 'samsung', value: '삼성' }
        ]
    },
    builtInVars: {},
    hook: {
        iterate: (array) => array.values(),
        access: (obj, key) => obj[key]
    }
});

let result = '';
APTL.format(output, {
    role: ({ role }) => { /* handle roles */ },
    text: ({ text }) => { result += text; }
});

console.log(result);
// "Dictionary: apple(애플); samsung(삼성);"
```