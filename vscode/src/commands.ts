import * as vscode from 'vscode';
import * as path from 'path';
import { runCompiler } from './compiler';

function getActiveUrusFile(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'urus') {
        vscode.window.showWarningMessage('No active .urus file.');
        return null;
    }
    return editor.document.uri.fsPath;
}

async function saveActive(): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.isDirty) {
        return editor.document.save();
    }
    return true;
}

export function registerCommands(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel,
    statusBarItem: vscode.StatusBarItem
): void {

    // ─── Build ─────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('urus.build', async () => {
            const filePath = getActiveUrusFile();
            if (!filePath) { return; }
            await saveActive();

            const baseName = path.basename(filePath, '.urus');
            const outName = process.platform === 'win32' ? `${baseName}.exe` : baseName;
            const outPath = path.join(path.dirname(filePath), outName);

            statusBarItem.text = '$(sync~spin) Building...';
            outputChannel.clear();
            outputChannel.show(true);
            outputChannel.appendLine(`Building: ${filePath}`);
            outputChannel.appendLine(`Output:   ${outPath}`);
            outputChannel.appendLine('');

            const result = await runCompiler(filePath, ['-o', outPath]);

            if (result.stdout) { outputChannel.appendLine(result.stdout); }
            if (result.stderr) { outputChannel.appendLine(result.stderr); }

            if (result.exitCode === 0) {
                outputChannel.appendLine('Build successful.');
                statusBarItem.text = '$(check) Build OK';
                vscode.window.showInformationMessage(`Build successful: ${outName}`);
            } else {
                outputChannel.appendLine(`Build failed (exit code ${result.exitCode}).`);
                statusBarItem.text = '$(error) Build Failed';
                vscode.window.showErrorMessage('Build failed. See Output panel for details.');
            }

            setTimeout(() => {
                statusBarItem.text = '$(symbol-misc) URUS';
            }, 5000);
        })
    );

    // ─── Build and Run ─────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('urus.run', async () => {
            const filePath = getActiveUrusFile();
            if (!filePath) { return; }
            await saveActive();

            const baseName = path.basename(filePath, '.urus');
            const outName = process.platform === 'win32' ? `${baseName}.exe` : baseName;
            const outPath = path.join(path.dirname(filePath), outName);

            statusBarItem.text = '$(sync~spin) Building...';
            outputChannel.clear();
            outputChannel.appendLine(`Building and running: ${filePath}`);

            const result = await runCompiler(filePath, ['-o', outPath]);

            if (result.exitCode !== 0) {
                outputChannel.show(true);
                if (result.stderr) { outputChannel.appendLine(result.stderr); }
                outputChannel.appendLine(`Build failed (exit code ${result.exitCode}).`);
                statusBarItem.text = '$(error) Build Failed';
                vscode.window.showErrorMessage('Build failed. See Output panel.');
                setTimeout(() => { statusBarItem.text = '$(symbol-misc) URUS'; }, 5000);
                return;
            }

            statusBarItem.text = '$(play) Running...';

            // Run in terminal
            const runPath = process.platform === 'win32' ? `"${outPath}"` : `./${outName}`;
            const terminal = vscode.window.createTerminal({
                name: `URUS: ${baseName}`,
                cwd: path.dirname(filePath),
            });
            terminal.show();
            terminal.sendText(runPath);

            setTimeout(() => { statusBarItem.text = '$(symbol-misc) URUS'; }, 3000);
        })
    );

    // ─── Emit C ────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('urus.emitC', async () => {
            const filePath = getActiveUrusFile();
            if (!filePath) { return; }
            await saveActive();

            const result = await runCompiler(filePath, ['--emit-c']);

            if (result.exitCode !== 0 && result.stderr) {
                vscode.window.showErrorMessage(`Compiler error: ${result.stderr.split('\n')[0]}`);
                return;
            }

            const doc = await vscode.workspace.openTextDocument({
                content: result.stdout,
                language: 'c',
            });
            await vscode.window.showTextDocument(doc, { preview: true });
        })
    );

    // ─── Show Tokens ───────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('urus.showTokens', async () => {
            const filePath = getActiveUrusFile();
            if (!filePath) { return; }
            await saveActive();

            const result = await runCompiler(filePath, ['--tokens']);
            const content = result.stdout || result.stderr || '(no output)';

            const doc = await vscode.workspace.openTextDocument({
                content: content,
                language: 'plaintext',
            });
            await vscode.window.showTextDocument(doc, { preview: true });
        })
    );

    // ─── Show AST ──────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('urus.showAST', async () => {
            const filePath = getActiveUrusFile();
            if (!filePath) { return; }
            await saveActive();

            const result = await runCompiler(filePath, ['--ast']);
            const content = result.stdout || result.stderr || '(no output)';

            const doc = await vscode.workspace.openTextDocument({
                content: content,
                language: 'plaintext',
            });
            await vscode.window.showTextDocument(doc, { preview: true });
        })
    );
}
