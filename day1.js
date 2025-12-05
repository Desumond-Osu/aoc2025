const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).map(i => [i[0], Number(i.slice(1))]);

let pos = 50;
let [p1, p2] = [0, 0];
file.forEach(row => {
  let move = row[1] * (row[0] === 'L' ? -1 : 1);

  if (move > 0) {
    if (pos + move >= 100) {
      p2 += Math.floor((pos + move) / 100);
    } 
  } else if (pos !== 0) {
    if (pos + move <= 0) {
      p2 += Math.floor(Math.abs(pos + move) / 100) + 1;
    }
  } else if (move <= -100) {
    p2 += Math.floor(Math.abs(move) / 100);
  }

  pos += move;
  pos = ((pos % 100) + 100) % 100;

  if (pos % 100 === 0) {
    p1++;
  }
})

console.log(p1);
console.log(p2);