const MAX_TWEETS = 200
const MAX_PAGES = 7

let urls, headers

// function to call when the player clicks Submit
function submit() {
  // get value of text input fields
  firstUser = document.getElementById('first-user').value
  secondUser = document.getElementById('second-user').value

  // validate input users to remove @ if there is one
  if (firstUser[0] == "@") {
    firstUser = firstUser.substring(1, firstUser.length)
  }
  if (secondUser[0] == "@") {
    secondUser = secondUser.substring(1, secondUser.length)
  }

  getData() // GET requests to get tweet data

  // wait 1000 milliseconds before attempting to display tweet and update score
  setTimeout(function () {
    displayTweet()
    updateScore()
  }, 1000);

  makeUserButtons()

  directions = document.getElementById('directions')
  directions.style.visibility = 'visible'
}

// function to display two buttons, one for each desired Twitter user
function makeUserButtons() {
  let formDiv = document.getElementById("form")
  formDiv.style.display = "none"

  let choiceButtons = document.getElementById("choices")
  choiceButtons.style.display = "block"

  let firstChoice = document.getElementById('first-choice')
  let secondChoice = document.getElementById('second-choice')

  firstChoice.textContent = "@" + firstUser
  secondChoice.textContent = "@" + secondUser
}

let jsonData = []
let tweetDiv = document.getElementById('tweet')

function getData() {
  let prefix = 'https://cors-anywhere.herokuapp.com/' // used to avoid CORS error

  // link for API call
  let call = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='

  let randomPage = Math.floor(Math.random() * 7) // select random page (0-MAX_PAGES)

  // array of URLs for GET request (one for each user)
  urls = [
    prefix + call + firstUser + '&count=' + MAX_TWEETS + "&page=" + toString(randomPage),
    prefix + call + secondUser + '&count=' + MAX_TWEETS + "&page=" + toString(randomPage)
  ]

  // create and append headers
  headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAALz0HgEAAAAAU0%2FBec0tmly9q6TcUPQwzbnUutE%3DPNYKcbuLJCBz43SQJ25yFsP11znICMnkSmQ9Ubj5II5W1Urry8')

  // GET request for each URL
  let requests = urls.map(url => fetch(url, {
    method: 'GET',
    headers: headers
  }))

  // push data when promise is fulfilled
  Promise.all(requests).then(responses => responses.forEach(
    response => response.json()
                        .then(responseData => jsonData.push(responseData))
  ))
}

let user
let pastTweets = []

function displayTweet() {
  // get random numbers to choose user and tweet index
  let randomUser = Math.floor(Math.random() * 2)
  let randomTweet = Math.floor(Math.random() * MAX_TWEETS)

  setTimeout(function () {
    // randomly select a Tweet and determine the user of that Tweet
    let tweet = jsonData[randomUser][randomTweet].text
    user = jsonData[randomUser][randomTweet].user.screen_name

    tweet = verifyTweet(tweet, randomUser, randomTweet)

    // if this deletion results in an empty string, find a new Tweet
    while (tweet == "" || tweet.includes("@")) {
      randomTweet = Math.floor(Math.random() * MAX_TWEETS)
      tweet = jsonData[randomUser][randomTweet].text
      user = jsonData[randomUser][randomTweet].user.screen_name
      tweet = verifyTweet(tweet, randomUser, randomTweet)
    }

    // display the Tweet on the page
    let tweetElement = document.createElement('h4')
    tweetElement.setAttribute('id', 'tweet-text')
    tweetElement.textContent = tweet
    tweetDiv.appendChild(tweetElement)
  }, 2000);
}

function verifyTweet(tweet, randomUser, randomTweet) {
  let count = 0 // used to ensure the following while loop does not run forever

  // if Tweet has already been displayed, find a new Tweet
  while (pastTweets.includes(tweet) && count < MAX_TWEETS) {
    pastTweets.push(tweet)
    randomTweet = Math.floor(Math.random() * MAX_TWEETS)
    tweet = jsonData[randomUser][randomTweet].text
    user = jsonData[randomUser][randomTweet].user.screen_name

    count++;
  }

  /* Save tweet in a new variable and push to pastTweets.
     The original tweet is going to be manipulated below */
  let originalTweet = tweet
  pastTweets.push(originalTweet)

  // if Tweet includes a link, delete the link from the Tweet
  if (tweet.includes("https://t.co/")) {
    let startOfLink = tweet.indexOf("https://t.co/")
    let endOfLink = tweet.substring(startOfLink + 12, tweet.length).indexOf(" ")
    tweet = tweet.substring(startOfLink, endOfLink)
  }

  // ampersands are retrieved as "&amp;" - replace that with "&"
  if (tweet.includes("&amp;")) {
    tweet = tweet.replace("&amp;", "&")
  }

  return tweet
}

// initialize counter variables
let numCorrect = 0
let numIncorrect = 0
let count = 0
let streak = 0

// initialize variables for score
let correct, incorrect
let correctValue, incorrectValue
let newCorrect, newIncorrect

