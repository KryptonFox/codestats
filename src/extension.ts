import * as vscode from "vscode";

let codeStatsStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "codestats" is activated!');

  let state = new CodeStatsState();

  codeStatsStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  codeStatsStatusBarItem.text = "CodeStats";
  codeStatsStatusBarItem.command = "codestatsStats.focus";

  let statsListProvider = new StatsListProvider();
  statsListProvider.setItemsFromState(state);
  vscode.window.registerTreeDataProvider("codestatsStats", statsListProvider);

  vscode.window.onDidChangeActiveTextEditor((e) => {
    state.clicks = state.currentClicks;
    state.initialLength = e?.document.getText().length ?? 0;

    state.lines = state.currentLines;
    state.initialLines = e?.document.lineCount ?? 0;
  });

  vscode.workspace.onDidChangeTextDocument((e) => {
    state.currentClicks =
      state.clicks +
      Math.max(0, e.document.getText().length - state.initialLength);

    state.currentLines =
      state.lines + Math.max(0, e.document.lineCount - state.initialLines);

    codeStatsStatusBarItem.text = `${
      state.currentClicks % 2 === 0 ? "◉" : "○"
    } ${state.currentLines}L ${state.currentClicks}C`;
    codeStatsStatusBarItem.tooltip = `CodeStats: [[ ${state.currentLines} lines and ${state.currentClicks} clicks! ]]`;
    codeStatsStatusBarItem.show();

    statsListProvider.setItemsFromState(state);
  });

  context.subscriptions.push(codeStatsStatusBarItem);

  codeStatsStatusBarItem.show();
}

export function deactivate() {}

class StatsListProvider implements vscode.TreeDataProvider<Item> {
  private _onDidChangeTreeData: vscode.EventEmitter<Item | undefined | void> =
    new vscode.EventEmitter();
  readonly onDidChangeTreeData: vscode.Event<Item | undefined | void> =
    this._onDidChangeTreeData.event;

  private items: Item[] = [];

  setItemsFromState(state: CodeStatsState) {
    this.items = [];
    const date = new Date(Date.now() - state.sessionStart);

    this.addItem(
      `Time of coding: ${
        date.getHours() - 3
      } ч. ${date.getMinutes()} мин. ${date.getSeconds()} с.`
    );
    this.addItem(`Clicks: ${state.currentClicks}`);
    this.addItem(`Lines: ${state.currentLines}`);
    this.addItem(`LPM: ${state.currentLines / (date.getTime() / 1000 / 60)}`);
    this.addItem(`CPM: ${state.currentClicks / (date.getTime() / 1000 / 60)}`);
  }

  addItem(item: string) {
    this.items.push(new Item(item));
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Item): vscode.TreeItem {
    return new vscode.TreeItem(
      element.label,
      vscode.TreeItemCollapsibleState.None
    );
  }
  getChildren(element?: Item): Item[] {
    return this.items;
  }
}

class Item {
  constructor(public readonly label: string) {}
}

class CodeStatsState {
  sessionStart: number = Date.now();

  clicks: number = 0;
  currentClicks: number = 0;
  initialLength: number = 0;

  lines: number = 0;
  initialLines: number = 0;
  currentLines: number = 0;
}
