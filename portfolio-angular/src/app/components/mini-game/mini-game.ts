import { Component, computed, signal } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

type Direction = { r: number; c: number };
type CellPos = { r: number; c: number };
type BoardCell = {
  letter: string;
  selected: boolean;
  found: boolean;
};

type WordItem = {
  word: string;
  found: boolean;
};

const SIZE = 10;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS: Direction[] = [
  { r: 0, c: 1 },
  { r: 0, c: -1 },
  { r: 1, c: 0 },
  { r: -1, c: 0 },
  { r: 1, c: 1 },
  { r: -1, c: -1 },
  { r: 1, c: -1 },
  { r: -1, c: 1 },
];

@Component({
  selector: 'app-mini-game',
  standalone: true,
  templateUrl: './mini-game.html',
  styleUrl: './mini-game.css',
})
export class MiniGame {
  private readonly sourceWords = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'RUST', 'KOTLIN', 'SWIFT'];

  board = signal<BoardCell[][]>([]);
  words = signal<WordItem[]>([]);
  message = signal('');

  private startCell: CellPos | null = null;

  foundCount = computed(() => this.words().filter((w) => w.found).length);
  totalCount = computed(() => this.words().length);
  isCompleted = computed(() => this.foundCount() === this.totalCount() && this.totalCount() > 0);

  constructor(public translation: TranslationService) {
    this.newGame();
  }

  newGame(): void {
    const generated = this.generateBoard();
    this.board.set(generated.board);
    this.words.set(generated.words.map((word) => ({ word, found: false })));
    this.message.set(this.translation.translate('game.ready'));
    this.startCell = null;
  }

  rowTrackBy(index: number): number {
    return index;
  }

  cellTrackBy(index: number): number {
    return index;
  }

  onCellClick(r: number, c: number): void {
    if (!this.startCell) {
      this.startCell = { r, c };
      this.message.set(this.translation.translate('game.pick_end'));
      this.highlightCells([{ r, c }]);
      return;
    }

    const end = { r, c };
    const path = this.getLinePath(this.startCell, end);
    if (path.length === 0) {
      this.clearSelection();
      this.message.set(this.translation.translate('game.invalid_line'));
      return;
    }

    const letters = path.map((p) => this.board()[p.r][p.c].letter).join('');
    const reversed = letters.split('').reverse().join('');
    const target = this.words().find((w) => !w.found && (w.word === letters || w.word === reversed));

    if (target) {
      this.markFound(path, target.word);
      this.message.set(this.translation.translate('game.word_found').replace('{word}', target.word));
      if (this.isCompleted()) {
        this.message.set(this.translation.translate('game.completed'));
      }
    } else {
      this.highlightCells(path);
      setTimeout(() => this.clearSelection(), 450);
      this.message.set(this.translation.translate('game.not_word'));
    }

    this.startCell = null;
  }

  clearSelection(): void {
    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    this.board.set(board);
    this.startCell = null;
  }

  private highlightCells(path: CellPos[]): void {
    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    for (const p of path) {
      board[p.r][p.c].selected = true;
    }
    this.board.set(board);
  }

  private markFound(path: CellPos[], word: string): void {
    const nextWords = this.words().map((w) => (w.word === word ? { ...w, found: true } : w));
    this.words.set(nextWords);

    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    for (const p of path) {
      board[p.r][p.c].found = true;
    }
    this.board.set(board);
  }

  private getLinePath(start: CellPos, end: CellPos): CellPos[] {
    const dr = end.r - start.r;
    const dc = end.c - start.c;

    const absR = Math.abs(dr);
    const absC = Math.abs(dc);

    if (!(dr === 0 || dc === 0 || absR === absC)) {
      return [];
    }

    const stepR = dr === 0 ? 0 : dr / absR;
    const stepC = dc === 0 ? 0 : dc / absC;
    const len = Math.max(absR, absC);

    const path: CellPos[] = [];
    for (let i = 0; i <= len; i++) {
      path.push({ r: start.r + stepR * i, c: start.c + stepC * i });
    }
    return path;
  }

  private generateBoard(): { board: BoardCell[][]; words: string[] } {
    const board: string[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => ''));
    const words = [...this.sourceWords].sort(() => Math.random() - 0.5);

    for (const word of words) {
      let placed = false;

      for (let tries = 0; tries < 180 && !placed; tries++) {
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const row = Math.floor(Math.random() * SIZE);
        const col = Math.floor(Math.random() * SIZE);

        if (this.canPlaceWord(board, word, row, col, dir)) {
          this.placeWord(board, word, row, col, dir);
          placed = true;
        }
      }

      if (!placed) {
        for (let r = 0; r < SIZE && !placed; r++) {
          for (let c = 0; c <= SIZE - word.length && !placed; c++) {
            if (this.canPlaceWord(board, word, r, c, { r: 0, c: 1 })) {
              this.placeWord(board, word, r, c, { r: 0, c: 1 });
              placed = true;
            }
          }
        }
      }
    }

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!board[r][c]) {
          board[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }
    }

    return {
      words,
      board: board.map((row) => row.map((letter) => ({ letter, selected: false, found: false }))),
    };
  }

  private tryPlaceWord(board: string[][], word: string): void {\n    let placed = false;\n\n    for (let tries = 0; tries < 180 && !placed; tries++) {\n      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];\n      const row = Math.floor(Math.random() * SIZE);\n      const col = Math.floor(Math.random() * SIZE);\n\n      if (this.canPlaceWord(board, word, row, col, dir)) {\n        this.placeWord(board, word, row, col, dir);\n        placed = true;\n      }\n    }\n\n    if (!placed) {\n      for (let r = 0; r < SIZE && !placed; r++) {\n        for (let c = 0; c <= SIZE - word.length && !placed; c++) {\n          if (this.canPlaceWord(board, word, r, c, { r: 0, c: 1 })) {\n            this.placeWord(board, word, r, c, { r: 0, c: 1 });\n            placed = true;\n          }\n        }\n      }\n    }\n  }\n\n  private canPlaceWord(board: string[][], word: string, row: number, col: number, dir: Direction): boolean {
    for (let i = 0; i < word.length; i++) {
      const rr = row + dir.r * i;
      const cc = col + dir.c * i;
      if (rr < 0 || rr >= SIZE || cc < 0 || cc >= SIZE) return false;
      const current = board[rr][cc];
      if (current && current !== word[i]) return false;
    }
    return true;
  }

  private placeWord(board: string[][], word: string, row: number, col: number, dir: Direction): void {
    for (let i = 0; i < word.length; i++) {
      const rr = row + dir.r * i;
      const cc = col + dir.c * i;
      board[rr][cc] = word[i];
    }
  }
}
