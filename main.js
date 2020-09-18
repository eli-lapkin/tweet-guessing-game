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

var app = document.getElementById('tweet')

let jsonData = [];
Promise.all(requests).then(responses => responses.forEach(
  response => response.json()
                      .then(responseData => jsonData.push(responseData))
))

// get random numbers to choose user and tweet index
let randomUser = Math.floor(Math.random() * 2)
let randomTweet = Math.floor(Math.random() * maxTweets)

setTimeout(function () {
  let tweet = jsonData[randomUser][randomTweet].text
  let user = jsonData[randomUser][randomTweet].user.screen_name
  let count = 0
  while ((tweet.includes("https://t.co/") || tweet.includes("@")) && count < maxTweets) {
    randomTweet = Math.floor(Math.random() * maxTweets)
    tweet = jsonData[randomUser][randomTweet].text
    user = jsonData[randomUser][randomTweet].user.screen_name
    count++;
  }
  let tweetElement = document.createElement('h4')
  tweetElement.textContent = tweet
  app.appendChild(tweetElement)
  console.log(user)
}, 2000);
