import * as vscode from 'vscode';
import { BUILTIN_MAP, KEYWORD_MAP, TYPE_MAP } from './builtins';

const WORD_PATTERN = /[a-zA-Z_][a-zA-Z0-9_]*/;

export class UrusHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, WORD_PATTERN);
        if (!range) { return null; }
        const word = document.getText(range);

        // Check built-in functions
        const fn = BUILTIN_MAP.get(word);
        if (fn) {
            const md = new vscode.MarkdownString();
            md.appendCodeblock(fn.signature, 'urus');
            md.appendMarkdown(`**Built-in Function** *(${fn.category})*\n\n`);
            md.appendMarkdown(`${fn.description}\n\n`);
            md.appendMarkdown(`**Example:**\n`);
            md.appendCodeblock(fn.example, 'urus');
            return new vscode.Hover(md, range);
        }

        // Check keywords
        const kw = KEYWORD_MAP.get(word);
        if (kw) {
            const md = new vscode.MarkdownString();
            md.appendMarkdown(`**\`${kw.name}\`** — *${kw.kind}*\n\n`);
            md.appendMarkdown(`${kw.description}\n\n`);
            md.appendCodeblock(kw.example, 'urus');
            return new vscode.Hover(md, range);
        }

        // Check types
        const ty = TYPE_MAP.get(word);
        if (ty) {
            const md = new vscode.MarkdownString();
            md.appendMarkdown(`**\`${ty.name}\`** — *type*\n\n`);
            md.appendMarkdown(`${ty.description}\n\n`);
            md.appendMarkdown(`C equivalent: \`${ty.cEquivalent}\``);
            return new vscode.Hover(md, range);
        }

        return null;
    }
}
