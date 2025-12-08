const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).map(i => i.split(',').map(Number));

const lengthList = {};

for (let i = 0; i < file.length; i++) {
  for (let j = i + 1; j < file.length; j++) {
    const [a, b] = [file[i], file[j]];
    const length = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2;
    lengthList[length] = [a, b];
  }
}

const sortedLengthList = Object.fromEntries(Object.entries(lengthList).sort(([a], [b]) => a - b));

const links = Object.values(sortedLengthList);
const toKey = n => JSON.stringify(n);
const parent = new Map();

const find = x => {
  if (parent.get(x) === x) return x;
  parent.set(x, find(parent.get(x)));
  return parent.get(x);
};

const union = (a, b) => {
  const pa = find(a);
  const pb = find(b);
  if (pa !== pb) parent.set(pb, pa);
};

let lineCount = 0;

for (const [a, b] of links) {
  const ka = toKey(a), kb = toKey(b);
  if (!parent.has(ka)) parent.set(ka, ka);
  if (!parent.has(kb)) parent.set(kb, kb);
  union(ka, kb);

  const groups = {};
  parent.forEach((_, k) => {
    const root = find(k);
    if (!groups[root]) groups[root] = [];
    groups[root].push(k);
  });

  const linkedNodes = Object.values(groups).map(g => g.length);

  //p1
  lineCount++;
  if (lineCount == 1000) {
    const uniqueLinkedNodes = [...new Set(linkedNodes)];
    const nodeValue = uniqueLinkedNodes.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b);
    console.log(nodeValue);
  }

  //p2
  if (linkedNodes.length == 1 && linkedNodes[0] == 1000) {
    console.log(a[0] * b[0]);
    break;
  }
}