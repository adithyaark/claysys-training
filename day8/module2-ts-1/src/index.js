// Explicit type annotations for all variables
var currentVal = '0';
var previousVal = '';
var activeOperator = null;
// Type casting to ensure the element exists and is the correct type
var display = document.getElementById('display');
/**
 * Updates the display screen
 */
function updateUI() {
    if (display) {
        display.innerText = currentVal;
    }
}
/**
 * Handles digit input
 */
function handleInput(num) {
    if (currentVal === '0') {
        currentVal = num;
    }
    else {
        currentVal += num;
    }
    updateUI();
}
/**
 * Sets the operator
 */
function handleOperator(op) {
    activeOperator = op;
    previousVal = currentVal;
    currentVal = '0';
}
/**
 * Resets the calculator state
 */
function handleClear() {
    currentVal = '0';
    previousVal = '';
    activeOperator = null;
    updateUI();
}
/**
 * Performs calculations with edge case handling
 */
function handleCalculate() {
    var p = parseFloat(previousVal);
    var c = parseFloat(currentVal);
    var result = 0;
    // Type checking ensures we don't calculate with invalid data
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
            // Graceful handling of division by zero
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
// Expose functions to the window object so HTML attributes can find them
window.handleInput = handleInput;
window.handleOperator = handleOperator;
window.handleClear = handleClear;
window.handleCalculate = handleCalculate;
