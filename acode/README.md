# URUS Language Plugin for Acode

Full language support for the [URUS programming language](https://github.com/Urus-Foundation/Urus) in [Acode](https://acode.app) editor on Android.

## Features

### Syntax Highlighting
- All 23 keywords with declaration vs control flow differentiation
- 34 built-in functions highlighted as built-ins (I/O, Array, String, Math, Result, Utility)
- Primitive types (`int`, `float`, `bool`, `str`, `void`) and `Result<T, E>` generics
- F-string interpolation `f"text {expr}"` with nested expression highlighting
- Enum variants `EnumName.Variant`, struct constructors, method calls
- `let mut` (mutable) vs `let` (immutable) variable declarations
- Array types `[int]`, `[str]`, import paths, string escape sequences
- Operators: arithmetic, comparison, logical, assignment, range `..`/`..=`, match arrow `=>`

### Auto-Complete
- All 34 built-in functions with signatures and descriptions
- Context-aware: types after `:`, enum variants after `.`
- Keywords, types, and boolean literals

### Code Snippets
28 snippets — type prefix then Tab:

| Prefix | Expands to |
|--------|------------|
| `main` | `fn main(): void { }` |
| `fn` / `fnr` | Function / with return |
| `let` / `letm` / `lets` / `leta` | Variable declarations |
| `if` / `ife` | If / if-else |
| `for` / `fori` / `fore` | Range / inclusive / each |
| `while` | While loop |
| `struct` / `enum` | Type declarations |
| `match` | Match expression |
| `import` | Import module |
| `print` / `printf` | Print / with f-string |
| `fnresult` / `ok` / `err` / `isok` | Result patterns |
| `push` / `readf` / `writef` | Built-in operations |
| `tostr` / `toint` | Type conversions |
| `assert` | Assert with message |

### Editor Features
- Code folding (C-style brace matching)
- Smart indentation — auto-indent after `{`
- Matching brace outdent
- Comment toggling (`//` and `/* */`)
- Bracket auto-closing

## Installation

### From Acode Plugin Manager
1. Open Acode
2. Settings > Plugins
3. Search "URUS"
4. Install

### Manual Install
1. Download the plugin files (`main.js`, `plugin.json`, `icon.png`)
2. Open Acode > Settings > Plugins > Install from file
3. Select the plugin folder

## Optimizations for Mobile

- Pre-built completion item arrays — no allocation on each keystroke
- Lightweight: single `main.js` file, no dependencies, no bundler needed
- No background processes or file watchers
- Minimal DOM manipulation (one `<style>` tag for file icons)
- All regex patterns pre-compiled at load time

## File Structure

```
acode/
├── main.js        # Plugin code (syntax, completion, snippets, folding)
├── plugin.json    # Plugin manifest
├── icon.png       # File icon
├── README.md      # This file
└── CHANGELOG.md   # Version history
```

## Links

- [URUS Repository](https://github.com/Urus-Foundation/Urus)
- [Language Specification](https://github.com/Urus-Foundation/Urus/blob/main/SPEC.md)
- [Acode Editor](https://acode.app)

## License

Apache 2.0
