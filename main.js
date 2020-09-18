const maxTweets = 20

let prefix = 'https://cors-anywhere.herokuapp.com/'
let urls = [
  prefix + 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=elonmusk&count=' + maxTweets,
  prefix + 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=kanyewest&count=' + maxTweets
]

const headers = new Headers()

headers.append('Content-Type', 'application/json')
headers.append('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAALz0HgEAAAAAU0%2FBec0tmly9q6TcUPQwzbnUutE%3DPNYKcbuLJCBz43SQJ25yFsP11znICMnkSmQ9Ubj5II5W1Urry8')

let requests = urls.map(url => fetch(url, {
  method: 'GET',
  headers: headers
}))

var tweetDiv = document.getElementById('tweet')

let jsonData = [];
Promise.all(requests).then(responses => responses.forEach(
  response => response.json()
                      .then(responseData => jsonData.push(responseData))
))

let user
let pastTweets = []

function displayTweet() {
  // get random numbers to choose user and tweet index
  let randomUser = Math.floor(Math.random() * 2)
  let randomTweet = Math.floor(Math.random() * maxTweets)

  setTimeout(function () {
    let tweet = jsonData[randomUser][randomTweet].text
    user = jsonData[randomUser][randomTweet].user.screen_name
    let count = 0
    while ((tweet.includes("https://t.co/") || tweet.includes("@") || pastTweets.includes(tweet)) && count < maxTweets) {
      randomTweet = Math.floor(Math.random() * maxTweets)
      tweet = jsonData[randomUser][randomTweet].text
      user = jsonData[randomUser][randomTweet].user.screen_name
      count++;
    }
    let tweetElement = document.createElement('h4')
    tweetElement.setAttribute('id', 'tweet-text')
    tweetElement.textContent = tweet
    tweetDiv.appendChild(tweetElement)
  }, 2000);

  console.log(pastTweets)
}

displayTweet()

let numCorrect = 0
let numTotal = 0

var numerator = document.getElementById('num-correct')
var denominator = document.getElementById('num-total')

var numeratorValue = document.createElement('span')
numeratorValue.textContent = 0
numerator.appendChild(numeratorValue)

var denominatorValue = document.createElement('span')
denominatorValue.textContent = 0
denominator.appendChild(denominatorValue)

var count = 0
var newNumerator = document.createElement('span')
var newDenominator = document.createElement('span')

function onClick(clickedUser) {
  if (clickedUser == user) {
    numCorrect++
    if (count % 2 == 0) {
      newNumerator.textContent = numCorrect
      numerator.parentNode.replaceChild(newNumerator, numerator)
    } else {
      numerator.textContent = numCorrect
      newNumerator.parentNode.replaceChild(numerator, newNumerator)
    }

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
