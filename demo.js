let parser = require("./shuntYardAlgo.js");

// equation as a string
expr = "sqrt(a^2+b^2)";
sym = {a : 3, b : 4};

// create a new equation parser
try {
    exprParser = parser.createShuntYardAlgoParser(expr);
    rpnResult = exprParser.parse();
    console.log(rpnResult.toString());
    console.log(RPNTreelib.evalRPNNode(sym, rpnResult));
} catch (e) {
    console.log(e);
}