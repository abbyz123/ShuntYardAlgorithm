module.exports = {
    createOperatorLib : () => {return new Operator();}
}

function Operator() {
    this.operators = {
        "=" : {precedence : 0, type : "binary", associate : "left"},        // equal
        "+" : {precedence : 1, type : "binary", associate : "left"},        // plus
        "-" : {precedence : 1, type : "binary", associate : "left"},        // minus
        "*" : {precedence : 2, type : "binary", associate : "left"},        // multiply
        "/" : {precedence : 2, type : "binary", associate : "left"},        // devide
        "^" : {precedence : 3, type : "binary", associate : "left"},        // power
        "!" : {precedence : 4, type : "uninary", associate : "right"},      // factorial
        "$" : {precedence : -1, type: "uninary", associate : "left"},       // end of expression    
    };
    this.operCalc = {
        "+" : (a, b) => (a + b),
        "-" : (a, b) => (a - b),
        "*" : (a, b) => (a * b),
        "/" : (a, b) => (a / b),
        "^" : (a, b) => (Math.pow(a, b))
    };
}