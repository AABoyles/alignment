/**
 * Copyright 2014 Preston Lee. All rights reserved.
 */

function addTraceData(s1, s2, trace) {
  var rows = trace.length - 1;
  var cols = trace[0].length - 1;

  var s1aligned = [];
  var s2aligned = [];

  var best, bestX, bestY, curX, curY;
  var strings = ["", ""];
  for (curX = 1, curY = 1; curX <= cols && curY <= rows; ) {
    best = -1;
    bestX = curX;
    bestY = curY;
    for (var y = curY; y <= rows; y++) {
      if (trace[y][0] == trace[0][curX] && trace[y][curX] > best) {
        best = trace[y][curX];
        bestX = curX;
        bestY = y;
      }
    }
    for (var x = curX; x <= cols; x++) {
      if (trace[curY][0] == trace[0][x] && trace[curY][x] > best) {
        best = trace[curY][x];
        bestX = x;
        bestY = curY;
      }
    }
    if (best >= 0) {
      trace[bestY][bestX] =
        '<span class="bg-danger"><b>&nbsp;' +
        trace[bestY][bestX] +
        "&nbsp;</b></span>";
      var diffX = bestX - curX;
      var diffY = bestY - curY;
      strings[0] += repeat("-", diffY);
      strings[1] += repeat("-", diffX);
      for (var i = 0; i < diffX && curX + i <= cols; i++) {
        strings[0] += trace[0][curX + i];
        // strings[1] += trace[curX + i][0];
      }
      for (var i = 0; i < diffY && curY + i <= rows; i++) {
        strings[1] += trace[curY + i][0];
        // strings[0] += trace[0][curY + i];
      }
      strings[0] += trace[0][bestX];
      strings[1] += trace[bestY][0];
    } else {
      strings[0] += "-";
      strings[1] += "-";
    }
    curX = bestX + 1;
    curY = bestY + 1;
    // if(curX > cols && curY <= rows) {
    // 	curX = cols;
    // }
    // if(curY > rows && curX <= cols) {
    // 	curY = rows;
    // }
  }
  // Add whatever crap is left over.
  for (var i = curX; i <= cols; i++) {
    strings[0] += trace[0][i];
    strings[1] += "-";
  }
  for (var i = curY; i <= rows; i++) {
    strings[1] += trace[i][0];
    strings[0] += "-";
  }
  return strings;
}

function generateScoredData(s1, s2, data) {
  var rows = data.length - 1;
  var cols = data[0].length - 1;
  var scored = createBaseMatrix(s1, s2);
  // Walk the entire table.
  var cur;
  var max;
  for (var y = rows; y > 0; y--) {
    for (var x = cols; x > 0; x--) {
      cur = data[y][x];
      max = -1;
      // Walk column sub-scores.
      for (var subY = y + 1; subY <= rows && x + 1 <= cols; subY++) {
        max = Math.max(max, scored[subY][x + 1]);
      }
      // Walk row sub-scores.
      for (var subX = x + 1; subX <= cols && y + 1 <= rows; subX++) {
        max = Math.max(max, scored[y + 1][subX]);
      }
      if (max >= 0) {
        scored[y][x] = cur + max;
      } else {
        // It's the bottom-most or right-most row, so just copy the source data row.
        scored[y][x] = data[y][x];
      }
    }
  }
  return scored;
}

function createBaseMatrix(s1, s2) {
  var data = [];
  data.push([""].concat(s1.split("")));
  for (var i = 0; i < s2.length; i++) {
    data.push([s2.charAt(i)]);
  }
  return data;
}

function generateMatrixData(s1, s2) {
  var columns = s1.length;
  var rows = s2.length;
  var data = createBaseMatrix(s1, s2);
  // data.push([''].concat(s1.split('')));
  for (var y = 0; y < rows; y++) {
    // data.push([]);
    // data[y + 1].push(s2.charAt(y));
    for (var x = 0; x < columns; x++) {
      if (s1.charAt(x) == s2.charAt(y)) {
        data[y + 1].push(1);
      } else {
        data[y + 1].push(0);
      }
    }
  }
  return data;
}

function repeat(s, n) {
  var a = [];
  while (a.length < n) {
    a.push(s);
  }
  return a.join("");
}
