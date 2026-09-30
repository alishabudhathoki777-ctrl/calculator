const expression = document.getElementById("expression");
const result = document.getElementById("result");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let lastAnswer = "";
let degreeMode = true;

function updateDisplay() {
expression.textContent = currentInput || "";
result.textContent = currentInput || "0";
}

function addValue(value) {
currentInput += value;
updateDisplay();
}

function clearCalculator() {
currentInput = "";
lastAnswer = "";
updateDisplay();
}

function deleteLast() {
currentInput = currentInput.slice(0, -1);
updateDisplay();
}

function factorial(n) {
if (n < 0 || !Number.isInteger(n)) {
throw new Error("Invalid factorial");
}

let answer = 1;

for (let i = 2; i <= n; i++) {
answer *= i;
}

return answer;
}

function calculateScientific(func) {
try {
const value = Number(currentInput);

if (!Number.isFinite(value)) {
throw new Error("Invalid number");
}

let answer;

switch (func) {
case "sin":
answer = Math.sin(
degreeMode ? value * Math.PI / 180 : value
);
break;

case "cos":
answer = Math.cos(
degreeMode ? value * Math.PI / 180 : value
);
break;

case "tan":
answer = Math.tan(
degreeMode ? value * Math.PI / 180 : value
);
break;

case "log":
if (value <= 0) throw new Error("Invalid input");
answer = Math.log10(value);
break;

case "ln":
if (value <= 0) throw new Error("Invalid input");
answer = Math.log(value);
break;

case "sqrt":
if (value < 0) throw new Error("Invalid input");
answer = Math.sqrt(value);
break;

case "square":
answer = value ** 2;
break;

case "factorial":
answer = factorial(value);
break;

default:
return;
}

lastAnswer = formatResult(answer);
expression.textContent = `${func}(${value})`;
result.textContent = lastAnswer;
currentInput = lastAnswer;

} catch {
result.textContent = "Error";
currentInput = "";
}
}

function formatResult(value) {
if (!Number.isFinite(value)) {
return "Error";
}

return Number.parseFloat(value.toPrecision(12)).toString();
}

function evaluateExpression() {
try {
if (!currentInput) return;

let calculation = currentInput
.replace(/×/g, "*")
.replace(/÷/g, "/")
.replace(/−/g, "-")
.replace(/π/g, "Math.PI")
.replace(/\be\b/g, "Math.E");

if (!/^[0-9+\-*/().\s^%MathPIE]+$/.test(calculation)) {
throw new Error("Invalid expression");
}

calculation = calculation.replace(/\^/g, "**");

const answer = Function(`"use strict"; return (${calculation})`)();

if (!Number.isFinite(answer)) {
throw new Error("Invalid calculation");
}

expression.textContent = currentInput;
currentInput = formatResult(answer);
result.textContent = currentInput;

} catch {
expression.textContent = "";
result.textContent = "Error";
currentInput = "";
}
}

buttons.forEach(button => {

button.addEventListener("click", () => {

const value = button.textContent.trim();

if (/^[0-9.]$/.test(value)) {
addValue(value);
return;
}

if (["+", "−", "×", "÷", "(", ")", "^", "%"].includes(value)) {
addValue(value);
return;
}

switch (value) {

case "AC":
clearCalculator();
break;

case "DEL":
deleteLast();
break;

case "=":
evaluateExpression();
break;

case "π":
addValue("π");
break;

case "e":
addValue("e");
break;

case "sin":
case "cos":
case "tan":
case "log":
case "ln":
calculateScientific(value);
break;

case "√":
calculateScientific("sqrt");
break;

case "x²":
calculateScientific("square");
break;

case "xʸ":
addValue("^");
break;
}
});
});

document.addEventListener("keydown", event => {

const key = event.key;

if (/^[0-9.]$/.test(key)) {
addValue(key);
}

else if (["+", "-", "*", "/", "(", ")", "^", "%"].includes(key)) {

const symbol = {
"-": "−",
"*": "×",
"/": "÷"
}[key] || key;

addValue(symbol);
}

else if (key === "Enter" || key === "=") {
evaluateExpression();
}

else if (key === "Backspace") {
deleteLast();
}

else if (key === "Escape") {
clearCalculator();
}
});

updateDisplay();