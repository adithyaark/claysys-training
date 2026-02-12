// type for valid operators
type Operator = '+' | '-' | '*' | '/' | null;

// type annnotations
let currentVal: string = '0';
let previousVal: string = '';
let activeOperator: Operator = null;

// type casting
const display = document.getElementById('display') as HTMLDivElement | null;

function updateUI(): void {
    if (display) {
        display.innerText = currentVal;
    }
}

function handleInput(num: string): void {
    if (currentVal === '0') {
        currentVal = num;
    } else {
        currentVal += num;
    }
    updateUI();
}

function handleOperator(op: Operator): void {
    activeOperator = op;
    previousVal = currentVal;
    currentVal = '0';
}


function handleClear(): void {
    currentVal = '0';
    previousVal = '';
    activeOperator = null;
    updateUI();
}

function handleCalculate(): void {
    const p: number = parseFloat(previousVal);
    const c: number = parseFloat(currentVal);
    let result: number = 0;

    // type validation
    if (isNaN(p) || isNaN(c)) return;

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
(window as any).handleInput = handleInput;
(window as any).handleOperator = handleOperator;
(window as any).handleClear = handleClear;
(window as any).handleCalculate = handleCalculate;