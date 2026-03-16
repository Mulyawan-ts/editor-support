import * as vscode from 'vscode';
import { BUILTIN_FUNCTIONS, KEYWORDS, ALL_TYPE_NAMES, BuiltinFunction } from './builtins';

function makeBuiltinItem(fn: BuiltinFunction): vscode.CompletionItem {
    const item = new vscode.CompletionItem(fn.name, vscode.CompletionItemKind.Function);
    item.detail = fn.signature;
    item.documentation = new vscode.MarkdownString(`${fn.description}\n\n**Example:**\n\`\`\`urus\n${fn.example}\n\`\`\``);

    // Insert with snippet tabstops for parameters
    if (fn.params.length === 0) {
        item.insertText = new vscode.SnippetString(`${fn.name}()$0`);
    } else {
        const paramSnippets = fn.params.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ');
        item.insertText = new vscode.SnippetString(`${fn.name}(${paramSnippets})$0`);
    }

    item.sortText = `1_${fn.name}`; // Sort builtins after keywords
    return item;
}

export class UrusCompletionProvider implements vscode.CompletionItemProvider {
    private builtinItems: vscode.CompletionItem[];
    private keywordItems: vscode.CompletionItem[];
    private typeItems: vscode.CompletionItem[];

    constructor() {
        // Pre-build completion items
        this.builtinItems = BUILTIN_FUNCTIONS.map(makeBuiltinItem);

        this.keywordItems = KEYWORDS
            .filter(kw => kw.kind === 'declaration' || kw.kind === 'control' || kw.kind === 'modifier')
            .map(kw => {
                const item = new vscode.CompletionItem(kw.name, vscode.CompletionItemKind.Keyword);
                item.detail = kw.kind;
                item.documentation = new vscode.MarkdownString(kw.description);
                item.sortText = `0_${kw.name}`;
                return item;
            });

        this.typeItems = ALL_TYPE_NAMES.map(t => {
            const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.TypeParameter);
            item.sortText = `0_${t}`;
            return item;
        });
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);

        // After ':' — suggest types
        if (/:\s*$/.test(textBefore)) {
            const items = [...this.typeItems];
            // Also suggest user-defined struct/enum names from the document
            const text = document.getText();
            const structMatches = text.matchAll(/\bstruct\s+([A-Z][a-zA-Z0-9_]*)/g);
            for (const m of structMatches) {
                const item = new vscode.CompletionItem(m[1], vscode.CompletionItemKind.Struct);
                items.push(item);
            }
            const enumMatches = text.matchAll(/\benum\s+([A-Z][a-zA-Z0-9_]*)/g);
            for (const m of enumMatches) {
                const item = new vscode.CompletionItem(m[1], vscode.CompletionItemKind.Enum);
                items.push(item);
            }
            return items;
        }

        // After '.' — suggest enum variants
        const dotMatch = textBefore.match(/\b([A-Z][a-zA-Z0-9_]*)\.\s*$/);
        if (dotMatch) {
            const enumName = dotMatch[1];
            return this.getEnumVariants(document, enumName);
        }

        // Default — keywords + builtins + literals
        const items: vscode.CompletionItem[] = [
            ...this.keywordItems,
            ...this.builtinItems,
        ];

        // Boolean literals
        items.push(new vscode.CompletionItem('true', vscode.CompletionItemKind.Value));
        items.push(new vscode.CompletionItem('false', vscode.CompletionItemKind.Value));

        // Ok / Err
        const okItem = new vscode.CompletionItem('Ok', vscode.CompletionItemKind.Function);
        okItem.insertText = new vscode.SnippetString('Ok(${1:value})$0');
        okItem.detail = 'Result Ok constructor';
        items.push(okItem);

        const errItem = new vscode.CompletionItem('Err', vscode.CompletionItemKind.Function);
        errItem.insertText = new vscode.SnippetString('Err(${1:message})$0');
        errItem.detail = 'Result Err constructor';
        items.push(errItem);

        return items;
    }

    private getEnumVariants(document: vscode.TextDocument, enumName: string): vscode.CompletionItem[] {
        const text = document.getText();
        // Find enum declaration and extract variants
        const enumRegex = new RegExp(`\\benum\\s+${enumName}\\s*\\{([^}]*)\\}`, 's');
        const match = text.match(enumRegex);
        if (!match) { return []; }

        const body = match[1];
        const items: vscode.CompletionItem[] = [];
        // Match variants: Name; or Name(fields);
        const variantRegex = /\b([A-Z][a-zA-Z0-9_]*)(?:\s*\(([^)]*)\))?\s*;/g;
        let vm: RegExpExecArray | null;
        while ((vm = variantRegex.exec(body)) !== null) {
            const varName = vm[1];
            const hasParams = vm[2] && vm[2].trim().length > 0;
            const item = new vscode.CompletionItem(varName, vscode.CompletionItemKind.EnumMember);
            if (hasParams) {
                const paramNames = vm[2].split(',').map(p => p.trim().split(':')[0].trim());
                const snippet = paramNames.map((p, i) => `\${${i + 1}:${p}}`).join(', ');
                item.insertText = new vscode.SnippetString(`${varName}(${snippet})$0`);
                item.detail = `${enumName}.${varName}(${vm[2].trim()})`;
            } else {
                item.detail = `${enumName}.${varName}`;
            }
            items.push(item);
        }

        return items;
    }
}
