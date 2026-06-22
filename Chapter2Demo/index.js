const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// The sequence of prompts this fake console will step through.
// Each step prints a prompt, waits for the user to type a value and press Enter,
// then moves on to the next step.
const steps = [
  {
    print: "Welcome to the currency converter!",
    prompt: "How much money are you converting? "
  },
  {
    prompt: "What's today's exchange rate? "
  },
  {
    prompt: "What percentage fee does your bank charge? "
  }
];

let stepIndex = 0;
let answers = [];

function printLine(text) {
  const line = document.createElement("div");
  line.className = "terminal-output-line";
  line.textContent = text;
  output.appendChild(line);
}

function printResult(text) {
  const line = document.createElement("div");
  line.className = "result-line";
  line.textContent = text;
  output.appendChild(line);
}

function showPrompt(promptString) {
  promptText.textContent = promptString;
  lineWrap.hidden = false;
  input.value = "";
  input.focus();
}

function runStep() {
  const step = steps[stepIndex];

  if (step.print) {
    printLine(step.print);
  }

  showPrompt(step.prompt);
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (stepIndex >= steps.length) return; // demo already finished, ignore further input

  const value = input.value.trim();
  if (value === "") return;

  // Reject non-numeric input, since the real program converts every answer with float().
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    printLine(step_prompt_with_answer(value));
    printErrorLine("That input would raise a ValueError in the real program — try a number instead.");
    input.value = "";
    return;
  }

  // Echo what the user typed into the output, right after the prompt text.
  printLine(step_prompt_with_answer(value));
  answers.push(numericValue);

  lineWrap.hidden = true;
  stepIndex++;

  if (stepIndex < steps.length) {
    runStep();
  } else {
    finish();
  }
}

function step_prompt_with_answer(value) {
  // These prompts end in a space, not \n, so in a real terminal the typed
  // answer appears on the SAME line as the question, right after it.
  return promptText.textContent + value;
}

function printErrorLine(text) {
  const line = document.createElement("div");
  line.className = "error-line";
  line.textContent = text;
  output.appendChild(line);
}

function finish() {
  const amount = answers[0];
  const exchangeRate = answers[1];
  const feePercent = answers[2];

  const convertedAmount = amount * exchangeRate;
  const feeAmount = convertedAmount * (feePercent / 100);
  const finalAmount = Math.round((convertedAmount - feeAmount) * 100) / 100;

  printResult(`You will receive: ${finalAmount}`);
  lineWrap.hidden = true;
  input.value = "";
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Run again";
}

function startDemo() {
  output.innerHTML = "";
  answers = [];
  stepIndex = 0;
  runBtn.disabled = true;
  runStep();
}

runBtn.addEventListener("click", startDemo);
input.addEventListener("keydown", handleEnter);
