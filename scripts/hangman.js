import { words } from "./words.js"

let previous_words = []

try {
    previous_words = window.localStorage.getItem('previous_words').split(',')
} catch(err) {
    console.log(err)
    console.log(previous_words)
}

// GAME SETUP
let parsed_words = words.filter( ( x ) => !previous_words.includes( x ) );
let word = parsed_words[Math.floor(Math.random() * parsed_words.length)]
word = word.toLocaleLowerCase()
previous_words.push(word)
let guessed_letters = []
// console.log(word)
const stickman = ['bottom', 'side', 'top', 'diagonal', 'rope', 'head', 'body', 'left_arm', 'right_arm', 'left_leg', 'right_leg']
function reveal(part) {
    document.getElementById(part).style.opacity = 1
}

const word_area = document.getElementById('word')
let inner_word_area = ""
for (let i = 0; i < word.length; i++) {
    inner_word_area += `<p id="char${i}">__</p>`
}
word_area.innerHTML = inner_word_area
let letters_guessed = 0
let errors = 0

if (document.cookie == '') {
    document.getElementById('score').innerHTML = "Words found: 0"
} else {
    let points = parseInt(document.cookie.split("=")[1], 10)
    document.getElementById('score').innerHTML = `Words found: ${points}`
}

// GAME
document.onkeypress = function (e) {
    e = e || window.event;
    // alert(String.fromCharCode(e.keyCode))
    let letter = String.fromCharCode(e.keyCode)
    if (!guessed_letters.includes(letter)) {
        guessed_letters.push(letter)
        document.getElementById(`char${letter}`).style.opacity = 0.3
        if (word.includes(letter)) {
            for (let x = 0; x < word.length; x++) {
                if (word[x] == letter) {
                    document.getElementById(`char${x}`).innerHTML = letter.toUpperCase()
                    letters_guessed++
                }
            }
        } else {
            reveal(stickman[errors])
            errors++
        }
        setTimeout(() => {
            if (letters_guessed == word.length) {
                document.getElementById('msg').innerHTML = `<p>Congratulations! You guessed the word!</p>`
                document.getElementById('new_game').style.display = "flex"
                if (document.cookie == '') {
                    document.cookie = 'points=1; SameSite=Strict; Secure'
                    document.getElementById('score').innerHTML = "Words found: 1"
                } else {
                    let points = parseInt(document.cookie.split("=")[1], 10)
                    points ++
                    document.cookie = `points=${points}; SameSite=Strict; Secure`
                    document.getElementById('score').innerHTML = `Words found: ${points}`
                }
                window.localStorage.setItem('previous_words', previous_words)
            } else if (errors == stickman.length) {
                document.getElementById('msg').innerHTML = `<p>The word was <strong>${word}</strong>. Better luck next time!</p>`
                document.getElementById('new_game').style.display = "flex"
                window.localStorage.setItem('previous_words', previous_words)
            }
        }, 10)
    }
}