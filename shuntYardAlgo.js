operand = require("./operand.js");          // load operand processing library
operator = require("./operator.js");        // load operator processing library
RPNTreelib = require("./RPNTree.js");       // load RPN tree library

class ShuntYardAlgoParser {
    constructor(expr) {
        this.stackLevel = 0;                    // operand stack level
        this.operandStack = [new Array()];      // operand 2D stack
        this.operatorStack = [new Array()];     // operator 2D stack
        this.expr = (expr + "$");               // expression
        this.currParse = null;                  // current parsing element
        this.currOperator = "";                 // current operator
    }
    parse() {
        let operandlib = operand.createOperandLib();
        let operatorlib = operator.createOperatorLib();
        // traverse the expression
        for (let i = 0; i < this.expr.length; i++) {
            let currChar = this.expr[i];

            // build number/symbol
            if (true === operandlib.buildOperand(currChar)) {
                continue;
            }

            // push parsed operand into current level of operand stack
            // Compare the current operator precedence with operator stack top
            // if current operator has higher precedence, directly push it into the operator stack
            // otherwise pop the current operator and build RPNTree node 
            if ((currChar in operatorlib.operators) || (")" === currChar) || ("$" === currChar)) {
                // create a node with the operand and push it into current level of operand stack
                let currOperand = operandlib.parseOperand();

                // create RPNTree node for the operand
                if (null !== currOperand) {
                    let operandNode = RPNTreelib.createRPNTreeNode(currOperand, operandlib.currOperandType, null, null);
                    this.operandStack[this.stackLevel].push(operandNode);
                }

                // Reset the operand parameters for next parse
                operandlib.operandReset();
            }

            // parse operator
            if (currChar in operatorlib.operators) {
                // update current operator
                this.currOperator = currChar;

                // keep pop operator out of stack until a lower precedence stack top
                this.popOperatorStack(operatorlib);

                // push the current operator into stack
                this.operatorStack[this.stackLevel].push(currChar);

            } else if (")" === currChar) {
                // keep pop operator out of stack until a lower precedence stack top
                this.popOperatorStack(operatorlib);

                if (0 < this.stackLevel) {
                    // pop out the combined paranthesis operand
                    let combParOperand = this.operandStack[this.stackLevel].pop();

                    // stack level decrease by 1, pop out current level operand stack
                    this.stackLevel -= 1;
                    this.operandStack.pop();
                    this.operatorStack.pop();

                    // check if the lower level operand stack top is a function
                    if (0 === this.operandStack[this.stackLevel].length) {
                        this.operandStack[this.stackLevel].push(combParOperand);
                    } else if ("function" === this.operandStack[this.stackLevel][this.operandStack[this.stackLevel].length - 1].type) {
                        this.operandStack[this.stackLevel][this.operandStack[this.stackLevel].length - 1].setRightChild(combParOperand);
                    } else {
                        this.operandStack[this.stackLevel].push(combParOperand);
                    }
                }
                else {
                    throw "imbalanced parenthesis";
                }
            } else if ("$" === currChar) {
                if (i < this.expr.length - 1) {
                    throw "$ occurs before the end of the expression";
                }

                // keep pop operator out of stack until a lower precedence stack top
                this.popOperatorStack(operatorlib);

            } else if ("(" === this.expr[i]) {
                // create a node with the operand and push it into current level of operand stack
                let currOperand = operandlib.parseOperand();

                // a operand is parsed then change it to a function if it is not a number
                if (null !== currOperand) {
                    if ("number" === operandlib.currOperandType) {
                        throw "number can not be a function name";
                    }
                    // turn the operand into a function 
                    let operandNode = RPNTreelib.createRPNTreeNode(currOperand, "function", null, null);
                    this.operandStack[this.stackLevel].push(operandNode);
                }

                // reset operand parser
                operandlib.operandReset();

                // increase the stack level by 1
                this.stackLevel += 1;
                this.operandStack.push(new Array());
                this.operatorStack.push(new Array());
            } else {
                throw "Unrecognized symbol/operator: " + this.expr[i];
            }
        }

        return this.operandStack[0][0];
    }

    popOperatorStack(operatorlib) {
        // parse the operator
        while ((0 < this.operatorStack[this.stackLevel].length) &&
            (operatorlib.operators[this.currOperator].precedence
                <= operatorlib.operators[this.operatorStack[this.stackLevel][this.operatorStack[this.stackLevel].length - 1]].precedence)) {

            // get the operator stack top
            let operatorStkTop = this.operatorStack[this.stackLevel][this.operatorStack[this.stackLevel].length - 1];

            // build combined RPN tree node with operator and operands
            if (operatorlib.operators[operatorStkTop].type === "binary") {
                // pop the left and right operands for the binary operator
                let rightOperand = this.operandStack[this.stackLevel].pop();
                if (undefined === rightOperand) {
                    throw "missing right operand for " + operatorStkTop;
                }
                let leftOperand = this.operandStack[this.stackLevel].pop();
                if (undefined === leftOperand) {
                    throw "missing left operand for " + operatorStkTop;
                }

                // combine the left and right operands with the operator stack top element
                let combOperand = RPNTreelib.createRPNTreeNode(this.operatorStack[this.stackLevel].pop(), "operator", leftOperand, rightOperand);

                // push the combined operand into the current level of operand stack
                this.operandStack[this.stackLevel].push(combOperand);
            }
            // operator stack top is an uninary operator
            else if (operatorlib.operators[operatorStkTop].type === "uninary") {
                // pop the operands for the uninary operator
                let operand = this.operandStack[this.stackLevel].pop();
                if (undefined === operand) {
                    throw "missing operand for " + operatorStkTop;
                }

                // combine operand and operator according association rule
                let combinedOperand;
                if (operatorlib.operators[operatorStkTop].associate === "left") {
                    combinedOperand = RPNTreelib.createRPNTreeNode(this.operatorStack[this.stackLevel].pop(), "operator", operand, null);
                }
                else if (operatorlib.operators[operatorStkTop].associate === "right") {
                    combinedOperand = RPNTreelib.createRPNTreeNode(this.operatorStack[this.stackLevel].pop(), "operator", null, operand);
                }
                else {
                    throw "unsupported association type " + operatorlib.operators[operatorStkTop].associate;
                }

                // push the combined operand into the current level of operand stack
                this.operandStack[this.stackLevel].push(combinedOperand);
            }
            // throw exception if the operator is not supported
            else {
                throw "unsupported operator type " + operatorlib.Operator[operatorStkTop].type + " for " + operatorStkTop;
            }
        }
    }
}

// Equation solver CLI
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'parser>'
});

// Start the CLI for equation input
rl.prompt();
rl.on('line', (line) => {
    // equation as a string
    expr = line.trim();

    // create a new equation parser
    try {
        exprParser = new ShuntYardAlgoParser(expr);
        rpnResult = exprParser.parse();
        console.log(rpnResult.toString());
    } catch (e) {
        console.log(e);
    }
    
    // next prompt
    rl.prompt();
}).on('close', () => {
    console.log('Program Exits');
    process.exit(0);
});

