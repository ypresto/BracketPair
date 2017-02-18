import * as vscode from "vscode";
import DocumentDecorationManager from "./documentDecorationManager";

export function activate(context: vscode.ExtensionContext) {
    const documentDecorationManager = new DocumentDecorationManager();

    let activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

    function updateAllDocuments() {
        vscode.window.visibleTextEditors.forEach((editor) => {
            if (editor && isValidDocument(editor.document)) {
                documentDecorationManager.updateDecorations(editor.document);
            }
        });
    }

    vscode.workspace.onDidChangeConfiguration((event) => {
        documentDecorationManager.reset();
        updateAllDocuments();
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        activeEditor = editor;

        updateAllDocuments();
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument((event) => {
        if (activeEditor && event.document === activeEditor.document && isValidDocument(activeEditor.document)) {
            documentDecorationManager.onDidChangeTextDocument(activeEditor.document, event.contentChanges);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidCloseTextDocument((event) => {
        if (activeEditor) {
            documentDecorationManager.onDidCloseTextDocument(event);
        }

        updateAllDocuments();
    }, null, context.subscriptions);
}

function isValidDocument(document?: vscode.TextDocument): boolean {
    if (document === undefined) {
        return false;
    }

    return document.uri.scheme === "file" || document.uri.scheme === "untitled";
}

// tslint:disable-next-line:no-empty
export function deactivate() {
}
