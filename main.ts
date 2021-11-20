let wordDiv = document.querySelector(".word") as HTMLDivElement;

const fetchRandomWord = async () => {
  const response = await fetch("https://random-word-api.herokuapp.com/word?number=1");
  const jsonResponse = await response.json();
  const randomWord: string = jsonResponse[0]; 
  for (let i=0; i<randomWord.length; i++) {
    let letter = document.createElement("span");
    letter.setAttribute("class", "word-letter")
    letter.textContent = randomWord[i]; 
    // letter.style.textDecoration = "underline";
    letter.style.visibility = "hidden";  
    wordDiv.appendChild(letter); 
  }
}

fetchRandomWord(); 

const startGame = () => {
// really important to do this!! 
  let allLetters = document.querySelectorAll(".letter") as NodeListOf<HTMLSpanElement>; 
  let wordLetters = document.querySelectorAll(".word-letter") as NodeListOf<HTMLSpanElement>;
  [...allLetters].forEach(button => {
    button.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLSpanElement;
      target.classList.add("pressed")});
    button.addEventListener("mouseup", (e) => {
      const target = e.target as HTMLSpanElement;
      target.classList.remove("pressed")}); 
    button.style.visibility = "visible"; 
  }); 
  let letterArr: Array<string> = [...wordLetters].map(span => span.innerHTML);
  console.log(letterArr); 
  let noOfLives = 5; 
  let gameOutcome = document.querySelector(".game-outcome") as HTMLDivElement; 
  gameOutcome.style.visibility = "visible"; 
  [...allLetters].forEach(chosenLetter => chosenLetter.addEventListener("click", () => {
    console.log(chosenLetter.innerHTML.toLowerCase())
    let example: string = chosenLetter.innerText.toLowerCase(); 
    if (letterArr.includes(example)) {
        console.log("matched");
        chosenLetter.style.backgroundColor = "green";
        [...wordLetters].filter(wordLetter => wordLetter.textContent == example).forEach(match => match.style.visibility = "visible");
        letterArr = letterArr.filter(item => item !== example)
    } else {
        console.log("no match");
        chosenLetter.style.backgroundColor = "red";
        noOfLives -= 1;  
        gameOutcome.innerHTML = `LIVES: ${noOfLives.toString()}`; 
    }
    console.log(letterArr); 
  if (noOfLives<=0) {
    gameOutcome.style.visibility = "visible"; 
    gameOutcome.innerHTML = "Oh no, you've lost!"; 
    window.alert("You've ran out of lives, Spider-Man! Play again?");
    location.reload();
  }
  if (letterArr.length == 0) {
    console.log("all matches found");
    gameOutcome.style.visibility = "visible"; 
    gameOutcome.innerHTML = "Well done, you've won!"; 
    window.alert("Well done, you've guessed the word!");
    location.reload();
  }
  }))
}

let startGameButton = document.querySelector(".start-game") as HTMLDivElement; 
startGameButton.addEventListener("click", startGame); 

// animation on keypress 

// [...allLetters].forEach(button => {
//   button.addEventListener("mousedown", (e) => {
//     const target = e.target as HTMLSpanElement;
//     target.classList.add("pressed")});
//   button.addEventListener("mouseup", (e) => {
//     const target = e.target as HTMLSpanElement;
//     target.classList.remove("pressed")
// }); 
// })