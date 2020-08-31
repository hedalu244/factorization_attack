// ax^2 + bx + c
interface Expanded {
    a: number;
    b: number;
    c: number;
}

// 二次の代数的数
// (a + b√c) / d
interface Solution {
    a: number;
    b: number;
    c: number;
    d: number;
}

// a(x - b)(x - c)
interface Factrized {
    a: number;
    b: Solution;
    c: Solution;
}

function calc(solution: Solution): Solution {
    console.log(solution);
    let a = solution.a;
    let b = solution.b;
    let c = solution.c;
    let d = solution.d;

    //√内を正数にする
    if (c < 0) {
        throw new Error();
    }

    //ルートの中を簡約
    for (let j = 2; j <= c; j++) {
        if (c % (j * j) == 0) {
            c = c / (j * j);
            b = b * j;
            j = 1;
        }
    }
    //有理数になったら簡約
    if (c == 1) {
        a = a + b;
        c = 0;
        b = 0;
    }
    if (c == 0) {
        b = 0;
    }

    //約分
    if(d < 0) {
        d *= -1;
        a *= -1;
        b *= -1;
    }
    for (let j = 2; j <= d; j++) {
        if(d % j == 0 && a % j == 0 && b % j == 0) {
            a = a / j;
            b = b / j;
            d = d / j;
            j = 1;
        }
    }

    //符号を分母につける
    if (a < 0 || a == 0 && b < 0) {
        d *= -1;
        a *= -1;
        b *= -1;
    }
    return {a, b, c, d};
}

function factrize(expanded: Expanded): Factrized {
    return {
        a: expanded.a,
        b: calc({
            a : -expanded.b,
            b : 1,
            c : expanded.b * expanded.b - 4 * expanded.a * expanded.c,
            d : 2 * expanded.a,
        }),
        c: calc({
            a : -expanded.b,
            b : -1,
            c : expanded.b * expanded.b - 4 * expanded.a * expanded.c,
            d : 2 * expanded.a,
        }),
    }
} 

function generate(): Expanded{
    return [g1(), g2(), g3()][Math.floor(Math.random() * 3)];

    function g1(): Expanded {
        let p = (Math.floor(Math.random() * 10) - 5);
        let q = (Math.floor(Math.random() * 10) - 5);
        console.log([p, q]);
        return {
            a: 1,
            b: -(p + q),
            c: p * q
        }
    }
    function g2(): Expanded {
        let a = (Math.floor(Math.random() * 10) - 5);
        let b = (Math.floor(Math.random() * 10) - 5);
        let c = (Math.floor(Math.random() * 10) - 5);
        let d = (Math.floor(Math.random() * 10) - 5);
        if(a == 0 || b == 0) return g2();
        return {
            a: a * b,
            b: a * d + c * b,
            c: c * d,
        }
    }
    function g3(): Expanded {
        let a = (Math.floor(Math.random() * 10) - 5);
        let b = (Math.floor(Math.random() * 10) - 5);
        let c = (Math.floor(Math.random() * 10) - 5);
        if(a == 0 || b * b < 4 * a * c) return g3();
        return {
            a: a,
            b: b,
            c: c,
        }
    }
}

function showExpanded(expanded: Expanded): string {
    let x: string[] = [];
    if (expanded.a !== 0) x.push((expanded.a == 1 ? "" : expanded.a) + "x^2");
    if (expanded.b !== 0) x.push((expanded.b == 1 ? "" : expanded.b) + "x");
    if (expanded.c !== 0) x.push(expanded.c + "");
    return x.join("+").split("+-").join("-").split("1x").join("x");
}
function showSolution(solution: Solution): string {
    if(solution.a == 0 && solution.b == 0) return "0";
    let a = solution.a == 0 ? "" : solution.a;
    let b = solution.b == 0 ? "" : solution.b + "\\sqrt{" + solution.c + "}";
    let d = Math.abs(solution.d) == 1 ? "" : "\\over" + Math.abs(solution.d);
    let x = (solution.d < 0 ? "-" : "") + "{" + (a != "" && b != "" ? a + "+" + b : a + b) + d + "}";
    return x.split("+-").join("-").split("1\\sqrt").join("\\sqrt");
}
function showFactrized(factrized: Factrized): string {
    let x;
    if (showSolution(factrized.b) == showSolution(factrized.c))
        x = factrized.a + "(x-" + showSolution(factrized.b) + ")^2";
    else x = factrized.a + "(x-" + showSolution(factrized.b) + ")" + "(x-" + showSolution(factrized.c) + ")"
    return x.split("1(").join("(").split("(x-0)").join("x").split("--").join("+");
}

function rewrite(){
    MathJax.texReset();
    MathJax.typesetClear();
    MathJax.typesetPromise([output]).catch(function (err) {
      output.innerHTML = '';
      output.appendChild(document.createTextNode(err.message));
      console.error(err);
    }).then(function () {
    });
}

let expandeds: Expanded[];
function start() {
    expandeds = [generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate()];
    output.innerHTML = expandeds.map(x => "$$" + showExpanded(x) + "$$").join("<br>");
    rewrite();
}
function answer() {
    output.innerHTML = expandeds.map(x => "$$" + showExpanded(x) + "=" + showFactrized(factrize(x)) + "$$").join("<br>");
    rewrite();
}

  //
  //  Load MathJax
  //
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.setAttribute('id', 'MathJax-script');
  document.head.appendChild(script);
  
  let output: HTMLDivElement;
  let startButton: HTMLButtonElement;
  let answerButton: HTMLButtonElement;

  onload = () => {
      output = document.getElementById('output');
      startButton = document.getElementById("start");
      answerButton = document.getElementById("answer");

      startButton.onclick = start;
      answerButton.onclick = answer;
  }