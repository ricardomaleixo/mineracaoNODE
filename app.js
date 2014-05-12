var https = require('https'),
    cheerio = require('cheerio');

function minerarDados(body){
  var $ = cheerio.load(body);
  var scores = $('title')
    .map(function(index, node) {
      return $(node).text().toLowerCase().match(/([a-z]+)/g);
    })
    .reduce(function(last, now){
      return last.concat(now)
    }, [])
    .reduce(function(last, now){
      var index = last[0].indexOf(now);
      if (index === -1) {
        last[0].push(now);
        last[1].push(1);
      } else {
        last[1][index] += 1;
      }
      return last;
    }, [[], []]);
  var zip = [];
  scores[0].forEach(function(word, i) {
    zip.push([word, scores[1][i]])
  });
  var filtered = zip.filter(function (element){
    return element[1] >= 10
  });
  console.log(filtered.slice(0,20));
}

function getCallback(response){
  var body = '';
  console.log("Got response: " + response.statusCode);
  response.on('data', function (chunk) {
    body += chunk;
  });
  response.on('end', function(){
    minerarDados(body);
  });
}

https.get('https://news.ycombinator.com/bigrss', getCallback)
  .on('error', function(e){
    console.log("Ocorreu um erro: " + e.message);
  });
