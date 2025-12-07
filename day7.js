const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/);

//p1
let splits = 0;
let lines = [file[0].indexOf('S')];

file.forEach((row) => {
    lines = [...row].map((val, j) => [j, val]).filter(([j]) => lines.includes(j)).flatMap(([j, val]) => val === "^" ? (splits++, [j-1, j+1]) : [j]);
})

console.log(splits);

//p2
let dividers = {};
file.reverse().forEach(row => {
    [...row].forEach((val, j) => {
        if (val === "^") {
            dividers[j] = (dividers[j - 1] ?? 1) + (dividers[j + 1] ?? 1);
        }
    })
})

console.log(Math.max(...Object.values(dividers)));