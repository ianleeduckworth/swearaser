import * as vscode from 'vscode';
import { WordWithIndex } from '../types/diagnostics';
import { getBadWords } from '../utilities/badWords';

export function refreshDiagnostics(doc: vscode.TextDocument, swearsDiagnostics: vscode.DiagnosticCollection): void {
	let diagnostics: vscode.Diagnostic[] = [];

	for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
		const lineOfText = doc.lineAt(lineIndex);
        const badWords = getBadWords(lineOfText);

        if (badWords.length > 0) {
            const foundDiagnostics = createDiagnosticsForLine(lineIndex, badWords);
            diagnostics = [...diagnostics, ...foundDiagnostics];
        }
	}

	swearsDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnosticsForLine(lineIndex: number, badWords: WordWithIndex[]) {
    const diagnostics: vscode.Diagnostic[] = [];

    badWords.forEach(badWord => {
        const { indexInLine, word } = badWord;
        const range = new vscode.Range(lineIndex, indexInLine, lineIndex, indexInLine + word.length);
        const diagnostic = new vscode.Diagnostic(
            range, 
            `'${word}' is flagged as inappropriate.`, 
            vscode.DiagnosticSeverity.Information
        );
        diagnostic.code = 'inappropriate_word';
        diagnostics.push(diagnostic);
    });

    return diagnostics;
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, swearsDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, swearsDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, swearsDiagnostics);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, swearsDiagnostics))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => swearsDiagnostics.delete(doc.uri))
	);
}