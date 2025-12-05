const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).map(i => i.split(''));

[2, 12].forEach(batteryLength => {
  let total = 0;
  file.forEach(rating => {
    const batteries = {};
    for (let i = 0; i < batteryLength; i++) {
      const start = Object.keys(batteries).length > 0 ? Number(Object.keys(batteries).at(-1)) + 1 : 0;
      const end = rating.length - (batteryLength - Object.keys(batteries).length);
      const segment = rating.slice(start, end + 1);
      const largestNum = Math.max(...segment.map(Number));
      const largestSumIndex = start + segment.map(Number).indexOf(largestNum);
      batteries[largestSumIndex] = largestNum;
    }
    total += Number(Object.values(batteries).join(''));
  })
  console.log(total);
})