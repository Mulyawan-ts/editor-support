import * as vscode from 'vscode';
import { BUILTIN_MAP, BuiltinFunction } from './builtins';

export class UrusSignatureHelpProvider implements vscode.SignatureHelpProvider {
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);

        // Walk backwards to find the function name and active parameter
        const callInfo = this.findCallContext(textBefore);
        if (!callInfo) { return null; }

        // Look up in built-in functions
        let fn = BUILTIN_MAP.get(callInfo.funcName);

        // If not a built-in, try to find user-defined function in the document
        if (!fn) {
            const userFn = this.findUserFunction(document, callInfo.funcName);
            if (!userFn) { return null; }
            fn = userFn;
        }

        if (fn.params.length === 0) { return null; }

        const sigInfo = new vscode.SignatureInformation(fn.signature, fn.description);

        // Build parameter info
        for (const p of fn.params) {
            const paramLabel = `${p.name}: ${p.type}`;
            sigInfo.parameters.push(
                new vscode.ParameterInformation(paramLabel, p.description)
            );
        }

        const help = new vscode.SignatureHelp();
        help.signatures = [sigInfo];
        help.activeSignature = 0;
        help.activeParameter = Math.min(callInfo.paramIndex, fn.params.length - 1);

        return help;
    }

    private findCallContext(text: string): { funcName: string; paramIndex: number } | null {
        let depth = 0;
        let commaCount = 0;

        // Walk backwards from end of text
        for (let i = text.length - 1; i >= 0; i--) {
            const ch = text[i];
            if (ch === ')') { depth++; }
            else if (ch === '(') {
                if (depth === 0) {
                    // Found the opening paren — extract function name
                    const before = text.substring(0, i).trimEnd();
                    const nameMatch = before.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
                    if (!nameMatch) { return null; }
                    return { funcName: nameMatch[1], paramIndex: commaCount };
                }
                depth--;
            }
            else if (ch === ',' && depth === 0) {
                commaCount++;
            }
        }
        return null;
    }

    private findUserFunction(document: vscode.TextDocument, name: string): BuiltinFunction | null {
        const text = document.getText();
        const fnRegex = new RegExp(`\\bfn\\s+${name}\\s*\\(([^)]*)\\)\\s*(?::\\s*([a-zA-Z_][a-zA-Z0-9_<>,\\[\\]\\s]*))?`, '');
        const match = text.match(fnRegex);
        if (!match) { return null; }

        const paramsStr = match[1].trim();
        const returnType = match[2]?.trim() || 'void';

        const params = paramsStr.length > 0
            ? paramsStr.split(',').map(p => {
                const parts = p.trim().split(':');
                return {
                    name: parts[0]?.trim() || 'param',
                    type: parts[1]?.trim() || 'any',
                    description: '',
                };
            })
            : [];

        const sigParts = params.map(p => `${p.name}: ${p.type}`).join(', ');
        return {
            name,
            category: 'utility',
            returnType,
            params,
            description: `User-defined function \`${name}\``,
            example: '',
            signature: `fn ${name}(${sigParts}): ${returnType}`,
        };
    }
}
