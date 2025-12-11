const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${ require('path').basename(__filename, '.js') }.txt`), 'utf8').split(/\r?\n/).map(l => [l.match(/\[([.#]+)\]/)[1], [...l.matchAll(/\(([^)]+)\)/g)].map(m => m[1].split(',').map(Number)), l.match(/\{([^}]+)\}/)[1].split(',').map(Number)]);

//p1 code kinda sucks
function getCombinations(arr, k) {
  const result = [];
  function backtrack(start, currCombination) {
    if (currCombination.length === k) {
      result.push([...currCombination]);
      return;
    }
    if (start === arr.length) {
      return;
    }

    currCombination.push(arr[start]);
    backtrack(start + 1, currCombination);
    currCombination.pop();
    backtrack(start + 1, currCombination);
  }

  backtrack(0, []);
  return result;
}

let totalP1 = 0;
file.forEach(([pattern, buttons, _]) => {
  outer: for (let buttonClicks = 1; buttonClicks <= buttons.length; buttonClicks++) {
    const combinations = getCombinations(buttons, buttonClicks);
    for (const currentGroup of combinations) {
      const oddOnly = [...new Set(currentGroup.flat().filter((v, _, a) => a.filter(x => x === v).length % 2 === 1).sort((a, b) => a - b))];
      if (oddOnly.reduce((s, i) => s = s.padEnd(i, '.') + '#', '').padEnd(pattern.length, '.') === pattern) {
        totalP1 += buttonClicks;
        break outer;
      }
    }
  }
})

console.log(totalP1);

//p2
//some gaussian bullshit that i referenced off the internet because i dont like this kind of puzzle
//yea definitely not 100% my own code
//takes about 6 seconds to run
let totalP2 = 0;
file.forEach(([_, buttons, voltages]) => {
  const M = voltages.length, N = buttons.length;

  // 1. Build & Solve RREF
  const mat = Array.from({length: M}, (_, r) => {
    const row = Array(N + 1).fill(0);
    row[N] = voltages[r];
    return row;
  });
  buttons.forEach((idxs, c) => idxs.forEach(r => mat[r][c] = 1));

  let pRow = 0;
  const pivots = [], free = [];
  for (let c = 0; c < N && pRow < M; c++) {
    let sem = -1;
    for (let r = pRow; r < M; r++) {
      if (Math.abs(mat[r][c]) > 1e-9) {
        sem = r; break;
      }
    }

    if (sem === -1) {
      free.push(c); continue;
    }

    [mat[pRow], mat[sem]] = [mat[sem], mat[pRow]];
    const val = mat[pRow][c];
    for (let j = c; j <= N; j++) {
      mat[pRow][j] /= val;
    }

    for (let r = 0; r < M; r++) if (r !== pRow) {
      const f = mat[r][c];
      for (let j = c; j <= N; j++) {
        mat[r][j] -= f * mat[pRow][j];
      }
    }
    pivots.push(c);
    pRow++;
  }
  for (let c = 0; c < N; c++) {
    if (!pivots.includes(c) && !free.includes(c)) {
      free.push(c);
    }
  }

  // 2. Pre-calculate dependencies: pivot[i] = base[i] - sum(coeff[i][j] * free[j])
  const deps = pivots.map((pCol, r) => ({
    pCol,
    base: mat[r][N],
    coeffs: free.map(fCol => mat[r][fCol])
  }));

  // 3. Backtrack
  let minSum = Infinity, best = null;
  (function solve(idx, currentFree) {
    if (idx === free.length) {
      let sum = 0, sol = Array(N).fill(0);
      // Set free vars
      for (let i = 0; i < free.length; i++) { 
        sol[free[i]] = currentFree[i]; sum += currentFree[i];
      }

      // Calculate pivots
      for (const {pCol, base, coeffs} of deps) {
        let val = base;
        for (let i = 0; i < free.length; i++) {
          val -= coeffs[i] * currentFree[i];
        }
        if (val < -1e-9 || Math.abs(val - Math.round(val)) > 1e-9) {
          return;
        }
        sol[pCol] = Math.round(val);
        sum += sol[pCol];
      }

      if (sum < minSum) {
        minSum = sum;
        best = sol;
      }

      return;
    }

    for (let v = 0; v <= 185; v++) { //increase limit for more accuracy
      currentFree[idx] = v;
      solve(idx + 1, currentFree);
    }
  })(0, Array(free.length).fill(0));

  totalP2 += best.reduce((a, b) => a + b);
})

console.log(totalP2);