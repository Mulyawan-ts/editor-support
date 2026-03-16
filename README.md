# URUS Editor Support

Editor extensions and plugins for the [URUS programming language](https://github.com/Urus-Foundation/Urus).

## Available Editors

| Editor | Folder | Features | Version |
|--------|--------|----------|---------|
| **VS Code** | [`vscode/`](./vscode/) | Syntax highlighting, IntelliSense, diagnostics, build commands, 50+ snippets, semantic tokens, URUS Dark theme | v0.3.0 |
| **Acode** (Android) | [`acode/`](./acode/) | Syntax highlighting, auto-complete, 28 snippets, code folding, smart indent | v0.3.0 |

## VS Code

Full IDE-like support: syntax highlighting, auto-complete, hover tooltips, signature help, error diagnostics, build/run commands, document outline, semantic tokens, URUS Dark theme, and 50+ snippets.

**Install:**
```bash
# From VSIX
code --install-extension vscode/urus-language-0.3.0.vsix

# Or from marketplace (search "URUS")
```

See [`vscode/README.md`](./vscode/README.md) for full documentation.

## Acode (Android)

Full mobile-optimized support: syntax highlighting, auto-complete with all 34 built-ins, 28 snippets, code folding, smart indentation. Lightweight single-file plugin, no dependencies.

**Install:** Acode > Settings > Plugins > search "URUS"

See [`acode/README.md`](./acode/README.md) for full documentation.

## Contributing

1. Fork this repository
2. Edit the extension/plugin files
3. Test locally
4. Submit a PR

## Links

- [URUS Language](https://github.com/Urus-Foundation/Urus)
- [Language Specification](https://github.com/Urus-Foundation/Urus/blob/main/SPEC.md)
- [Report Issues](https://github.com/Urus-Foundation/editor-support/issues)

## License

Apache 2.0
