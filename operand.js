module.exports = {
    createOperandLib: () => { return new Operand(); }
}


class Operand {
    constructor() {
        // current operand type, "number" or "symbol"
        // initialized as null
        this.currOperandType = null;
        this.numString = "";
        this.symString = "";
        // number parser
        this.numParser = {
            addDigit: (digit) => {
                this.numString += digit;
            },
            toNum: () => {
                return parseFloat(this.numString);
            },
            toString: () => {
                return this.numString;
            },
        };
        // symbol parser
        this.symParser = {
            symString: "",
            addSym: (sym) => {
                this.symString += sym;
            },
            toString: () => {
                return this.symString;
            }
        };
        // reset operand parser
        this.operandReset = () => {
            this.numString = "";
            this.symString = "";
            this.currOperandType = null;
        };
    }
    // parse operand
    parseOperand() {
        if (this.currOperandType === "number") { // operand is a number
            return this.numParser.toNum();
        }
        else if (this.currOperandType === "symbol") { // operand is a symbol
            return this.symParser.toString();
        }
        else {
            return null; // no operand is parsed
        }
    }
    // build operand from expression input
    buildOperand(x) {
        // regular expression for letter and number
        let lettersRegex = /^[A-Za-z]+$/; // regular expression for letters a-z and A-Z
        let numbersRegex = /^[0-9\.]+$/; // regular expression for numbers and "."

        if (null !== x.match(lettersRegex)) { // input x is a letter
            if (this.currOperandType === "number") { // if x conflicts with current number operand
                throw "conflicting operator input: numbers and symbols mixing together";
            }
            else {
                this.currOperandType = "symbol"; // update current operand type
                this.symParser.addSym(x); // add the letter to the current symbol
                return true; // return true to inform the success of building operand to upper level code
            }
        }
        if (null !== x.match(numbersRegex)) { // input x is a number
            if (this.currOperandType === "symbol") { // if x conflicts with current letter operand
                throw "conflicting operator input: numbers and symbols mixing together";
            }
            else {
                this.currOperandType = "number"; // update current operand type
                this.numParser.addDigit(x); // add the digit or "." to the current number
                return true; // return true to inform the success of building operand to upper level code
            }
        }
        return false; // not a operand, return false
    }
}
