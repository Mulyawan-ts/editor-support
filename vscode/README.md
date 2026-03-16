# URUS - Syntax Highlighting & Snippets

Full IDE-like support for the [URUS programming language](https://github.com/Urus-Foundation/Urus) in VS Code.

## Features

### Syntax Highlighting
- Complete TextMate grammar: 23 keywords, 34 built-in functions, all operators
- F-string interpolation `f"Hello {name}"` with expression highlighting
- Enum variants `EnumName.Variant`, struct constructors, method calls
- Type annotations, `Result<T, E>` generics, array types `[T]`

### IntelliSense
- **Auto-complete** — keywords, types, built-in functions with snippet parameter insertion
- **Context-aware** — suggests types after `:`, enum variants after `.`
- **Signature Help** — parameter hints inside `()` for all built-in and user-defined functions
- **Hover Tooltips** — documentation for all 34 built-ins, keywords, and types

### Diagnostics
- **Error squiggles** on file save — invokes the URUS compiler and shows errors inline
- **Problems panel** integration — all errors and warnings in one place
- Configurable via `urus.diagnostics.enable` setting

### Commands
| Command | Shortcut | Description |
|---------|----------|-------------|
| URUS: Build Current File | `Ctrl+Shift+B` | Compile to binary |
| URUS: Build and Run | `Ctrl+F5` | Compile and execute in terminal |
| URUS: Show Generated C Code | — | Open generated C in new tab |
| URUS: Show Lexer Tokens | — | View tokenizer output |
| URUS: Show AST | — | View abstract syntax tree |

### Document Outline
- **Outline view** — functions, structs, enums with fields/variants as children
- **Breadcrumb navigation** — see your location in the file
- **Go to Symbol** — `Ctrl+Shift+O` to jump to any declaration

### Semantic Highlighting
- Differentiates **mutable** vs **immutable** variables
- Marks **built-in functions** differently from user functions
- Highlights **declarations**, **parameters**, **enum members**, **properties**

### Color Theme
- **URUS Dark** — custom dark theme optimized for URUS syntax
- Teal types, purple keywords, gold built-ins, green strings, red `mut`

### Code Snippets
50+ snippets for all patterns — type a prefix and press Tab:

| Prefix | Expands to |
|--------|------------|
| `main` | `fn main(): void { }` |
| `fn` / `fnr` | Function declaration / with return |
| `let` / `letm` | Immutable / mutable variable |
| `if` / `ife` | If / if-else |
| `for` / `fori` / `fore` | For range / inclusive / each |
| `while` | While loop |
| `struct` / `structi` | Struct declaration / instance |
| `enum` | Enum declaration |
| `match` / `arm` | Match expression / arm |
| `fnresult` / `ok` / `err` / `isok` | Result patterns |
| `import` | Import module |
| `print` / `printf` | Print / print with f-string |
| `push` / `pop` / `len` | Array operations |
| `tostr` / `toint` / `tofloat` | Type conversions |

### Editor Features
- Bracket matching, auto-closing, colorized bracket pairs
- Code folding for functions, structs, enums, control flow
- Smart indentation and comment continuation
- Status bar shows URUS compiler version

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `urus.compilerPath` | `"urusc"` | Path to the URUS compiler |
| `urus.buildArgs` | `[]` | Extra arguments for the compiler |
| `urus.diagnostics.enable` | `true` | Enable error diagnostics |
| `urus.diagnostics.onSave` | `true` | Run diagnostics on file save |

## Installation

### From VSIX
```bash
code --install-extension urus-language-0.3.0.vsix
```

### Manual
```bash
# Linux / macOS
cp -r editor-support/vscode ~/.vscode/extensions/urus-language

# Windows (PowerShell)
Copy-Item -Recurse editor-support\vscode "$env:USERPROFILE\.vscode\extensions\urus-language"
```

Restart VS Code after installing.

### Build from Source
```bash
cd editor-support/vscode
npm install
npm run compile
npx vsce package
```

## File Structure

```
vscode/
├── dist/extension.js              # Bundled extension code
├── icon.png                       # Extension icon
├── language-configuration.json    # Brackets, folding, indentation
├── package.json                   # Extension manifest
├── snippets/urus.code-snippets    # 50+ code snippets
├── src/                           # TypeScript source
│   ├── extension.ts               # Entry point
│   ├── builtins.ts                # Built-in function database
│   ├── commands.ts                # Build/Run/Emit commands
│   ├── compiler.ts                # Compiler invocation
│   ├── completion.ts              # Auto-complete provider
│   ├── config.ts                  # Settings manager
│   ├── diagnostics.ts             # Error diagnostics
│   ├── hover.ts                   # Hover tooltips
│   ├── semanticTokens.ts          # Semantic highlighting
│   ├── signatureHelp.ts           # Parameter hints
│   └── symbols.ts                 # Document outline
├── syntaxes/urus.tmLanguage.json  # TextMate grammar
└── themes/urus-dark-theme.json    # URUS Dark color theme
```

## Links

- [URUS Repository](https://github.com/Urus-Foundation/Urus)
- [Language Specification](https://github.com/Urus-Foundation/Urus/blob/main/SPEC.md)
- [Report Issues](https://github.com/Urus-Foundation/Urus/issues)

## License

Apache 2.0
