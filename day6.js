const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/);
const worksheet = file.map(i => i.trim().split(/\s+/));
const operations = worksheet.pop();

//p1
const transposedWorksheet = worksheet[0].map((_, colIndex) => worksheet.map(row => row[colIndex]));
console.log(transposedWorksheet.reduce((acc, val, i) => acc + eval(val.join(operations[i])), 0));

//p2
file.pop();
let stack = [];
let opIndex = operations.length - 1;

for (let fileIndex = file[0].length - 1; fileIndex >= 0; fileIndex--) {
    const number = file.map(v => v[fileIndex]).join('').trim();
    !number ? (stack[stack.length - 1] = '+', opIndex--) : stack.push(number, operations[opIndex]);
}

console.log(eval(stack.slice(0, -1).join('')));