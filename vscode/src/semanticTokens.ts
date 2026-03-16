import * as vscode from 'vscode';
import { BUILTIN_MAP } from './builtins';

const TOKEN_TYPES = ['function', 'variable', 'parameter', 'type', 'enumMember', 'property'];
const TOKEN_MODIFIERS = ['declaration', 'readonly', 'defaultLibrary'];

export const SEMANTIC_LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS);

const tokenTypeIndex = new Map<string, number>();
TOKEN_TYPES.forEach((t, i) => tokenTypeIndex.set(t, i));

const tokenModIndex = new Map<string, number>();
TOKEN_MODIFIERS.forEach((m, i) => tokenModIndex.set(m, i));

function modBits(...mods: string[]): number {
    let bits = 0;
    for (const m of mods) {
        const idx = tokenModIndex.get(m);
        if (idx !== undefined) { bits |= (1 << idx); }
    }
    return bits;
}

export class UrusSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
    ): vscode.SemanticTokens {
        const builder = new vscode.SemanticTokensBuilder(SEMANTIC_LEGEND);
        const text = document.getText();

        // 1. Function declarations: fn name(
        this.markPattern(builder, document, text,
            /\bfn\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            1, 'function', ['declaration']);

        // 2. Struct declarations: struct Name
        this.markPattern(builder, document, text,
            /\bstruct\s+([A-Z][a-zA-Z0-9_]*)/g,
            1, 'type', ['declaration']);

        // 3. Enum declarations: enum Name
        this.markPattern(builder, document, text,
            /\benum\s+([A-Z][a-zA-Z0-9_]*)/g,
            1, 'type', ['declaration']);

        // 4. Immutable variable declarations: let name:
        this.markPattern(builder, document, text,
            /\blet\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
            1, 'variable', ['declaration', 'readonly']);

        // 5. Mutable variable declarations: let mut name:
        this.markPattern(builder, document, text,
            /\blet\s+mut\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
            1, 'variable', ['declaration']);

        // 6. Built-in function calls: name(
        for (const [name] of BUILTIN_MAP) {
            const regex = new RegExp(`\\b(${name})\\s*\\(`, 'g');
            this.markPattern(builder, document, text, regex, 1, 'function', ['defaultLibrary']);
        }

        // 7. Enum variant access: EnumName.Variant
        this.markPattern(builder, document, text,
            /\b[A-Z][a-zA-Z0-9_]*\.([A-Z][a-zA-Z0-9_]*)/g,
            1, 'enumMember', []);

        // 8. Field access (lowercase after dot): obj.field
        this.markPattern(builder, document, text,
            /(?<=[a-zA-Z0-9_\]\)])\.([a-z_][a-zA-Z0-9_]*)(?!\s*\()/g,
            1, 'property', []);

        return builder.build();
    }

    private markPattern(
        builder: vscode.SemanticTokensBuilder,
        document: vscode.TextDocument,
        text: string,
        regex: RegExp,
        captureGroup: number,
        tokenType: string,
        modifiers: string[],
    ): void {
        const typeIdx = tokenTypeIndex.get(tokenType);
        if (typeIdx === undefined) { return; }
        const modBitsVal = modBits(...modifiers);

        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const fullMatch = match[0];
            const capture = match[captureGroup];
            if (!capture) { continue; }

            // Calculate offset of the capture within the full match
            const captureStart = match.index + fullMatch.indexOf(capture);
            const pos = document.positionAt(captureStart);

            builder.push(pos.line, pos.character, capture.length, typeIdx, modBitsVal);
        }
    }
}
