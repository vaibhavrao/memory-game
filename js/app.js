// An array that holds all the symbols
const cardSymList = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
];

// Number of moves done so far
let movesCount = 0;

// Time elapsed since game started
let timeElapsed = 0;

// Is Timer currently running
let timerActive = false;

// Indicator of awesomeness of a player's performance
let starCount = 5;

// Number of cards that are yet to be matched
let remainingCards = 16;

// Style of the Odd card (first card in a pair) that has been revealed/flipped (open)
let previouslyOpenCardStyle = '';

// Style of the card that has just been opened (revealed/flipped)
let currentlyOpenCard = '';

// Add Listener on Page Load as to when DOM is ready - setup the cards
document.addEventListener('DOMContentLoaded', refreshCardLayout);

/**
 * @description Display the cards on the page
 */
function refreshCardLayout() {
  // shuffle the list of cards
  const newSymArray = shuffle(cardSymList);
  let innerHTML = '';
  // loop through each card and create its HTML
  newSymArray.forEach(styleName => {
    const cardHtml = createCardItem(styleName);
    innerHTML = innerHTML.concat(cardHtml);
  });
  // add each card's HTML to the page
  const deck = document.querySelector('.deck');
  deck.innerHTML = innerHTML;
  // change visibility of views
  const container = document.querySelector('.container');
  const gameOver = document.querySelector('.gameOver');
  container.style.display = 'flex';
  gameOver.style.display = 'none';
  // clear all values
  movesCount = 0;
  starCount = 5;
  remainingCards = 16;
  timeElapsed = 0;
  timerActive = false;
  const timeDisplay = document.querySelector('.timer');
  timeDisplay.innerHTML = '0:00';
  clearOpenCardStyles();
  updateStars();
  updateNumMoves();
}

/**
 * @description Evaluate on Even moves - check for similarity between the two flipped cards
 */
function isOddMove() {
  return (movesCount % 2 !== 0);
}

/**
 * @description Resets comparison parameters
 */
function clearOpenCardStyles() {
  previouslyOpenCardStyle = '';
  currentlyOpenCard = '';
}

/**
 * @description Provides HTML for a Hidden card using specified style
 */
function createCardItem(styleName) {
  return `<li class="card"><i class="fa ${styleName}"></i></li>`;
}

/**
 * @description Provides HTML for an Open/Flipped card using specified style
 */
function openCardItem(styleName) {
  return `<li class="card show><i class="fa ${styleName}"></i></li>`;
}

/**
 * @description Provides HTML for Stars indicating the Number of Moves
 */
function createMoveCountItem() {
  return '<li><i class="fa fa-star"></i></li>';
}

/**
 * @description Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} array - array containing stock symbols
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
 * @description Set style for Previous Card
 */
function setPreviousCardStyle(prevStyle, newStyle) {
  const cards = document.getElementsByClassName(`card ${prevStyle}`);
  cards[0].classList.value = newStyle ? `card ${newStyle}` : 'card';
}

/**
 * @description Set style for Current Card using EventTarget reference
 */
function setCurrentCardStyle(eventTarget, newStyle) {
  if (eventTarget) {
    eventTarget.classList.value = newStyle === 'hide' ? 'card' : 'card '.concat(newStyle);
  }
}

/**
 * @description Compare the 2 open cards
 * @param {object} eventTarget - eventTarget obtained from MouseEvent
 */
function compareCards(eventTarget) {
  // Compare to see if the 2 flipped cards are similar on EVEN moves
  if (previouslyOpenCardStyle === currentlyOpenCard) {
    // Cards matched
    setCurrentCardStyle(eventTarget, 'match');
    setPreviousCardStyle('show', 'match');
    clearOpenCardStyles();
    remainingCards -= 2;
    if (!remainingCards) {
      showGameOverMessage();
    }
  } else {
    // Cards did not match
    setCurrentCardStyle(eventTarget, 'mismatch');
    setPreviousCardStyle('show', 'mismatch');
    clearOpenCardStyles();
    setTimeout(() => {
      setCurrentCardStyle(eventTarget, 'hide');
      setPreviousCardStyle('mismatch', '');
    }, 500);
  }
}

