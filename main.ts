// ax^2 + bx + c
interface Expanded {
    a: number;
    b: number;
    c: number;
}

// 二次の代数的数
// (a + (i)b√c) / d
interface Solution {
    a: number;
    b: number;
    i: boolean;
    c: number;
    d: number;
}

// a(x - b)(x - c)
interface Fractrized {
    a: number;
    b: Solution;
    c: Solution;
}

function calc(solution: Solution): Solution {
    console.log(solution);
    let a = solution.a;
    let b = solution.b;
    let i = solution.i
    let c = solution.c;
    let d = solution.d;

    //√内を正数にする
    if (c < 0) {
        c = -c;
        i = !i;
    }

    //ルートの中を簡約
    for (let j = 2; j <= c; j++) {
        if (c % (j * j) === 0) {
            c = c / (j * j);
            b = b * j;
            j = 1;
        }
    }
    //有理数になったら簡約
    if (c === 1) {
        a = a + b;
        c = 0;
        b = 0;
    }
    //約分
    for (let j = 2; j <= d; j++) {
        if(d % j === 0 && a % j === 0 && b % j === 0) {
            a = a / j;
            b = b / j;
            d = d / j;
            j = 1;
        }
    }

    return {a, b, i, c, d};
}

function fractrize(expanded: Expanded): Fractrized {
    return {
        a: expanded.a,
        b: calc({
            a : -expanded.b,
            i: false,
            b : 1,
            c : expanded.b * expanded.b - 4 * expanded.a * expanded.c,
            d : 2 * expanded.a,
        }),
        c: calc({
            a : -expanded.b,
            i: false,
            b : -1,
            c : expanded.b * expanded.b - 4 * expanded.a * expanded.c,
            d : 2 * expanded.a,
        }),
    }
} 

function generate1(): Expanded {
    let p = (Math.floor(Math.random() * 10) - 5);
    let q = (Math.floor(Math.random() * 10) - 5);
    console.log([p, q]);
    return {
        a: 1,
        b: -(p + q),
        c: p * q
    }
}

function showExpanded(expanded: Expanded): string {
    let x: string[] = [];
    if (expanded.a !== 0) x.push(expanded.a + "x^2");
    if (expanded.b !== 0) x.push(expanded.b + "x");
    if (expanded.c !== 0) x.push(expanded.c + "");
    return x.join(" + ");
}

function showSolution(solution: Solution): string {
    let x: string = solution.a + "";
    if(solution.c !== 0) x = x + " + " + (solution.i ? "i" : "") + solution.b + "\\sqrt{" + solution.c + "}";
    if(solution.d !== 1) x = "{" + x + "\\over" + solution.d + "}";
    return x;
}