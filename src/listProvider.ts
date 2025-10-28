import * as vscode from "vscode";
import { CodeStatsState } from "./state";

export class StatsListProvider implements vscode.TreeDataProvider<Item> {
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
