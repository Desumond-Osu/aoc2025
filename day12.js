const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n\r?\n/).map(i => i.split(/\r?\n/)).slice(6).flat().map(i => i.split(': '))

//thanks reddit
let total = 0;
file.forEach(rule => {
    const expectedArea = rule[0].split('x').reduce((a, b) => a * b) / 9;
    const area = rule[1].split(' ').map(Number).reduce((a, b) => a + b);
    if (expectedArea >= area) {
        total++;
    }
})

console.log(total);