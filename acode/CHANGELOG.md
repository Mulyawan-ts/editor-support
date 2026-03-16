# Changelog

## v0.3.0 — 2026-03-16

### Added
- **Auto-complete** for all 34 built-in functions with signatures and descriptions
- **Context-aware completion** — types after `:`, enum variants after `.`
- **28 code snippets** — main, fn, let, if, for, while, struct, enum, match, Result, import, I/O, etc.
- **Code folding** — collapse functions, structs, enums, control flow blocks
- **Smart indentation** — auto-indent after `{`, auto-outdent on `}`
- **Matching brace outdent** — auto-correct indentation on `}`

### Improved
- Enhanced syntax highlighting:
  - Function declaration names vs function calls
  - `let mut` vs `let` with separate variable highlighting
  - Enum variant access `EnumName.Variant`
  - Method calls `obj.method()` vs field access `obj.field`
  - `Result<T, E>` generic type highlighting
  - Array types `[int]`, `[str]`, etc.
  - Import path strings
  - Invalid escape sequences in strings
  - F-string inner string expressions
  - Match arrow `=>`, range `..`/`..=` operators

### Optimized
- Pre-built completion items (no allocation on each keystroke)
- Lightweight — no external dependencies, pure Ace editor API

---

## v0.2.2 — 2026-03-15

### Added
- Syntax highlighting for `.urus` files
- Support for keywords, types, and built-in functions
- String and f-string interpolation highlighting
- Comment highlighting (single-line `//` and block `/* */`)
- Operator highlighting

---

## v0.1.0 — 2026-03-10

### Added
- Initial release
- Basic `.urus` file type recognition
