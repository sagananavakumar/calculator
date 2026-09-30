// ----------------------------------
// Get display elements
// ----------------------------------

const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");


// ----------------------------------
// Calculator variables
// ----------------------------------

let currentNumber = "";
let previousNumber = "";
let operation = null;
let resetDisplay = false;


// ----------------------------------
// Number input
// ----------------------------------

function addNumber(number) {

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    // Prevent unnecessary leading zeros
    if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// ----------------------------------
// Select operation
// ----------------------------------

function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    // If an operation already exists,
    // calculate the previous operation first.
    if (previousNumber !== "" && currentNumber !== "") {
        calculate();
    }

    operation = selectedOperation;

    previousNumber = currentNumber;

    currentNumber = "";

    resetDisplay = false;

    previousDisplay.textContent =
        `${previousNumber} ${operation}`;
}


// ----------------------------------
// Calculate result
// ----------------------------------

function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {
        return;
    }

    const previous = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    let result;


    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "−":
            result = previous - current;
            break;

        case "×":
            result = previous * current;
            break;

        case "÷":

            if (current === 0) {
                currentDisplay.textContent = "Cannot divide";
                previousDisplay.textContent = "by zero";

                currentNumber = "";
                previousNumber = "";
                operation = null;

                return;
            }

            result = previous / current;
            break;

        case "%":
            result = previous % current;
            break;

        default:
            return;
    }


    // Avoid extremely long decimal answers
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;

    currentNumber = result.toString();

    previousNumber = "";

    operation = null;

    resetDisplay = true;

    previousDisplay.textContent = "";

    updateDisplay();
}


// ----------------------------------
// Clear calculator
// ----------------------------------

function clearCalculator() {

    currentNumber = "";

    previousNumber = "";

    operation = null;

    resetDisplay = false;

    previousDisplay.textContent = "";

    currentDisplay.textContent = "0";
}


// ----------------------------------
// Delete last number
// ----------------------------------

function deleteNumber() {

    if (currentNumber === "") {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


// ----------------------------------
// Update display
// ----------------------------------

function updateDisplay() {

    currentDisplay.textContent =
        currentNumber || "0";
}


// ----------------------------------
// Button functionality
// ----------------------------------

const buttons = document.querySelectorAll(".button");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;
        const selectedOperation = button.dataset.operation;
        const action = button.dataset.action;


        // Number button
        if (number !== undefined) {

            if (resetDisplay) {
                currentNumber = "";
                resetDisplay = false;
            }

            addNumber(number);
        }


        // Operation button
        if (selectedOperation !== undefined) {

            chooseOperation(selectedOperation);
        }


        // Clear button
        if (action === "clear") {

            clearCalculator();
        }


        // Delete button
        if (action === "delete") {

            deleteNumber();
        }


        // Equals button
        if (action === "equals") {

            calculate();
        }

    });

});


// ----------------------------------
// Keyboard support
// ----------------------------------

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers and decimal
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        if (resetDisplay) {
            currentNumber = "";
            resetDisplay = false;
        }

        addNumber(key);

        return;
    }


    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {

        let selectedOperation = key;

        if (key === "*") {
            selectedOperation = "×";
        }

        if (key === "/") {
            selectedOperation = "÷";
        }

        if (key === "-") {
            selectedOperation = "−";
        }

        chooseOperation(selectedOperation);

        return;
    }


    // Enter or =
    if (
        key === "Enter" ||
        key === "="
    ) {

        calculate();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        deleteNumber();

        return;
    }


    // Escape
    if (key === "Escape") {

        clearCalculator();

        return;
    }

});