// updates the score display with the appropriate values
function updateScore() {
  correct = document.getElementById('num-correct')
  incorrect = document.getElementById('num-incorrect')

  correctValue = document.createElement('span')
  correctValue.textContent = 0
  correct.appendChild(correctValue)

  incorrectValue = document.createElement('span')
  incorrectValue.textContent = 0
  incorrect.appendChild(incorrectValue)

  newCorrect = document.createElement('span')
  newIncorrect = document.createElement('span')
}

// used to display the streak and streak record
let streakContainer = document.getElementById('streak')
let streakValue = document.createElement('span')

let pastStreaksContainer = document.getElementById('high-score')
let pastStreaksValue = document.createElement('span')

streakContainer.appendChild(streakValue)
streakContainer.style.visibility = "hidden"

pastStreaksContainer.appendChild(pastStreaksValue)
pastStreaksContainer.style.visibility = "hidden"

let pastStreaks = 0
let record = 0

// location in HTML where the "thumbs up" or "thumbs down" will be displayed
let thumb = document.getElementById("thumb")

// runs when the player clicks the button for one of the users (makes a guess)
function onClick(clickedUser) {
  if (clickedUser.toLowerCase() == "@" + user.toLowerCase()) { // if choice is correct

    // increment the counts for number of correct choices and the player's streak
    numCorrect++
    streak++

    // if the streak surpasses the previous streak record, update the record
    if (streak > record) {
      record = streak;
    }

    // display the streak if it is greater than 3
    if (streak >= 3) {
      streakContainer.style.visibility = "visible"

      /* once the user passes 3 in their very first streak, their streak record is also
      displayed next to the streak */
      if (pastStreaks > 0) {
        pastStreaksContainer.style.visibility = "visible"
      }
      pastStreaks++
    }

    // display thumbs up if the user's choice was correct
    thumb.innerHTML = "<i class='fas fa-thumbs-up'></i>"
    setTimeout(function () {
      thumb.innerHTML = ""
    }, 1500);

  } else { // player's choice was incorrect
    streak = 0 // reset the streak

    // display a thumbs down
    thumb.innerHTML = "<i class='fas fa-thumbs-down'></i>"
    setTimeout(function () {
      thumb.innerHTML = ""
    }, 1500);

    // increment incorrect guesses
    numIncorrect++
  }

  // update the values of the streak and streak record
  streakValue.innerHTML = "&#128293;" + streak
  pastStreaksValue.innerHTML = "Best Streak: " + record

  // if the player loses their streak, hide the display
  if (streak == 0) {
    streakContainer.style.visibility = "hidden"
    pastStreaksContainer.style.visibility = "hidden"
  }

  streakContainer.appendChild(streakValue)

  // ensures that the score is updated correctly each time
  if (count % 2 == 0) {
    newCorrect.textContent = numCorrect
    correct.parentNode.replaceChild(newCorrect, correct)
  } else {
    correct.textContent = numCorrect
    newCorrect.parentNode.replaceChild(correct, newCorrect)
  }

  // push the previous tweet to pastTweets to prevent future repetition
  let oldTweet = document.getElementById('tweet-text').textContent
  pastTweets.push(oldTweet)
  document.getElementById('tweet-text').remove()

  // same strategy as used for the correct to ensure score is updated correctly
  if (count % 2 == 0) {
    newIncorrect.textContent = numIncorrect
    incorrect.parentNode.replaceChild(newIncorrect, incorrect)
  } else {
    incorrect.textContent = numIncorrect
    newIncorrect.parentNode.replaceChild(incorrect, newIncorrect)
  }

  count++ // increment count (used for accurate score updating)

  displayTweet() // display the next Tweet
}

firstUser = document.getElementById('first-user')
secondUser = document.getElementById('second-user')

// fill text fields with a given user name
function fillInput(name) {
  if (firstUser.value == "") {
    firstUser.value = name
  } else if (firstUser.value == name) {
    secondUser.value = secondUser.value;
  } else if (secondUser.value == "") {
    secondUser.value = name
  }
}

// array of sample users for use with helpMeChoose()
let sampleUsers = ["elonmusk", "kanyewest", "casey", "markrober", "andrewyang", "joebiden", "realDonaldTrump", "kimkardashian", "ava", "kingjames", "kamalaharris", "aoc", "nygovcuomo", "savannahguthrie", "marwilliamson", "kimmythepooh", "billgates", "BarackObama", "justinbieber", "rihanna", "taylorswift13", "jtimberlake", "selenagomez", "shakira", "neymarjr"]

/* When the "Help me choose!" link is clicked, two random users from the above array will
be populated into the text fields */
function helpMeChoose() {
  let max = sampleUsers.length
  let indexOne = Math.floor(Math.random() * max)
  fillInput(sampleUsers[indexOne])

  let indexTwo = Math.floor(Math.random() * max)
  while (indexOne == indexTwo) { // ensure that the same user isn't populated twice
    indexTwo = Math.floor(Math.random() * max)
  }
  fillInput(sampleUsers[indexTwo])
}
