import * as vscode from 'vscode';

export class UrusDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();

        // Find functions
        this.findFunctions(document, text, symbols);
        // Find structs
        this.findStructs(document, text, symbols);
        // Find enums
        this.findEnums(document, text, symbols);

        return symbols;
    }

    private findFunctions(
        document: vscode.TextDocument,
        text: string,
        symbols: vscode.DocumentSymbol[]
    ): void {
        const regex = /\bfn\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?::\s*([a-zA-Z_][a-zA-Z0-9_<>,\[\]\s]*))?/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const name = match[1];
            const params = match[2].trim();
            const returnType = match[3]?.trim() || 'void';
            const detail = `(${params}): ${returnType}`;

            const startPos = document.positionAt(match.index);
            const endPos = this.findClosingBrace(document, text, match.index + match[0].length);

            const range = new vscode.Range(startPos, endPos);
            const selectionRange = new vscode.Range(
                startPos,
                document.positionAt(match.index + match[0].length)
            );

            const symbol = new vscode.DocumentSymbol(
                name, detail,
                vscode.SymbolKind.Function,
                range, selectionRange
            );

            // Add parameters as children
            if (params.length > 0) {
                const paramList = params.split(',');
                for (const p of paramList) {
                    const parts = p.trim().split(':');
                    if (parts.length >= 1) {
                        const paramName = parts[0].trim().replace(/^mut\s+/, '');
                        const paramSymbol = new vscode.DocumentSymbol(
                            paramName, parts[1]?.trim() || '',
                            vscode.SymbolKind.Variable,
                            selectionRange, selectionRange
                        );
                        symbol.children.push(paramSymbol);
                    }
                }
            }

            symbols.push(symbol);
        }
    }

    private findStructs(
        document: vscode.TextDocument,
        text: string,
        symbols: vscode.DocumentSymbol[]
    ): void {
        const regex = /\bstruct\s+([A-Z][a-zA-Z0-9_]*)\s*\{/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const name = match[1];
            const startPos = document.positionAt(match.index);
            const endPos = this.findClosingBrace(document, text, match.index + match[0].length);

            const range = new vscode.Range(startPos, endPos);
            const selectionRange = new vscode.Range(
                startPos,
                document.positionAt(match.index + match[0].length)
            );

            const symbol = new vscode.DocumentSymbol(
                name, 'struct',
                vscode.SymbolKind.Struct,
                range, selectionRange
            );

            // Find fields
            const bodyStart = match.index + match[0].length;
            const bodyEnd = document.offsetAt(endPos);
            const body = text.substring(bodyStart, bodyEnd);
            const fieldRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^;]+);/g;
            let fm: RegExpExecArray | null;
            while ((fm = fieldRegex.exec(body)) !== null) {
                const fieldSymbol = new vscode.DocumentSymbol(
                    fm[1], fm[2].trim(),
                    vscode.SymbolKind.Field,
                    selectionRange, selectionRange
                );
                symbol.children.push(fieldSymbol);
            }

            symbols.push(symbol);
        }
    }

    private findEnums(
        document: vscode.TextDocument,
        text: string,
        symbols: vscode.DocumentSymbol[]
    ): void {
        const regex = /\benum\s+([A-Z][a-zA-Z0-9_]*)\s*\{/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const name = match[1];
            const startPos = document.positionAt(match.index);
            const endPos = this.findClosingBrace(document, text, match.index + match[0].length);

            const range = new vscode.Range(startPos, endPos);
            const selectionRange = new vscode.Range(
                startPos,
                document.positionAt(match.index + match[0].length)
            );

            const symbol = new vscode.DocumentSymbol(
                name, 'enum',
                vscode.SymbolKind.Enum,
                range, selectionRange
            );

            // Find variants
            const bodyStart = match.index + match[0].length;
            const bodyEnd = document.offsetAt(endPos);
            const body = text.substring(bodyStart, bodyEnd);
            const variantRegex = /\b([A-Z][a-zA-Z0-9_]*)(?:\s*\([^)]*\))?\s*;/g;
            let vm: RegExpExecArray | null;
            while ((vm = variantRegex.exec(body)) !== null) {
                const variantSymbol = new vscode.DocumentSymbol(
                    vm[1], '',
                    vscode.SymbolKind.EnumMember,
                    selectionRange, selectionRange
                );
                symbol.children.push(variantSymbol);
            }

            symbols.push(symbol);
        }
    }

    private findClosingBrace(
        document: vscode.TextDocument,
        text: string,
        startOffset: number
    ): vscode.Position {
        let depth = 1;
        let inString = false;
        let inLineComment = false;
        let inBlockComment = false;

        for (let i = startOffset; i < text.length; i++) {
            const ch = text[i];
            const next = i + 1 < text.length ? text[i + 1] : '';

            if (inLineComment) {
                if (ch === '\n') { inLineComment = false; }
                continue;
            }
            if (inBlockComment) {
                if (ch === '*' && next === '/') { inBlockComment = false; i++; }
                continue;
            }
            if (inString) {
                if (ch === '\\') { i++; continue; }
                if (ch === '"') { inString = false; }
                continue;
            }

            if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
            if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
            if (ch === '"') { inString = true; continue; }

            if (ch === '{') { depth++; }
            else if (ch === '}') {
                depth--;
                if (depth === 0) {
                    return document.positionAt(i + 1);
                }
            }
        }

        // Fallback: end of document
        return document.positionAt(text.length);
    }
}
