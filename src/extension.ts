'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { subscribeToDocumentChanges } from './diagnostics/diagnostics';

export function activate(context: vscode.ExtensionContext) {

	const swearsDiagnostic = vscode.languages.createDiagnosticCollection("swears");
	context.subscriptions.push(swearsDiagnostic);

	subscribeToDocumentChanges(context, swearsDiagnostic);
}
