export interface BuiltinParam {
    name: string;
    type: string;
    description: string;
}

export interface BuiltinFunction {
    name: string;
    category: 'io' | 'array' | 'string' | 'conversion' | 'math' | 'result' | 'utility';
    returnType: string;
    params: BuiltinParam[];
    description: string;
    example: string;
    signature: string;
}

export interface KeywordInfo {
    name: string;
    kind: 'declaration' | 'control' | 'modifier' | 'literal' | 'type' | 'result';
    description: string;
    example: string;
}

export interface TypeInfo {
    name: string;
    cEquivalent: string;
    description: string;
}

function sig(name: string, params: BuiltinParam[], ret: string): string {
    const p = params.map(pp => `${pp.name}: ${pp.type}`).join(', ');
    return `fn ${name}(${p}): ${ret}`;
}

// ─── 34 Built-in Functions ─────────────────────────────────────

export const BUILTIN_FUNCTIONS: BuiltinFunction[] = [
    // I/O (5)
    {
        name: 'print', category: 'io', returnType: 'void',
        params: [{ name: 'value', type: 'any', description: 'Value to print' }],
        description: 'Print value to stdout with newline.',
        example: 'print(f"Hello {name}");',
        signature: '',
    },
    {
        name: 'input', category: 'io', returnType: 'str',
        params: [],
        description: 'Read one line from stdin. Returns the input as a string.',
        example: 'let name: str = input();',
        signature: '',
    },
    {
        name: 'read_file', category: 'io', returnType: 'str',
        params: [{ name: 'path', type: 'str', description: 'File path to read' }],
        description: 'Read entire file contents as a string.',
        example: 'let data: str = read_file("config.txt");',
        signature: '',
    },
    {
        name: 'write_file', category: 'io', returnType: 'void',
        params: [
            { name: 'path', type: 'str', description: 'File path to write' },
            { name: 'content', type: 'str', description: 'String content to write' },
        ],
        description: 'Write string to file (overwrites existing content).',
        example: 'write_file("output.txt", "hello");',
        signature: '',
    },
    {
        name: 'append_file', category: 'io', returnType: 'void',
        params: [
            { name: 'path', type: 'str', description: 'File path to append to' },
            { name: 'content', type: 'str', description: 'String content to append' },
        ],
        description: 'Append string to end of file.',
        example: 'append_file("log.txt", "new entry\\n");',
        signature: '',
    },

    // Array (3)
    {
        name: 'len', category: 'array', returnType: 'int',
        params: [{ name: 'arr', type: '[T]', description: 'Array to measure' }],
        description: 'Get the number of elements in an array.',
        example: 'let n: int = len(items);',
        signature: '',
    },
    {
        name: 'push', category: 'array', returnType: 'void',
        params: [
            { name: 'arr', type: '[T]', description: 'Target array (must be mutable)' },
            { name: 'value', type: 'T', description: 'Element to append' },
        ],
        description: 'Append an element to the end of an array.',
        example: 'push(numbers, 42);',
        signature: '',
    },
    {
        name: 'pop', category: 'array', returnType: 'void',
        params: [{ name: 'arr', type: '[T]', description: 'Target array (must be mutable)' }],
        description: 'Remove the last element from an array.',
        example: 'pop(numbers);',
        signature: '',
    },

    // String (12)
    {
        name: 'str_len', category: 'string', returnType: 'int',
        params: [{ name: 's', type: 'str', description: 'Input string' }],
        description: 'Get the length of a string in bytes.',
        example: 'let n: int = str_len("hello"); // 5',
        signature: '',
    },
    {
        name: 'str_upper', category: 'string', returnType: 'str',
        params: [{ name: 's', type: 'str', description: 'Input string' }],
        description: 'Convert string to uppercase.',
        example: 'let u: str = str_upper("hello"); // "HELLO"',
        signature: '',
    },
    {
        name: 'str_lower', category: 'string', returnType: 'str',
        params: [{ name: 's', type: 'str', description: 'Input string' }],
        description: 'Convert string to lowercase.',
        example: 'let l: str = str_lower("HELLO"); // "hello"',
        signature: '',
    },
    {
        name: 'str_trim', category: 'string', returnType: 'str',
        params: [{ name: 's', type: 'str', description: 'Input string' }],
        description: 'Trim leading and trailing whitespace.',
        example: 'let t: str = str_trim("  hi  "); // "hi"',
        signature: '',
    },
    {
        name: 'str_contains', category: 'string', returnType: 'bool',
        params: [
            { name: 's', type: 'str', description: 'String to search in' },
            { name: 'sub', type: 'str', description: 'Substring to find' },
        ],
        description: 'Check if string contains a substring.',
        example: 'if str_contains(text, "error") { ... }',
        signature: '',
    },
    {
        name: 'str_find', category: 'string', returnType: 'int',
        params: [
            { name: 's', type: 'str', description: 'String to search in' },
            { name: 'sub', type: 'str', description: 'Substring to find' },
        ],
        description: 'Find the index of a substring. Returns -1 if not found.',
        example: 'let idx: int = str_find("hello", "ll"); // 2',
        signature: '',
    },
    {
        name: 'str_slice', category: 'string', returnType: 'str',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'start', type: 'int', description: 'Start index (inclusive)' },
            { name: 'end', type: 'int', description: 'End index (exclusive)' },
        ],
        description: 'Get a substring from start index to end index.',
        example: 'let sub: str = str_slice("hello", 1, 4); // "ell"',
        signature: '',
    },
    {
        name: 'str_replace', category: 'string', returnType: 'str',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'old', type: 'str', description: 'Substring to replace' },
            { name: 'new_str', type: 'str', description: 'Replacement string' },
        ],
        description: 'Replace all occurrences of a substring.',
        example: 'let r: str = str_replace("foo bar foo", "foo", "baz");',
        signature: '',
    },
    {
        name: 'str_starts_with', category: 'string', returnType: 'bool',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'prefix', type: 'str', description: 'Prefix to check' },
        ],
        description: 'Check if string starts with a given prefix.',
        example: 'if str_starts_with(path, "/home") { ... }',
        signature: '',
    },
    {
        name: 'str_ends_with', category: 'string', returnType: 'bool',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'suffix', type: 'str', description: 'Suffix to check' },
        ],
        description: 'Check if string ends with a given suffix.',
        example: 'if str_ends_with(file, ".urus") { ... }',
        signature: '',
    },
    {
        name: 'str_split', category: 'string', returnType: '[str]',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'delim', type: 'str', description: 'Delimiter to split on' },
        ],
        description: 'Split a string into an array of substrings by delimiter.',
        example: 'let parts: [str] = str_split("a,b,c", ",");',
        signature: '',
    },
    {
        name: 'char_at', category: 'string', returnType: 'str',
        params: [
            { name: 's', type: 'str', description: 'Input string' },
            { name: 'i', type: 'int', description: 'Index of character' },
        ],
        description: 'Get the character at a given index as a single-character string.',
        example: 'let c: str = char_at("hello", 0); // "h"',
        signature: '',
    },

    // Conversion (3)
    {
        name: 'to_str', category: 'conversion', returnType: 'str',
        params: [{ name: 'value', type: 'any', description: 'Value to convert' }],
        description: 'Convert any value to its string representation.',
        example: 'let s: str = to_str(42); // "42"',
        signature: '',
    },
    {
        name: 'to_int', category: 'conversion', returnType: 'int',
        params: [{ name: 'value', type: 'any', description: 'Value to convert (str or float)' }],
        description: 'Convert a string or float to an integer.',
        example: 'let n: int = to_int("42"); // 42',
        signature: '',
    },
    {
        name: 'to_float', category: 'conversion', returnType: 'float',
        params: [{ name: 'value', type: 'any', description: 'Value to convert (str or int)' }],
        description: 'Convert a string or integer to a float.',
        example: 'let f: float = to_float("3.14"); // 3.14',
        signature: '',
    },

    // Math (8)
    {
        name: 'abs', category: 'math', returnType: 'int',
        params: [{ name: 'x', type: 'int', description: 'Integer value' }],
        description: 'Absolute value of an integer.',
        example: 'let a: int = abs(-5); // 5',
        signature: '',
    },
    {
        name: 'fabs', category: 'math', returnType: 'float',
        params: [{ name: 'x', type: 'float', description: 'Float value' }],
        description: 'Absolute value of a float.',
        example: 'let a: float = fabs(-3.14); // 3.14',
        signature: '',
    },
    {
        name: 'sqrt', category: 'math', returnType: 'float',
        params: [{ name: 'x', type: 'float', description: 'Non-negative float' }],
        description: 'Square root of a float.',
        example: 'let r: float = sqrt(16.0); // 4.0',
        signature: '',
    },
    {
        name: 'pow', category: 'math', returnType: 'float',
        params: [
            { name: 'x', type: 'float', description: 'Base' },
            { name: 'y', type: 'float', description: 'Exponent' },
        ],
        description: 'Raise x to the power of y.',
        example: 'let p: float = pow(2.0, 10.0); // 1024.0',
        signature: '',
    },
    {
        name: 'min', category: 'math', returnType: 'int',
        params: [
            { name: 'a', type: 'int', description: 'First integer' },
            { name: 'b', type: 'int', description: 'Second integer' },
        ],
        description: 'Return the smaller of two integers.',
        example: 'let m: int = min(3, 7); // 3',
        signature: '',
    },
    {
        name: 'max', category: 'math', returnType: 'int',
        params: [
            { name: 'a', type: 'int', description: 'First integer' },
            { name: 'b', type: 'int', description: 'Second integer' },
        ],
        description: 'Return the larger of two integers.',
        example: 'let m: int = max(3, 7); // 7',
        signature: '',
    },
    {
        name: 'fmin', category: 'math', returnType: 'float',
        params: [
            { name: 'a', type: 'float', description: 'First float' },
            { name: 'b', type: 'float', description: 'Second float' },
        ],
        description: 'Return the smaller of two floats.',
        example: 'let m: float = fmin(1.5, 2.5); // 1.5',
        signature: '',
    },
    {
        name: 'fmax', category: 'math', returnType: 'float',
        params: [
            { name: 'a', type: 'float', description: 'First float' },
            { name: 'b', type: 'float', description: 'Second float' },
        ],
        description: 'Return the larger of two floats.',
        example: 'let m: float = fmax(1.5, 2.5); // 2.5',
        signature: '',
    },

    // Result (4)
    {
        name: 'is_ok', category: 'result', returnType: 'bool',
        params: [{ name: 'r', type: 'Result<T, E>', description: 'Result to check' }],
        description: 'Check if a Result is the Ok variant.',
        example: 'if is_ok(result) { let v: int = unwrap(result); }',
        signature: '',
    },
    {
        name: 'is_err', category: 'result', returnType: 'bool',
        params: [{ name: 'r', type: 'Result<T, E>', description: 'Result to check' }],
        description: 'Check if a Result is the Err variant.',
        example: 'if is_err(result) { print(unwrap_err(result)); }',
        signature: '',
    },
    {
        name: 'unwrap', category: 'result', returnType: 'T',
        params: [{ name: 'r', type: 'Result<T, E>', description: 'Result to unwrap' }],
        description: 'Extract the Ok value from a Result. Aborts if the Result is Err.',
        example: 'let val: int = unwrap(result);',
        signature: '',
    },
    {
        name: 'unwrap_err', category: 'result', returnType: 'E',
        params: [{ name: 'r', type: 'Result<T, E>', description: 'Result to unwrap' }],
        description: 'Extract the Err value from a Result. Aborts if the Result is Ok.',
        example: 'let msg: str = unwrap_err(result);',
        signature: '',
    },

    // Utility (2)
    {
        name: 'exit', category: 'utility', returnType: 'void',
        params: [{ name: 'code', type: 'int', description: 'Exit status code' }],
        description: 'Terminate the program with a status code.',
        example: 'exit(1);',
        signature: '',
    },
    {
        name: 'assert', category: 'utility', returnType: 'void',
        params: [
            { name: 'cond', type: 'bool', description: 'Condition to check' },
            { name: 'msg', type: 'str', description: 'Error message if assertion fails' },
        ],
        description: 'Abort with a message if the condition is false.',
        example: 'assert(n >= 0, "n must be non-negative");',
        signature: '',
    },
];

