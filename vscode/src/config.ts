import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

let cachedPath: string | null = null;

function findInPath(name: string): string | null {
    try {
        const cmd = process.platform === 'win32' ? `where ${name}` : `which ${name}`;
        const result = execSync(cmd, { encoding: 'utf-8', timeout: 5000 }).trim();
        // 'where' on Windows can return multiple lines
        return result.split(/\r?\n/)[0] || null;
    } catch {
        return null;
    }
}

export function getCompilerPath(): string {
    const config = vscode.workspace.getConfiguration('urus');
    const configured = config.get<string>('compilerPath', 'urusc');

    // Absolute path — use directly
    if (path.isAbsolute(configured)) {
        if (fs.existsSync(configured)) {
            return configured;
        }
        // Try with .exe on Windows
        if (process.platform === 'win32' && !configured.endsWith('.exe')) {
            const withExe = configured + '.exe';
            if (fs.existsSync(withExe)) {
                return withExe;
            }
        }
    }

    // Cached result
    if (cachedPath) {
        return cachedPath;
    }

    // Search PATH
    const found = findInPath(configured);
    if (found) {
        cachedPath = found;
        return found;
    }

    // Return as-is and let the caller handle the error
    return configured;
}

export function getBuildArgs(): string[] {
    const config = vscode.workspace.getConfiguration('urus');
    return config.get<string[]>('buildArgs', []);
}

export function isDiagnosticsEnabled(): boolean {
    const config = vscode.workspace.getConfiguration('urus');
    return config.get<boolean>('diagnostics.enable', true);
}

export function isDiagnosticsOnSave(): boolean {
    const config = vscode.workspace.getConfiguration('urus');
    return config.get<boolean>('diagnostics.onSave', true);
}

export function invalidateCache(): void {
    cachedPath = null;
}
