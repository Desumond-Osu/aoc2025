const fs = require('node:fs');
const file = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).map(i => i.split(',').map(Number));

//p1
const areaList = {};

for (let i = 0; i < file.length; i++) {
  for (let j = i + 1; j < file.length; j++) {
    const [a, b] = [file[i], file[j]];
    const area = (Math.abs(b[0] - a[0]) + 1) * (Math.abs(b[1] - a[1]) + 1);
    areaList[area] = [a, b];
  }
}

const sortedAreaList = Object.fromEntries(Object.entries(areaList).sort(([a], [b]) => a - b));

console.log(Object.keys(sortedAreaList).pop());

//p2
// Group points by x and y coordinates
const byX = {};
const byY = {};

for (const [x, y] of file) {
  if (!byX[x]) byX[x] = [];
  if (!byY[y]) byY[y] = [];
  byX[x].push(y);
  byY[y].push(x);
}

// Create horizontal and vertical segments (same x, pair up y values) (same y, pair up x values)
const pairSegments = (groups, isX) => {
  const segs = [];
  for (const k in groups) {
    const vals = groups[k].sort((a, b) => a - b);
    for (let i = 0; i < vals.length; i += 2) {
      if (vals[i + 1] === undefined) break;
      const a = isX ? [k, vals[i]]     : [vals[i], k];
      const b = isX ? [k, vals[i + 1]] : [vals[i + 1], k];
      segs.push([a, b]);
    }
  }
  return segs;
};

const [hSegs, vSegs] = [pairSegments(byX, true), pairSegments(byY, false)];
let maxArea = 0;

for (let i = 0; i < file.length; i++) {
  for (let j = 0; j < i; j++) {
    const [[ax, ay], [bx, by]] = [file[i], file[j]];
    const [[minX, maxX], [minY, maxY]] = [[Math.min(ax, bx), Math.max(ax, bx)], [Math.min(ay, by), Math.max(ay, by)]];

    let works = true;

    // Horizontal check
    for (const [[hx, y0], [_, y1]] of hSegs) {
      if (hx > minX && hx < maxX && !(Math.max(y0, y1) <= minY || Math.min(y0, y1) >= maxY)) {
        works = false;
        break;
      }
    }

    // Vertical check
    if (works) {
      for (const [[x0, vy], [x1, _]] of vSegs) {
        if (vy > minY && vy < maxY && !(Math.max(x0, x1) <= minX || Math.min(x0, x1) >= maxX)) {
          works = false;
          break;
        }
      }
    }

    if (works) {
      const area = (maxX - minX + 1) * (maxY - minY + 1);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
}

console.log(maxArea);