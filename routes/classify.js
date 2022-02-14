const request = require('request-promise-native');

const classify = function(searchTerm) {
  const results = {};
  return requestWolframAlpha(searchTerm)
    .then(data => {
      const queryResult = JSON.parse(data).queryresult.datatypes;
      const classes = queryResult.split(',');
      return results.wolfram = classes;
    });
};

const requestWolframAlpha = function(searchTerm) {
  //  'https://api.wolframalpha.com/v2/query?appid=TY79PP-25XWKY68LE&input=the%20hobbit&output=json'
  const options = {
    uri: 'http://api.wolframalpha.com/v2/query?',
    qs: {
      appid: process.env.WOLFRAM_ALPHA,
      input: searchTerm,
      format: 'plaintext',
      output: 'json'
    }
  };

  return request(options);
};




module.exports = { classify };
