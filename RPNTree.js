// Exporting Methods
module.exports = {
    // factory function for RPN Tree Node
    // type can be: 1. operator, 2. number, 3, symbol, 4, function
    createRPNTreeNode : (value, type, leftChild=null, rightChild=null) => {
        return new RPNTreeNode(value, type, leftChild, rightChild);
    }
};

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
        } else {
            return node.value + "(" + this.toStringSub(node.leftChild) + "," + this.toStringSub(node.rightChild) + ")"
        }
    }
}