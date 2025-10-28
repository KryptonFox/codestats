export class CodeStatsState {
  sessionStart: number = Date.now();

  clicks: number = 0;
  currentClicks: number = 0;
  initialLength: number = 0;

  lines: number = 0;
  initialLines: number = 0;
  currentLines: number = 0;
}