// Pre-compute signatures
for (const fn of BUILTIN_FUNCTIONS) {
    fn.signature = sig(fn.name, fn.params, fn.returnType);
}

// ─── Keyword Database ──────────────────────────────────────────

export const KEYWORDS: KeywordInfo[] = [
    { name: 'fn', kind: 'declaration', description: 'Declare a function.', example: 'fn add(a: int, b: int): int {\n    return a + b;\n}' },
    { name: 'let', kind: 'declaration', description: 'Declare an immutable variable. Use `let mut` for mutable variables.', example: 'let name: str = "URUS";' },
    { name: 'mut', kind: 'modifier', description: 'Mark a variable as mutable. Variables are immutable by default.', example: 'let mut count: int = 0;\ncount = count + 1;' },
    { name: 'struct', kind: 'declaration', description: 'Declare a struct type with named fields.', example: 'struct Point {\n    x: float;\n    y: float;\n}' },
    { name: 'enum', kind: 'declaration', description: 'Declare a tagged union (enum) with variants.', example: 'enum Shape {\n    Circle(r: float);\n    Point;\n}' },
    { name: 'import', kind: 'declaration', description: 'Import another URUS module. Path is relative to the current file.', example: 'import "utils.urus";' },
    { name: 'if', kind: 'control', description: 'Conditional branch. No parentheses required around the condition.', example: 'if x > 0 {\n    print("positive");\n}' },
    { name: 'else', kind: 'control', description: 'Alternative branch for an `if` statement.', example: 'if x > 0 {\n    print("positive");\n} else {\n    print("non-positive");\n}' },
    { name: 'while', kind: 'control', description: 'Loop while a condition is true.', example: 'while i < 10 {\n    i += 1;\n}' },
    { name: 'for', kind: 'control', description: 'Loop over a range or array elements.', example: 'for i in 0..10 { print(i); }\nfor item in array { print(item); }' },
    { name: 'in', kind: 'control', description: 'Used with `for` loops to iterate over ranges or arrays.', example: 'for i in 0..10 { ... }' },
    { name: 'return', kind: 'control', description: 'Return a value from a function.', example: 'return result;' },
    { name: 'break', kind: 'control', description: 'Exit the current loop.', example: 'while true {\n    if done { break; }\n}' },
    { name: 'continue', kind: 'control', description: 'Skip to the next iteration of the current loop.', example: 'for i in 0..10 {\n    if i == 5 { continue; }\n    print(i);\n}' },
    { name: 'match', kind: 'control', description: 'Pattern match on an enum value.', example: 'match shape {\n    Shape.Circle(r) => {\n        print(r);\n    }\n}' },
    { name: 'true', kind: 'literal', description: 'Boolean literal `true`.', example: 'let flag: bool = true;' },
    { name: 'false', kind: 'literal', description: 'Boolean literal `false`.', example: 'let flag: bool = false;' },
    { name: 'Ok', kind: 'result', description: 'Construct the Ok variant of a Result type.', example: 'return Ok(42);' },
    { name: 'Err', kind: 'result', description: 'Construct the Err variant of a Result type.', example: 'return Err("something went wrong");' },
];

