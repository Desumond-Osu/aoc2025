const fs = require('node:fs');
let [freshRanges, ingredients] = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n\r?\n/).map(i => i.split(/\r?\n/));
freshRanges = freshRanges.map(i => i.split('-').map(Number));
ingredients = ingredients.map(Number);

//p1
let total = 0;
for (const ingredient of ingredients) {
    for (const [start, end] of freshRanges) {
        if (start <= ingredient && ingredient <= end) {
            total++;
            break;
        }
    }
}

console.log(total);

//p2
freshRanges.sort((a, b) => a[0] - b[0]);

const filteredRanges = [];
let [curStart, curEnd] = freshRanges[0];

for (let i = 1; i < freshRanges.length; i++) {
    const [start, end] = freshRanges[i];

    if (start <= curEnd) {
        curEnd = Math.max(curEnd, end);
    } else {
        filteredRanges.push([curStart, curEnd]);
        [curStart, curEnd] = [start, end];
    }
}
filteredRanges.push([curStart, curEnd]);

console.log(filteredRanges.reduce((acc, [a, b]) => acc + (b - a + 1), 0));