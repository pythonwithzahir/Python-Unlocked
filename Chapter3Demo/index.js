const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Unlike Chapters 1 and 2, this program's questions branch depending on the
// answer to the previous one — just like the real solution.py. Each node
// below is one input() call; "next" decides which node to show afterwards
// based on the lowercased answer, exactly mirroring the if/elif/else chain
// in the real program.

let currentNode = null;
let finished = false;

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

function printLose(text) {
  const line = document.createElement("div");
  line.className = "lose-line";
  line.textContent = text;
  output.appendChild(line);
}

function showPrompt(promptString) {
  promptText.textContent = promptString;
  lineWrap.hidden = false;
  input.value = "";
  input.focus();
}

// node shape: { print: [optional lines printed before the prompt], prompt: "..." }
const startNode = {
  print: [
    "=".repeat(50),
    "SPACE STATION ESCAPE",
    "=".repeat(50),
    "Welcome aboard, Officer.",
    "Your mission is to reach an escape pod before the station loses power.",
    "",
    "An alarm is blaring. Two corridors lead away from you.",
    "A. Left corridor",
    "B. Right corridor",
  ],
  prompt: "Which one do you take? ",
  onAnswer: (answer) => {
    if (answer === "a") return airlockNode;
    printLose("The floor gives way beneath you. Game Over.");
    return null; // ends the demo
  },
};

const airlockNode = {
  print: [
    "",
    "You reach a sealed airlock door.",
    "A. Wait for the override to finish",
    "B. Force the door open by hand",
  ],
  prompt: "What do you do? ",
  onAnswer: (answer) => {
    if (answer === "a") return podNode;
    printLose("The door jams halfway open. Game Over.");
    return null;
  },
};

const podNode = {
  print: [
    "",
    "The override finishes. Three escape pods remain.",
    "A. Red pod",
    "B. Blue pod",
    "C. Green pod",
  ],
  prompt: "Which pod do you choose? ",
  onAnswer: (answer) => {
    if (answer === "a") {
      printLose("That pod's fuel line is ruptured. Game Over.");
    } else if (answer === "b") {
      printLose("That pod won't clear the docking bay in time. Game Over.");
    } else if (answer === "c") {
      printLine("The green pod launches clean. You make it out.");
      printLine("+------------------------------------+");
      printLine("|        ESCAPE POD ACTIVATED        |");
      printLine("+------------------------------------+");
      printResult("You win!");
    } else {
      printLose("There is no pod by that name. Game Over.");
    }
    return null;
  },
};

function runNode(node) {
  currentNode = node;
  if (node.print) {
    node.print.forEach(printLine);
  }
  showPrompt(node.prompt);
}

function step_prompt_with_answer(value) {
  // These prompts end in a space, not \n, so in a real terminal the typed
  // answer appears on the SAME line as the question, right after it.
  return promptText.textContent + value;
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished || !currentNode) return;

  const raw = input.value.trim();
  if (raw === "") return;

  // Echo what the user typed into the output, right after the prompt text.
  printLine(step_prompt_with_answer(raw));

  // The real program calls .lower() on every answer before checking it.
  const answer = raw.toLowerCase();

  lineWrap.hidden = true;
  const nextNode = currentNode.onAnswer(answer);

  if (nextNode) {
    runNode(nextNode);
  } else {
    finish();
  }
}

function finish() {
  finished = true;
  currentNode = null;
  lineWrap.hidden = true;
  input.value = "";
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Run again";
}

function startDemo() {
  output.innerHTML = "";
  finished = false;
  runBtn.disabled = true;
  runNode(startNode);
}

runBtn.addEventListener("click", startDemo);
input.addEventListener("keydown", handleEnter);
