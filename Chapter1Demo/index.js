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
    print: "Time to write a postcard message.",
    prompt: "Where are you sending this postcard from?\n"
  },
  {
    prompt: "What's one thing you saw there?\n"
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

  // Echo what the user typed into the output, right after the prompt text.
  printLine(step_prompt_with_answer(value));
  answers.push(value);

  lineWrap.hidden = true;
  stepIndex++;

  if (stepIndex < steps.length) {
    runStep();
  } else {
    finish();
  }
}

function step_prompt_with_answer(value) {
  const promptShown = promptText.textContent;
  // promptShown already ends in \n (matching input("...\n") in the real code),
  // so the typed answer appears on the line below the question, just like a
  // real terminal running input().
  return promptShown + value;
}

function finish() {
  const place = answers[0];
  const sight = answers[1];
  printResult(`Greetings from ${place}! Today I saw ${sight}.`);
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
