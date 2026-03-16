import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { updateDiagnostics } from './diagnostics';
import { UrusHoverProvider } from './hover';
import { UrusCompletionProvider } from './completion';
import { UrusSignatureHelpProvider } from './signatureHelp';
import { UrusDocumentSymbolProvider } from './symbols';
import { UrusSemanticTokensProvider, SEMANTIC_LEGEND } from './semanticTokens';
import { getCompilerVersion } from './compiler';
import { invalidateCache, isDiagnosticsOnSave } from './config';

const URUS_SELECTOR: vscode.DocumentSelector = { language: 'urus', scheme: 'file' };

export function activate(context: vscode.ExtensionContext): void {
    // ─── Output Channel ────────────────────────────────────
    const outputChannel = vscode.window.createOutputChannel('URUS');
    context.subscriptions.push(outputChannel);

    // ─── Diagnostics ───────────────────────────────────────
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('urus');
    context.subscriptions.push(diagnosticCollection);

    // ─── Status Bar ────────────────────────────────────────
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 100
    );
    statusBarItem.text = '$(symbol-misc) URUS';
    statusBarItem.tooltip = 'URUS Language';
    statusBarItem.command = 'urus.build';
    context.subscriptions.push(statusBarItem);

    // Show/hide status bar based on active editor
    function updateStatusBar(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'urus') {
            statusBarItem.show();
        } else {
            statusBarItem.hide();
        }
    }
    updateStatusBar();

    // Fetch compiler version for status bar
    getCompilerVersion().then(version => {
        if (version) {
            statusBarItem.text = `$(symbol-misc) URUS ${version}`;
            statusBarItem.tooltip = `URUS Compiler ${version}`;
        }
    });

    // ─── Commands ──────────────────────────────────────────
    registerCommands(context, outputChannel, statusBarItem);

    // ─── Providers ─────────────────────────────────────────

    // Hover
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(URUS_SELECTOR, new UrusHoverProvider())
    );

    // Completion
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            URUS_SELECTOR,
            new UrusCompletionProvider(),
            '.', ':'
        )
    );

    // Signature Help
    context.subscriptions.push(
        vscode.languages.registerSignatureHelpProvider(
            URUS_SELECTOR,
            new UrusSignatureHelpProvider(),
            { triggerCharacters: ['(', ','], retriggerCharacters: [','] }
        )
    );

    // Document Symbols
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            URUS_SELECTOR,
            new UrusDocumentSymbolProvider()
        )
    );

    // Semantic Tokens
    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            URUS_SELECTOR,
            new UrusSemanticTokensProvider(),
            SEMANTIC_LEGEND
        )
    );

    // ─── Event Listeners ───────────────────────────────────

    // Diagnostics on save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            if (document.languageId === 'urus' && isDiagnosticsOnSave()) {
                updateDiagnostics(document, diagnosticCollection);
            }
        })
    );

    // Diagnostics on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.languageId === 'urus' && isDiagnosticsOnSave()) {
                updateDiagnostics(document, diagnosticCollection);
            }
        })
    );

    // Clear diagnostics on close
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnosticCollection.delete(document.uri);
        })
    );

    // Status bar visibility
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => updateStatusBar())
    );

    // Config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('urus')) {
                invalidateCache();
            }
        })
    );

    // ─── Initial diagnostics for already-open files ────────
    for (const editor of vscode.window.visibleTextEditors) {
        if (editor.document.languageId === 'urus') {
            updateDiagnostics(editor.document, diagnosticCollection);
        }
    }

    outputChannel.appendLine('URUS Language extension activated.');
}

export function deactivate(): void {
    // Nothing to clean up — VS Code disposes subscriptions automatically
}