/**
 * @description Show Game summary upon game completion
 */
function showGameOverMessage() {
  stopTimer();
  const gameSummary = document.querySelector('.gameSummary');
  gameSummary.innerHTML = 
    '<p>Thank you for playing the Memory Game!</p><p>You completed the game in ' + movesCount + ' moves with ' + starCount + ' stars</p><p> <button type="button" class="playAgain" onclick="refreshCardLayout()">Play again!</button></p>';
  // Handles to game view and summaryView
  const container = document.querySelector('.container');
  const gameOver = document.querySelector('.gameOver');
  container.style.display = 'none';
  gameOver.style.display = 'block';
}

/**
 * @description Start Timer
 */
function startTimer() {
  timeElapsed = 0;
  timerActive = true;
  updateTimer();
}

/**
 * @description Update Timer
 */
function updateTimer() {
  setTimeout(() => {
    if (timerActive) {
      timeElapsed++;
      const minutes = Math.floor(timeElapsed / 60);
      const sec = timeElapsed % 60;
      const seconds = sec < 10 ? '0'.concat(sec.toString()) : sec.toString();
      const formattedTime = minutes.toString().concat(':', seconds);
      const timeDisplay = document.querySelector('.timer');
      timeDisplay.innerHTML = formattedTime;
      updateTimer();
    }
  }, 1000);
}

/**
 * @description Stop Timer
 */
function stopTimer() {
  timerActive = false;
}

/**
 * @description Update the Stars indicating Number of Moves
 */
function updateStars() {
  let innerHTML = '';
  if (movesCount > 16 && movesCount <= 26) {
    starCount = 4;
  } else if (movesCount > 26 && movesCount <= 38) {
    starCount = 3;
  } else if (movesCount > 38 && movesCount <= 52) {
    starCount = 2;
  } else if (movesCount > 52) {
    starCount = 1;
  } else {
    starCount = 5;
  }
  for(let i =0; i < starCount; i++) {
    const countHtml = createMoveCountItem();
    innerHTML = innerHTML.concat(countHtml);
  }
  const stars = document.querySelector('.stars');
  stars.innerHTML = innerHTML;
}

/**
 * @description Update the Text indicating the Number of Moves
 */
function updateNumMoves() {
  const numMoves = document.querySelector('.moves');
  numMoves.innerHTML = movesCount === 1 ? movesCount.toString().concat(' Move') : movesCount.toString().concat(' Moves');
}

/**
 * Card Click Handler
 * @param {object} event - MouseEvent
 */
function cardClicked(event) {
  const eventTarget = event.target;

  // Ignore clicks in space between cards
  if (event.target.outerHTML.indexOf('<li') > 0) {
    return;
  }

  // Ignore clicks on Done cards
  if (event.target.outerHTML.indexOf('card match') > 0) {
    return;
  }

  if (!remainingCards) {
    return;
  }

  // Start timer
  if (!movesCount) {
    startTimer();
  }

  // Update Move count
  movesCount++;
  
  // Update Stars
  updateStars();

  // Update Number of Moves
  updateNumMoves();

  // Update style to reveal card
  setCurrentCardStyle(eventTarget, 'show');

  // Find out the clicked card's style and compare (if Even move)
  const styleNameStartIndex = eventTarget.innerHTML.indexOf('fa-');
  const styleNameEndIndex = eventTarget.innerHTML.indexOf('"></i>');
  currentlyOpenCard = styleNameStartIndex !== -1 ?
    eventTarget.innerHTML.substring(styleNameStartIndex, styleNameEndIndex) : '';
  if (isOddMove()) {
    previouslyOpenCardStyle = currentlyOpenCard;
  } else {
    setTimeout(() => {
      compareCards(eventTarget);
    }, 250);
  }
}
