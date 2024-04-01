const displayColor = document.querySelector("#displayColor");
const displayScore = document.querySelector("#displayScore");
const actionButtons = document.querySelectorAll("button[data-mode]");
const boxes = document.querySelectorAll(".box");

const config = {
  answer: -1,
  count: 0,
  score: 0,
  mode: "",
  countMap: {
    easy: 3,
    medium: 6,
    hard: 9,
    extreme: 9,
  },
  scoreMap: {
    easy: 10,
    medium: 20,
    hard: 50,
    extreme: 200,
  },
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (config.answer === -1 || config.count === 0) {
      displayAlert("First pick mode", "warning");
      return;
    }

    if (config.count <= index) {
      displayAlert("Pick colored box", "warning");
      return;
    }

    const alreadyClicked = box.getAttribute("data-clicked");

    if (alreadyClicked) {
      displayAlert("You already clicked here, try other", "info");
      return;
    }
    const hasWon = index === config.answer;
    const baseScore = config.scoreMap[config.mode];
    let score;
    if (config.mode === "extreme") {
      score = !hasWon ? baseScore : -50;
    } else {
      score = hasWon ? baseScore : (baseScore / 2 + 3) * -1;
    }

    if (config.score + score < 0) {
      score = 0;
    }
    config.score += score;
    displayScore.textContent = config.score;

    if (config.mode === "extreme") {
      if (hasWon) {
        initGame(config.mode);
        displayAlert("You guessed the correct color", "error");
        return;
      }
      displayAlert("You guessed wrong color", "success");
      box.setAttribute("data-clicked", true);
      setBoxStyle(box);

      const clickedCount = document.querySelectorAll(
        "div.box[data-clicked]"
      ).length;
      if (clickedCount + 1 === config.count) {
        displayAlert("You guessed all wrong colors", "success");
        initGame(config.mode);
      }
    } else {
      if (hasWon) {
        initGame(config.mode);
        displayAlert("You guessed color", "success");
        return;
      }
      displayAlert("You missed correct color", "error");
      box.setAttribute("data-clicked", true);
      setBoxStyle(box);

      const clickedCount = document.querySelectorAll(
        "div.box[data-clicked]"
      ).length;

      if (clickedCount + 1 === config.count) {
        displayAlert("Skiped", "info", "You picked all wrong colors");
      }
    }
  });
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.getAttribute("data-mode");
    initGame(mode);
  });
});

function initGame(mode) {
  initStyles();
  initDefaultAttributes();
  const count = config.countMap[mode] || 3;
  const colors = getRandomRGBColors(count);
  const answer = getRandomNumber(count);
  for (const [index, box] of boxes.entries()) {
    if (count === index) {
      break;
    }
    setBoxStyle(box, colors[index], "pointer");
  }
  displayColor.textContent = colors[answer];
  config.count = count;
  config.answer = answer;
  config.mode = mode;
}

function getRandomNumber(max = 256) {
  return Math.floor(Math.random() * max);
}

function getRandomRGB() {
  const r = getRandomNumber();
  const g = getRandomNumber();
  const b = getRandomNumber();
  return `rgb(${r},${g},${b})`;
}

function getRandomRGBColors(count) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(getRandomRGB());
  }
  return array;
}

function initStyles() {
  boxes.forEach((box) => {
    setBoxStyle(box);
  });
}

function initDefaultAttributes() {
  boxes.forEach((box) => {
    box.removeAttribute("data-clicked");
  });
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

function setBoxStyle(box, color = "transparent", cursor = "not-allowed") {
  box.style.backgroundColor = color;
  box.style.cursor = cursor;
}

/*
  დავალება
  დაამატეთ extreme რეჟიმი, სადაც:
  მომხარებელმა უნდა შეეცადოს, რომ არ დააკლიკოს მითითებულ ფერს ანუ
  დააკლიკოს მხოლოდ არასწორ ფერებს. თუ ყოველ არასწორ ფერს დააკლიკებს
  ქულა მოემატოს 200 ან დააკლდეს 50-ით.
*/
