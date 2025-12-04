const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split('\n').map(i => i.split(''));

const [length, width] = [file.length, file[0].length];

let [total, prevTotal] = [0, -1];
let p1 = 0;
for (let cycle = 0; cycle < Infinity; cycle++) {
  if (prevTotal === total) {
    break;
  }
  prevTotal = total;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < width; j++) {
      if (file[i][j] !== '@') {
        continue;
      }

      let neighborCount = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) {
            continue;
          }
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < length && nj >= 0 && nj < width && file[ni][nj] === '@') {
            neighborCount++;
          }
        }
      }

      if (neighborCount >= 4) {
        continue;
      }

      total++;
      if (cycle !== 0) {
        file[i][j] = '.';
      }
    }
  }

  if (cycle === 0) {
    p1 = total;
  }
}

console.log(p1);
console.log(total - p1);