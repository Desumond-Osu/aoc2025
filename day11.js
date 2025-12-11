const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).reduce((a, b) => {
  const [key, value] = b.split(': ');
  a[key] = value.split(' ');
  return a;
}, {});

const memo = new Map();

function countPaths(node, touched, touchesNeeded) {
  const key = `${node},${touched}`;
  if (memo.has(key + touchesNeeded)) {
    return memo.get(key + touchesNeeded);
  }

  let count = 0;
  const current = file[node];

  for (const next of current) {
    if (next === 'out') {
      if (touched === touchesNeeded) {
        count++;
      }
    } else {
      const newTouched = touched + (['dac', 'fft'].includes(next) ? 1 : 0);
      count += countPaths(next, newTouched, touchesNeeded);
    }
  }

  memo.set(key + touchesNeeded, count);
  return count;
}

console.log(countPaths('you', 0, 0));
console.log(countPaths('svr', 0, 2));