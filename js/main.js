document.addEventListener("DOMContentLoaded", () => {
  new Game();
});

const url =
  "https://gist.githubusercontent.com/ruizalexandre/13e65c88e7ab65f88f13a01928632311/raw/59d0ba6a5ba865967cc2de2619300613bfd2f55c/pendu.json";

class Game {
  words = {};
  nbError = 0;
  randomWord;
  wordToFind = document.getElementById("wordToFind");
  msg = document.getElementById("msg");

  hangman = document.getElementById("hangman");
  errors = document.getElementById("errors");
  info = document.getElementById("info");
  buttonBack = document.getElementById("button_back");
  buttonReplay = document.getElementById("button_replay");
  constructor() {
    this.getDatas(url).then((response) => {
      this.words = response.values;
      this.launchGame();
    });
  }

  launchGame() {
    this.randomWord = this.getRandomElement(this.words);
    this.createBoard(this.randomWord);
    document.addEventListener("keydown", this.onTyping, true);
  }

  onTyping = (event) => {
    let typedLetter = event.key.toUpperCase();
    let indexRandomWord = this.randomWord.indexOf(typedLetter);
    let indexCurrentValue = this.wordToFind.outerText.indexOf(typedLetter);
    if (event.key.match(/^[a-z]$/i)) {
      if (indexRandomWord !== -1) {
        if (indexCurrentValue === -1) {
          this.replaceWord(typedLetter);

          if (this.randomWord === this.wordToFind.outerText) {
            this.endGame("YOU WIN !!");
          }
        } else {
            this.wordToFind.style.transform = "translateY(-10px)";
            setTimeout(()=> this.wordToFind.style.transform = "translateY(0px)", 250)
        }
      } else {
        this.nbError++;
        this.displayPicture(this.hangman);
        this.insertHTMLOnSelector("#errors", typedLetter);

        if (this.nbError === 7) {
          this.endGame("GAME OVER !! the word was : " + this.randomWord);
        }
      }
    }
  };

  replaceWord(letter) {
    let randomWordChar = this.randomWord.split("");

    randomWordChar.forEach((char, index) => {
      if (char === letter) {
        let currentValue = this.wordToFind.textContent;
        let onProgressValue = this.replaceChar(currentValue, letter, index);
        this.wordToFind.innerHTML = onProgressValue;
      }
    });
  }

  displayPicture(element) {
    element.style.visibility = "visible";
    let position = window
      .getComputedStyle(element)
      .getPropertyValue("background-position")
      .split(" ");
    let newPosition = Number(position[0].replace("px", "")) - 215;
    element.style.backgroundPosition = newPosition + "px 0";
  }

  endGame = (message) => {
    this.msg.innerHTML = message;
    this.buttonReplay.style.visibility = "visible";
    this.buttonBack.style.visibility = "visible";
    this.errors.innerHTML = "";
    this.info.innerHTML = "";
    this.hangman.style.visibility = "hidden";

    this.buttonReplay.onclick = () => {
      this.hangman.style.backgroundPosition = "-33px 0";
      this.msg.innerHTML = "";
      this.info.innerHTML = "Type a letter";
      this.buttonReplay.style.visibility = "hidden";
      this.buttonBack.style.visibility = "hidden";
      this.nbError = 0;
      this.wordToFind.innerHTML = "";
      this.launchGame();
    };
    document.removeEventListener("keydown", this.onTyping, true);
  };

  replaceChar(origString, replace, index) {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);

    let newString = firstPart + replace + lastPart;
    return newString;
  }

  createBoard(word) {
    word = word.replace(/[A-Za-z]/g, "_");
    word = word.replace(/[\s]/g, "&nbsp;");
    this.insertHTMLOnSelector("#wordToFind", word);
  }

  insertHTMLOnSelector(selector, text) {
    document.querySelector(selector).insertAdjacentHTML("beforeend", text);
  }

  hideElement(element) {
    element.hidden = true;
  }

  async getDatas(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        return Promise.reject(response);
      }
    } catch (err) {
      console.error("Error in GET datas :", err);
    }
  }

  getRandomElement(items) {
    return items[Math.floor(Math.random() * items.length)].toUpperCase();
  }
}
