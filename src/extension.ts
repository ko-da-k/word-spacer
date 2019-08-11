// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "word-spacer" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'extension.insertSpace', () => {
				insertSpace();
			}
		)
	);
}

const insertSpace = () => {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		return
	}
	const lineCnt = editor.document.lineCount
	editor.edit((editBuilder: vscode.TextEditorEdit) => {
		for (let lineIdx = 0; lineIdx < lineCnt; lineIdx++) {
			let lineText = editor.document.lineAt(i)
			for (let colIdx = 0; colIdx < lineText.text.length - 1; colIdx++) {
				if (isJapaneseEnglishPair(lineText.text[colIdx], lineText.text[colIdx + 1])) {
					// Insert space to the next character.
					editBuilder.insert(new vscode.Position(lineIdx, colIdx + 1), " ");
				}
			}
		}
	})
}


const isJapanese = (str: string): boolean => {
	return (str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]/)) ? true : false
};

const isEnglish = (str: string): boolean => {
	return (str.match(/[A-Za-z0-9]/)) ? true : false
};

const isJapaneseEnglishPair = (first: string, second: string): boolean => {
	const japEng = isJapanese(first) && isEnglish(second)
	const engJap = isEnglish(first) && isJapanese(second)
	return japEng || engJap
}

// this method is called when your extension is deactivated
export function deactivate() { }
