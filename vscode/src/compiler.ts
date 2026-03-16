import { execFile } from 'child_process';
import { getCompilerPath, getBuildArgs } from './config';

export interface CompilerResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

// Strip ANSI escape codes from compiler output
function stripAnsi(text: string): string {
    // Matches: ESC[ ... m  (SGR sequences used by error.c)
    return text.replace(/\x1b\[[0-9;]*m/g, '');
}

export function runCompiler(filePath: string, args: string[], timeoutMs: number = 15000): Promise<CompilerResult> {
    return new Promise((resolve) => {
        const compilerPath = getCompilerPath();
        const extraArgs = getBuildArgs();
        const allArgs = [...extraArgs, ...args, filePath];

        const proc = execFile(compilerPath, allArgs, {
            timeout: timeoutMs,
            maxBuffer: 1024 * 1024, // 1MB
            windowsHide: true,
        }, (error, stdout, stderr) => {
            const exitCode = error && 'code' in error ? (error as any).code ?? 1 : (proc.exitCode ?? 0);
            resolve({
                stdout: stripAnsi(stdout || ''),
                stderr: stripAnsi(stderr || ''),
                exitCode: typeof exitCode === 'number' ? exitCode : 1,
            });
        });
    });
}

export async function getCompilerVersion(): Promise<string | null> {
    try {
        const result = await runCompiler('', ['--version'], 5000);
        const combined = result.stdout + result.stderr;
        // Format: "URUS Compiler, version X.Y.Z ..."
        const match = combined.match(/version\s+([^\s]+)/i);
        return match ? match[1] : combined.trim() || null;
    } catch {
        return null;
    }
}
