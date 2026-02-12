"use strict";
// type annnotations
let currentVal = '0';
let previousVal = '';
let activeOperator = null;
// type casting
const display = document.getElementById('display');
function updateUI() {
    if (display) {
        display.innerText = currentVal;
    }
}
function handleInput(num) {
    if (currentVal === '0') {
        currentVal = num;
    }
    else {
        currentVal += num;
    }
    updateUI();
}
function handleOperator(op) {
    activeOperator = op;
    previousVal = currentVal;
    currentVal = '0';
}
function handleClear() {
    currentVal = '0';
    previousVal = '';
    activeOperator = null;
    updateUI();
}
function handleCalculate() {
    const p = parseFloat(previousVal);
    const c = parseFloat(currentVal);
    let result = 0;
    // type validation
    if (isNaN(p) || isNaN(c))
        return;
    switch (activeOperator) {
        case '+':
            result = p + c;
            break;
        case '-':
            result = p - c;
            break;
        case '*':
            result = p * c;
            break;
        case '/':
            // handling division error
            if (c === 0) {
                alert("Error: Division by zero");
                handleClear();
                return;
            }
            result = p / c;
            break;
        default:
            return;
    }
    currentVal = result.toString();
    activeOperator = null;
    updateUI();
}
// Expose functions to the window object - HTML attributes
window.handleInput = handleInput;
window.handleOperator = handleOperator;
window.handleClear = handleClear;
window.handleCalculate = handleCalculate;
