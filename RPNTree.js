let functionList = require("./function.js");
let operator = require("./operator.js");
operatorlib = operator.createOperatorLib();

// Exporting Methods
module.exports = {
    // factory function for RPN Tree Node
    // type can be: 1. operator, 2. number, 3, symbol, 4, function
    createRPNTreeNode : (value, type, leftChild=null, rightChild=null) => {
        return new RPNTreeNode(value, type, leftChild, rightChild);
    },

    evalRPNNode
};

function evalRPNNode(symList, node) {
    // console.log(node.value);
    if ("number" === node.type) {
        return parseFloat(node.value);
    } else if ("symbol" === node.type) {
        if (node.value in symList) {
            return symList[node.value];
        } else {
            throw node.value + " is not evaluated.";
        }
    } else if ("function" === node.type) {
        if (node.value in functionList) {
            return functionList[node.value](evalRPNNode(symList, node.rightChild));
        } else {
            throw node.value + " is not defined in function list";
        }
    } else if ("operator" === node.type) {
        if (node.value in operatorlib.operCalc) {
            return operatorlib.operCalc[node.value](evalRPNNode(symList, node.leftChild), evalRPNNode(symList, node.rightChild));
        } else {
            throw node.value + " is not defined in operator list";
        }
    } else {
        throw "undefined RPN node type";
    }
}

class RPNTreeNode {
    constructor(value, type, leftChild=null, rightChild=null) {
        this.value = value;
        this.type = type;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    setLeftChild(child) {
        this.leftChild = child;
    }
    setRightChild(child) {
        this.rightChild = child;
    }
    toString() {
        return this.toStringSub(this);
    }
    toStringSub(node) {
        if (null === node) {
            return "null"
        } else if (null === node.leftChild && null === node.rightChild) {
            return node.value;
        } else if ("function" === node.type) {
            return node.value + "(" + this.toStringSub(node.rightChild) + ")";
        } else {
            return node.value + "(" + this.toStringSub(node.leftChild) + "," + this.toStringSub(node.rightChild) + ")"
        }
    }
}