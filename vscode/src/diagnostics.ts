import * as vscode from 'vscode';
import { runCompiler } from './compiler';
import { isDiagnosticsEnabled } from './config';

// Parse: filename:line: Error: message
//        filename:line: Warning: message
const DIAG_PATTERN = /^(.+?):(\d+):\s*(Error|Warning):\s*(.+)$/gm;

export interface ParsedDiagnostic {
    file: string;
    line: number;
    severity: vscode.DiagnosticSeverity;
    message: string;
}

export function parseDiagnostics(stderr: string): ParsedDiagnostic[] {
    const results: ParsedDiagnostic[] = [];
    let match: RegExpExecArray | null;

    // Reset regex state
    DIAG_PATTERN.lastIndex = 0;

    while ((match = DIAG_PATTERN.exec(stderr)) !== null) {
        results.push({
            file: match[1].trim(),
            line: parseInt(match[2], 10),
            severity: match[3] === 'Error'
                ? vscode.DiagnosticSeverity.Error
                : vscode.DiagnosticSeverity.Warning,
            message: match[4].trim(),
        });
    }

    return results;
}

export async function updateDiagnostics(
    document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection
): Promise<void> {
    if (!isDiagnosticsEnabled()) {
        collection.clear();
        return;
    }

    if (document.languageId !== 'urus') {
        return;
    }

    const filePath = document.uri.fsPath;
    const result = await runCompiler(filePath, ['--emit-c']);

    // Clear previous diagnostics for this file
    collection.delete(document.uri);

    if (result.stderr.length === 0) {
        return;
    }

    const parsed = parseDiagnostics(result.stderr);
    if (parsed.length === 0) {
        return;
    }

    // Group by file
    const byFile = new Map<string, vscode.Diagnostic[]>();

    for (const d of parsed) {
        const lineIndex = Math.max(0, d.line - 1); // VS Code is 0-indexed
        const lineText = lineIndex < document.lineCount
            ? document.lineAt(lineIndex).text
            : '';
        const range = new vscode.Range(
            lineIndex, 0,
            lineIndex, lineText.length
        );

        const diagnostic = new vscode.Diagnostic(range, d.message, d.severity);
        diagnostic.source = 'urusc';

        // Most errors are for the current file
        const key = d.file;
        if (!byFile.has(key)) {
            byFile.set(key, []);
        }
        byFile.get(key)!.push(diagnostic);
    }

    // Set diagnostics — for the current file, use document.uri
    // For other files (from imports), try to resolve the URI
    for (const [file, diags] of byFile) {
        if (file === filePath || file === document.fileName) {
            collection.set(document.uri, diags);
        } else {
            const uri = vscode.Uri.file(file);
            collection.set(uri, diags);
        }
    }
}
