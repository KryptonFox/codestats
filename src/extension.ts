import * as vscode from "vscode";
import { CodeStatsState } from "./state";
import { handleChangeTextEditor, handleUpdateTextEditor } from "./handlers";
import { StatsListProvider } from "./listProvider";

let codeStatsStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "codestats" is activated!');

  let state = new CodeStatsState();

  codeStatsStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  codeStatsStatusBarItem.text = "<CodeStats/>";
  codeStatsStatusBarItem.command = "codestatsStats.focus";

  let statsListProvider = new StatsListProvider();
  statsListProvider.setItemsFromState(state);
  vscode.window.registerTreeDataProvider("codestatsStats", statsListProvider);

  vscode.window.onDidChangeActiveTextEditor((e) =>
    handleChangeTextEditor(e, state)
  );

  vscode.workspace.onDidChangeTextDocument((e) =>
    handleUpdateTextEditor(
      e.document,
      state,
      codeStatsStatusBarItem,
      statsListProvider
    )
  );

  context.subscriptions.push(codeStatsStatusBarItem);
  codeStatsStatusBarItem.show();
  handleChangeTextEditor(vscode.window.activeTextEditor, state);
}

export function deactivate() {}