// ─── Type Database ─────────────────────────────────────────────

export const TYPES: TypeInfo[] = [
    { name: 'int', cEquivalent: 'int64_t', description: '64-bit signed integer.' },
    { name: 'float', cEquivalent: 'double', description: '64-bit floating point number.' },
    { name: 'bool', cEquivalent: 'bool', description: 'Boolean value (`true` or `false`).' },
    { name: 'str', cEquivalent: 'urus_str*', description: 'UTF-8 string (reference counted).' },
    { name: 'void', cEquivalent: 'void', description: 'No value. Used as return type for functions that return nothing.' },
    { name: 'Result', cEquivalent: 'tagged union', description: 'Error handling type. `Result<T, E>` is either `Ok(T)` or `Err(E)`.' },
];

// ─── Lookup Maps ───────────────────────────────────────────────

export const BUILTIN_MAP = new Map<string, BuiltinFunction>();
for (const fn of BUILTIN_FUNCTIONS) {
    BUILTIN_MAP.set(fn.name, fn);
}

export const KEYWORD_MAP = new Map<string, KeywordInfo>();
for (const kw of KEYWORDS) {
    KEYWORD_MAP.set(kw.name, kw);
}

export const TYPE_MAP = new Map<string, TypeInfo>();
for (const t of TYPES) {
    TYPE_MAP.set(t.name, t);
}

export const ALL_TYPE_NAMES = ['int', 'float', 'bool', 'str', 'void', 'Result', '[int]', '[float]', '[bool]', '[str]'];
