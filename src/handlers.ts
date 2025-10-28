import * as vscode from "vscode";
import { CodeStatsState } from "./state";
import { StatsListProvider } from "./listProvider";

export function handleChangeTextEditor(
  editor: vscode.TextEditor | undefined,
  state: CodeStatsState
) {
  state.clicks = state.currentClicks;
  state.initialLength = editor?.document.getText().length ?? 0;

  state.lines = state.currentLines;
  state.initialLines = editor?.document.lineCount ?? 0;
}

export function handleUpdateTextEditor(
  document: vscode.TextDocument,
  state: CodeStatsState,
  statusBarItem: vscode.StatusBarItem,
  statsListProvider: StatsListProvider
) {
  state.currentClicks =
    state.clicks +
    Math.max(0, document.getText().length - state.initialLength);

  state.currentLines =
    state.lines + Math.max(0, document.lineCount - state.initialLines);

  statusBarItem.text = `${state.currentClicks % 2 === 0 ? "◉" : "○"} ${
    state.currentLines
  }L ${state.currentClicks}C`;
  statusBarItem.tooltip = `CodeStats: [[ ${state.currentLines} lines and ${state.currentClicks} clicks! ]]`;
  statusBarItem.show();

  statsListProvider.setItemsFromState(state);
}
