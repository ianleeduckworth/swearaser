import * as vscode from 'vscode';
import { WordWithIndex } from '../types/diagnostics';
import { getBadWords } from '../utilities/badWords';

function createDiagnostics(
	document: vscode.TextDocument, 
	swearsDiagnostics: vscode.DiagnosticCollection,
	lineStart?: number | undefined,
	lineEnd?: number | undefined,
	): void {
	let diagnostics: vscode.Diagnostic[] = [];

	let lineIndex = 0;
	if (lineStart) {
		lineIndex = lineStart;
	}

	let endValue = document.lineCount;
	if (lineEnd) {
		endValue = lineEnd + 1;
	}

	for (lineIndex; lineIndex < endValue; lineIndex++) {
		const lineOfText = document.lineAt(lineIndex);
        const badWords = getBadWords(lineOfText);

        if (badWords.length > 0) {
            const foundDiagnostics = createDiagnosticsForLine(lineIndex, badWords);
            diagnostics = [...diagnostics, ...foundDiagnostics];
        }
	}

	swearsDiagnostics.set(document.uri, diagnostics);
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
		createDiagnostics(vscode.window.activeTextEditor.document, swearsDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				createDiagnostics(editor.document, swearsDiagnostics);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => {
			const { contentChanges, document } = e;
			for (let i = 0; i < contentChanges.length; i++) {
				const {start, end } = contentChanges[i].range;
				createDiagnostics(document, swearsDiagnostics, start.line, end.line);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => swearsDiagnostics.delete(doc.uri))
	);
}