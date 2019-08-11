// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "word-spacer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'extension.helloWorld', () => {
				// The code you place here will be executed every time your command is executed

				// Display a message box to the user
				vscode.window.showInformationMessage('Hello World!');
			}
		)
	);

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
	// 拡張子チェック
	let fileTypes = editor.document.fileName.split(".")[-1];
	const suffixArray = [".md"]
	if (suffixArray.includes(fileTypes)) {
		vscode.window.showInformationMessage(`You cannot use WordSpacer extension at ${fileTypes} filetypes`);
		return
	}
	console.log("Not Implemented")
	let hoge = editor.document.getText()
	let lineCnt = editor.document.lineCount
	console.log(hoge)
	editor.edit((editBuilder: vscode.TextEditorEdit) => {
		for (let i = 0; i < lineCnt; i++) {
			let lineText = editor.document.lineAt(i)
			for (let j = 0; j < lineText.text.length - 1; j++) {
				if ((isJapanese(lineText.text[j]) && isEnglish(lineText.text[j + 1])) || (isEnglish(lineText.text[j]) && isJapanese(lineText.text[j + 1]))) {
					editBuilder.insert(new vscode.Position(i, j + 1), " ");
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

const getActiveLineText = (editor: vscode.TextEditor): string => editor.document.lineAt(editor.selection.active.line).text;

const test = (editor: vscode.TextEditor) =>
	edit(editor, (editBuilder: vscode.TextEditorEdit) => {
		editBuilder.insert(new vscode.Position(editor.selection.active.line, 999), "hogehoge")
	})

const insertSpaceJapEng = (editor: vscode.TextEditor) =>
	edit(editor, (editBuilder: vscode.TextEditorEdit) => {
		editBuilder
	})

const edit = (editor: vscode.TextEditor, editFunc: (editBuilder: vscode.TextEditorEdit) => void) => {
	editor.edit(editBuilder => {
		editFunc(editBuilder);
	});
}


// this method is called when your extension is deactivated
export function deactivate() { }
