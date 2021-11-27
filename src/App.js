import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";
import dictionary from "./dictionary.js";
import React, { useEffect, useState } from "react";
import { Typography, Divider, Modal, Progress, Select } from "antd";

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

// Ant Design Imports
const { Title } = Typography;
const { Option } = Select;

// Universal Constants
const num_lives = 7;
const alphabets = "qwertyuiopasdfghjklzxcvbnm".toUpperCase().split("");
const keys_per_row = [10, 9, 7];
const keys_before = [0, 10, 19];

// Main APP Component
function App() {
  // Our Hangman Game
  /* ========================================== SET UP STATE AND CONST ========================================== */
  document.title = "Hanger Man";
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [word, setWord] = useState("FRAMERATE");
  const [category, setCategory] = useState("animals");
  const [guesses, setGuesses] = useState(new Set());

  // Set up catetgories
  const categories = [];
  for (let key in dictionary) {
    categories.push(key);
  }
  var categoriesJSX = [];
  for (let i = 0; i < categories.length; i++) {
    categoriesJSX.push(
      <Option key={categories[i]} value={categories[i]}>
        {categories[i]}{" "}
      </Option>
    );
  }
  categoriesJSX = [
    <Select
      style={{ width: 120 }}
      onChange={handleCategoryChange}
      size="large"
      defaultValue="animals"
    >
      {categoriesJSX}
    </Select>,
  ];

  /* ========================================== FUNCTIONS ========================================== */
  function handleCategoryChange(value) {
    reset(value);
  }

  // Reset Function
  function reset(category) {
    setWrongGuesses(0);
    setGuesses(new Set());
    setWord(
      dictionary[category][
        Math.floor(Math.random() * dictionary[category].length)
      ].toUpperCase()
    );
    setCategory(category);
  }

  // Generating Keyboard
  function generateKeyboard() {
    // console.log("Generating Keyboard");
    var keysJSX = [[], [], []];
    var keyboardJSX = [];
    for (let j = 0; j < 3; j++) {
      for (let i = keys_before[j]; i < keys_before[j] + keys_per_row[j]; i++) {
        keysJSX[j].push(
          <li
            onClick={() => handleLetterGuess(alphabets[i])}
            className="inputLetterContainer"
            key={alphabets[i]}
          >
            <InputLetter
              letter={alphabets[i]}
              guesses={guesses}
              key={alphabets[i]}
            />
          </li>
        );
      }
    }

    keyboardJSX.push(
      <ul className="keyboardRow" key="firstrow">
        {keysJSX[0].map((key, index) => (
          <div key={index}>{key}</div>
        ))}
      </ul>
    );
    keyboardJSX.push(
      <ul
        className="keyboardRow"
        style={{ paddingLeft: "5em", paddingRight: "10em" }}
        key="secondrow"
      >
        {keysJSX[1].map((key, index) => (
          <div key={index}>{key}</div>
        ))}
      </ul>
    );
    keyboardJSX.push(
      <ul
        className="keyboardRow"
        style={{ paddingLeft: "10em", paddingRight: "30em" }}
        key="thirdrow"
      >
        {keysJSX[2].map((key, index) => (
          <div key={index}>{key}</div>
        ))}
      </ul>
    );

    keyboardJSX = [
      <div>
        {keyboardJSX}
      </div>,
    ];
    return keyboardJSX;
  }

  // Handle a letter guess
  function handleLetterGuess(letter) {
    // console.log(word);
    // console.log("Guessed: " + letter);
    if (guesses.has(letter)) {
      return;
    }
    let new_guesses = new Set(guesses);
    new_guesses.add(letter);
    setGuesses(new_guesses);

    if (!word.includes(letter)) {
      if (wrongGuesses + 1 === 7) {
        // plus 1 to account for slow setting state
        FailureModal();
      }
      setWrongGuesses(wrongGuesses + 1);
    }

    let won = true;
    for (let i = 0; i < word.length; i++) {
      if (
        !(guesses.has(word.charAt(i)) || word[i] === " " || letter === word[i])
      ) {
        won = false;
        break;
      }
    }
    if (won) {
      SuccessModal();
    }
  }

  /*========================================== END GAME MODALS ==========================================*/
  // Success Modal
  function SuccessModal() {
    Modal.success({
      title: "Congratulations! You've Won!",
      content: "You've guessed the word with less than 7 errors!",
      okText: "Play Again",
      onOk: () => {
        reset(category);
      },
    });
  }
  // Failure Modal
  function FailureModal() {
    Modal.error({
      title: "You've Lost!",
      content:
        "It's alright! Try again! The correct answer was: '" + word + "'",
      okText: "Play Again",
      onOk: () => {
        reset(category);
      },
    });
  }

  /* ========================================== Run Set-Up Code Once on Load ==========================================*/
  useEffect(() => {
    reset(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========================================== RENDER ========================================== */
  return (
    <div style={{ backgroundColor: "#fff1f0"}}>
      <div className="hangerManGame">
        <br />
        <Title>Hanger Man</Title>
        <Divider />
        <DisplayWord word={word} guesses={guesses} />

        <Title level={2}>Category: {categoriesJSX}</Title>
        <div className="hangermanImageContainer">
          <img
            src={imageMap[wrongGuesses]}
            alt="Hanger"
            className="hangermanImg"
          />

          <ProgressBar wrongGuesses={wrongGuesses} />
          <Divider style={{ fontSize: "2em" }}> Guess Letters </Divider>
          <div style={{ width: "100%" }}>{generateKeyboard()}</div>
        </div>
      </div>
    </div>
  );
}

/* ========================================== COMPONENTS ========================================== */
// Progress Bar
function ProgressBar(props) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "1.5em" }}
    >
      <div style={{ width: "70%" }}>
        <div>
          <Title level={3}>
            {" "}
            Spare Lives: {num_lives - props.wrongGuesses - 1}{" "}
          </Title>
        </div>
        <Progress
          strokeColor={{
            "0%": "#ff4d4f",
            "100%": "#f5222d",
          }}
          trailColor="#d9d9d9"
          percent={Math.round(
            100 - (props.wrongGuesses / (num_lives - 1)) * 100
          )}
          showInfo={false}
        />
      </div>
    </div>
  );
}

// Input Letter Component
function InputLetter(props) {
  if (!props.guesses.has(props.letter)) {
    return (
      <div key={props.guesses} className="inputLetter">
        {props.letter}
      </div>
    );
  } else {
    return (
      <div key={props.guesses} className="disabledLetter">
        {props.letter}
      </div>
    );
  }
}

// Display Word Component
function DisplayWord(props) {
  let word = props.word;
  let guesses = props.guesses;

  // Display Letter Component
  function DisplayLetter(props) {
    return <div className="displayLetter">{props.letter}</div>;
  }

  let lettersJSX = [];
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (!guesses.has(letter) && letter !== " ") {
      letter = " _ ";
    }
    lettersJSX.push(<DisplayLetter key={i} letter={letter} />);
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {lettersJSX}
    </div>
  );
}

export default App;
