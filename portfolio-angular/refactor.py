import re
import os

path = 'src/app/components/mini-game/mini-game.ts'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the inner loop of generateBoard
inner_loop = r'''      let placed = false;

      for (let tries = 0; tries < 180 && !placed; tries\+\+) \{
        const dir = DIRECTIONS\[Math.floor\(Math.random\(\) \* DIRECTIONS.length\)\];
        const row = Math.floor\(Math.random\(\) \* SIZE\);
        const col = Math.floor\(Math.random\(\) \* SIZE\);

        if \(this.canPlaceWord\(board, word, row, col, dir\)\) \{
          this.placeWord\(board, word, row, col, dir\);
          placed = true;
        \}
      \}

      if \(\!placed\) \{
        for \(let r = 0; r < SIZE && \!placed; r\+\+\) \{
          for \(let c = 0; c <= SIZE - word.length && \!placed; c\+\+\) \{
            if \(this.canPlaceWord\(board, word, r, c, \{ r: 0, c: 1 \}\)\) \{
              this.placeWord\(board, word, r, c, \{ r: 0, c: 1 \}\);
              placed = true;
            \}
          \}
        \}
      \}'''

replacement_loop = '      this.tryPlaceWord(board, word);'
code = re.sub(inner_loop, replacement_loop, code, count=1)

# Add the tryPlaceWord method
new_method = '''  }

  private tryPlaceWord(board: string[][], word: string): void {
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

  private canPlaceWord'''

code = code.replace('  }\n\n  private canPlaceWord', new_method, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
