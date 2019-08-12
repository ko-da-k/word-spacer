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
			'extension.insertSpaceAll', () => {
				insertSpaceAll();
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'extension.insertSpaceCurrent', () => {
				insertSpaceCurrent();
			}
		)
	);
}

const insertSpaceAll = () => {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		return
	}
	const lineCnt = editor.document.lineCount
	editor.edit((editBuilder: vscode.TextEditorEdit) => {
		for (let lineIdx = 0; lineIdx < lineCnt; lineIdx++) {
			let lineText = editor.document.lineAt(lineIdx)
			for (let colIdx = 0; colIdx < lineText.text.length - 1; colIdx++) {
				if (needSpace(lineText.text[colIdx], lineText.text[colIdx + 1])) {
					// Insert space to the next character.
					editBuilder.insert(new vscode.Position(lineIdx, colIdx + 1), " ");
				}
			}
		}
	})
}

const insertSpaceCurrent = () => {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		return
	}
	const selections = editor.selections
	editor.edit((editBuilder: vscode.TextEditorEdit) => {
		for (let selIdx = 0; selIdx < selections.length; selIdx++) {
			let selection = selections[selIdx]
			for (let lineIdx = selection.start.line; lineIdx < selection.end.line + 1; lineIdx++) {
				// TODO make module
				let lineText = editor.document.lineAt(lineIdx)
				for (let colIdx = 0; colIdx < lineText.text.length - 1; colIdx++) {
					if (needSpace(lineText.text[colIdx], lineText.text[colIdx + 1])) {
						// Insert space to the next character.
						editBuilder.insert(new vscode.Position(lineIdx, colIdx + 1), " ");
					}
				}
			}
		}
	})
}


const isJapanese = (str: string): boolean => {
	return ( str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]/) ) ? true : false
};

const isEnglish = (str: string): boolean => {
	return ( str.match(/[A-Za-z0-9]/) ) ? true : false
};

const isJapaneseEnglishPair = (first: string, second: string): boolean => {
	const japEng = isJapanese(first) && isEnglish(second)
	const engJap = isEnglish(first) && isJapanese(second)
	return japEng || engJap
};

const isLeftParentheses = (str: string): boolean => {
	return ( str.match(/[(\[\{]/) ) ? true : false
};

const isRightParentheses = (str: string): boolean => {
	return ( str.match(/[)\]\}]/) ) ? true : false
};

const hasNoSpaceBeforeLeftParentheses = (first: string, second: string): boolean => {
	const isFirstWord = isJapanese(first) || isEnglish(first) // english or japanese
	const isSecondLeftParentheses = isLeftParentheses(second)
	return isFirstWord && isSecondLeftParentheses
};

const hasNoSpaceAfterRightParentheses = (first: string, second: string): boolean => {
	const isFirstRightParentheses = isRightParentheses(first)
	const isSecondWord = isJapanese(second) || isEnglish(second) // english or japanese
	return isFirstRightParentheses && isSecondWord
};


const needSpace = (first: string, second: string): boolean => {
	const isJapEngPair = isJapaneseEnglishPair(first, second)
	const hasNoSpaceLeft = hasNoSpaceBeforeLeftParentheses(first, second)
	const hasNoSpaceRight = hasNoSpaceAfterRightParentheses(first, second)
	return isJapEngPair || hasNoSpaceLeft || hasNoSpaceRight
}

// this method is called when your extension is deactivated
export function deactivate() { }
