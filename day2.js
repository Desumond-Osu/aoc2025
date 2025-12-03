const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/[\n,]+/).map(i => i.split('-').map(Number));

let [p1, p2] = [0,0];
file.forEach(row => {
  for (var i = row[0]; i <= row[1]; i++) {
    //p1
    const numLength = i.toString().length;
    const midpoint = (numLength / 2);
    
    if (Math.floor(i / Math.pow(10, midpoint)) == i % Math.pow(10, midpoint)) {
      p1 += i;
    }

    //p2
    let done = 0;
    const factors = [...Array(numLength + 1).keys()].filter(i => numLength % i === 0);

    factors.forEach(factor => {
      let num = i;
      let numLengthCopy = numLength;
      if (factor == numLengthCopy || done == 1) {
        return;
      }

      let first = -1;
      while (numLengthCopy > 0) {
        if (num.toString().length != numLengthCopy) {
          break;
        }

        const section = numLengthCopy - factor;

        if (first === -1) {
          first = Math.floor(num / Math.pow(10, section));
          num %= Math.pow(10, section);
          numLengthCopy -= first.toString().length;
          continue;
        }

        if (numLengthCopy == first.toString().length) {
          if (num != first) {
            break;
          }

          p2 += i;
          done = 1;
          break;
        }

        if (first == Math.floor(num / Math.pow(10, section))) {
          num %= Math.pow(10, section);
          numLengthCopy -= factor;
          continue;
        }

        break;
      }
    })
  }
})

console.log(p1);
console.log(p2);