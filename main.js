const MAX_TWEETS = 200
const MAX_PAGES = 3

let urls, headers

function submit() {
  firstUser = document.getElementById('first-user').value
  secondUser = document.getElementById('second-user').value

  let prefix = 'https://cors-anywhere.herokuapp.com/'
  let call = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='
  let randomPage = Math.floor(Math.random() * 3)
  urls = [
    prefix + call + firstUser + '&count=' + MAX_TWEETS + "&page=" + toString(randomPage),
    prefix + call + secondUser + '&count=' + MAX_TWEETS + "&page=" + toString(randomPage)
  ]

  headers = new Headers()

  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAALz0HgEAAAAAU0%2FBec0tmly9q6TcUPQwzbnUutE%3DPNYKcbuLJCBz43SQJ25yFsP11znICMnkSmQ9Ubj5II5W1Urry8')

  getData()
  setTimeout(function () {
    updateScore()
  }, 1000);

  let formDiv = document.getElementById("form")
  formDiv.style.display = "none"

  let choiceButtons = document.getElementById("choices")
  choiceButtons.style.display = "block"

  let firstChoice = document.getElementById('first-choice')
  let secondChoice = document.getElementById('second-choice')

  firstChoice.textContent = "@" + firstUser
  secondChoice.textContent = "@" + secondUser

}

let jsonData, tweetDiv

function getData() {
  let requests = urls.map(url => fetch(url, {
    method: 'GET',
    headers: headers
  }))

  tweetDiv = document.getElementById('tweet')

  jsonData = [];
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
    let tweet = jsonData[randomUser][randomTweet].text
    user = jsonData[randomUser][randomTweet].user.screen_name
    let count = 0
    while ((tweet.includes("https://t.co/") || tweet.includes("@") || pastTweets.includes(tweet)) && count < MAX_TWEETS) {
      randomTweet = Math.floor(Math.random() * MAX_TWEETS)
      tweet = jsonData[randomUser][randomTweet].text
      user = jsonData[randomUser][randomTweet].user.screen_name
      count++;
    }
    let tweetElement = document.createElement('h4')
    tweetElement.setAttribute('id', 'tweet-text')
    tweetElement.textContent = tweet
    tweetDiv.appendChild(tweetElement)
  }, 2000);
}

let numCorrect = 0
let numTotal = 0
let count = 0
let streak = 0

let numerator, denominator
let numeratorValue, denominatorValue
let newNumerator, newDenominator

function updateScore() {
  displayTweet()

  numerator = document.getElementById('num-correct')
  denominator = document.getElementById('num-total')

  numeratorValue = document.createElement('span')
  numeratorValue.textContent = 0
  numerator.appendChild(numeratorValue)

  denominatorValue = document.createElement('span')
  denominatorValue.textContent = 0
  denominator.appendChild(denominatorValue)

  newNumerator = document.createElement('span')
  newDenominator = document.createElement('span')
}

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

function onClick(clickedUser) {
  if (clickedUser.toLowerCase() == "@" + user.toLowerCase()) {
    numCorrect++
    streak++
    if (streak > record) {
      record = streak;
    }
    if (streak >= 3) {
      streakContainer.style.visibility = "visible"
      if (pastStreaks > 0) {
        pastStreaksContainer.style.visibility = "visible"
      }
      pastStreaks++
    }
  } else {
    streak = 0
  }

  streakValue.innerHTML = "&#128293;" + streak
  pastStreaksValue.innerHTML = "Best Streak: " + record

  if (streak == 0) {
    streakContainer.style.visibility = "hidden"
    pastStreaksContainer.style.visibility = "hidden"
  }

  streakContainer.appendChild(streakValue)

  if (count % 2 == 0) {
    newNumerator.textContent = numCorrect
    numerator.parentNode.replaceChild(newNumerator, numerator)
  } else {
    numerator.textContent = numCorrect
    newNumerator.parentNode.replaceChild(numerator, newNumerator)
  }

  let oldTweet = document.getElementById('tweet-text').textContent
  pastTweets.push(oldTweet)
  document.getElementById('tweet-text').remove()

  // increment total guesses (denominator)
  numTotal++
  if (count % 2 == 0) {
    newDenominator.textContent = numTotal
    denominator.parentNode.replaceChild(newDenominator, denominator)
  } else {
    denominator.textContent = numTotal
    newDenominator.parentNode.replaceChild(denominator, newDenominator)
  }

  count++

  displayTweet()
}

function fillInput(name) {
  firstUser = document.getElementById('first-user')
  secondUser = document.getElementById('second-user')

  if (firstUser.value == "") {
    firstUser.value = name
  } else if (firstUser.value == name) {
    secondUser.value = secondUser.value;
  } else if (secondUser.value == "") {
    secondUser.value = name
  }
}
