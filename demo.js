let parser = require("./shuntYardAlgo.js");

// equation as a string
expr = "a ^ 2 + b ^ 2";
sym = {a : 3, b : 4, c : 3.4, y : 4, x : 5};

// create a new equation parser
try {
    exprParser = parser.createShuntYardAlgoParser(expr);
    rpnResult = exprParser.parse();
    console.log(rpnResult.toString());
    console.log(RPNTreelib.evalRPNNode(sym, rpnResult));
} catch (e) {
    console.log(e);
}