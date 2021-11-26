import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";
import React, { useState, useEffect } from "react";
import { Typography, Divider, Button, Input } from "antd";

// Image Imports
import {
  zerothHanger,
  firstHanger,
  secondHanger,
  thirdHanger,
  fourthHanger,
  fifthHanger,
  sixthHanger,
  seventhHanger,
} from "./img/index";

const imageMap = [
  zerothHanger,
  firstHanger,
  secondHanger,
  thirdHanger,
  fourthHanger,
  fifthHanger,
  sixthHanger,
  seventhHanger,
];

const alphabets = "qwertyuiopasdfghjklzxcvbnm".toUpperCase().split("");
const keys_per_row = [10, 9, 7];
const keys_before = [0, 10, 19];

// Ant Design Imports
const { Title } = Typography;

function App() {
  // Our Hangman Game
  const [gameState, setGameState] = useState("Playing"); // Playing, Won, Lost
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [word, setWord] = useState("FRAMERATE");
  const [category, setCategory] = useState("Games");
  const [guesses, setGuesses] = useState(new Set());

  function reset(){
    setGameState("Playing");
    setWrongGuesses(0);
    setWord("FRAMERATE");
    setCategory("Games");
    setGuesses(new Set());
  }

  var keysJSX = [[], [], []];
  var keyboardJSX = [];

  // Generate the keyboard
  function generateKeyboard() {
    console.log("Generating Keyboard");
    keysJSX = [[], [], []];
    keyboardJSX = [];
    for (let j = 0; j < 3; j++) {
      for (let i = keys_before[j]; i < keys_before[j] + keys_per_row[j]; i++) {
        keysJSX[j].push(
          <div onClick={() => handleLetterGuess(alphabets[i])}>
            <InputLetter letter={alphabets[i]} guesses={guesses} key={alphabets[i]}/>
          </div>
        );
      }
    }

    keyboardJSX.push(
      <div className="keyboardRow">
        {keysJSX[0].map((key) => (
          <div>{key}</div>
        ))}
      </div>
    );
    keyboardJSX.push(
      <div
        className="keyboardRow"
        style={{ paddingLeft: "5em", paddingRight: "10em" }}
      >
        {keysJSX[1].map((key) => (
          <div>{key}</div>
        ))}
      </div>
    );
    keyboardJSX.push(
      <div
        className="keyboardRow"
        style={{ paddingLeft: "10em", paddingRight: "30em" }}
      >
        {keysJSX[2].map((key) => (
          <div>{key}</div>
        ))}
      </div>
    );
  }

  function handleLetterGuess(letter) {
    console.log("Guessed: " + letter);
    if (guesses.has(letter)) {
      return;
    }
    let new_guesses = new Set(guesses);
    new_guesses.add(letter);
    setGuesses(new_guesses);
    generateKeyboard();
    
    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
      if (wrongGuesses + 1 === 7) { // plus 1 to account for slow setting state
        setGameState("Lost");
        alert("You Lost!");
        reset();
      }
    };
    
    console.log(guesses);
    let won = true;
    for (let i = 0; i < word.length; i++) {
      if (!(guesses.has(word.charAt(i)) || word[i] === " " || letter === word[i])) {
        won = false;
        console.log("Not won");
        console.log(word[i]);
        break;
      }
    }
    if (won){
      setGameState("Won");
      alert("You Won!");
      reset();
    }
  }
  
  return (
    <div style={{ backgroundColor: "#fff1f0", height: "100%" }}>
      {generateKeyboard()}
      <div className="hangerManGame">
        <br />
        <Title>Hanger Man</Title>
        <Divider horizontal />
        <DisplayWord word={word} guesses={guesses} />
        <Title level={2}>
          Category: <u>&nbsp;{category}&nbsp;</u>{" "}
        </Title>
        <div className="hangermanImageContainer">
          <img
            src={imageMap[wrongGuesses]}
            alt="Hanger"
            className="hangermanImg"
          />
          <Divider style={{ fontSize: "2em" }}> Guess Letters </Divider>
          <h1>{/*word */} </h1>
          {keyboardJSX}
        </div>
      </div>
    </div>
  );
}

function InputLetter(props) {
  if (!props.guesses.has(props.letter)) {
    return <div key={props.guesses} className="inputLetterContainer">{props.letter}</div>;
  } else {
    return <div key={props.guesses} className="disabledLetterContainer">{props.letter}</div>;
  }
}

function DisplayWord(props) {
  let word = props.word;
  let guesses = props.guesses;

  console.log(word);
  console.log(guesses);

  let lettersJSX = [];
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (!(guesses.has(letter)) && letter !== " ") {
      letter = " _ ";
    }
    lettersJSX.push(<DisplayLetter letter={letter} />);
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {lettersJSX}
    </div>
  );
}
function DisplayLetter(props) {
  return <div className="displayLetter">{props.letter}</div>;
}

export default App;
