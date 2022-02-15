const request = require('request-promise-native');

const classify = function(searchTerm) {
  // return requestWolframAlpha(searchTerm);
  return requestGoogle(searchTerm);

};

/* *
* const requestWolframAlpha = function(searchTerm) {
*  //  'https://api.wolframalpha.com/v2/query?appid=TY79PP-25XWKY68LE&input=the%20hobbit&output=json'
*  const options = {
*    uri: 'http://api.wolframalpha.com/v2/query?',
*    qs: {
*      appid: process.env.WOLFRAM_ALPHA,
*      input: searchTerm,
*      format: 'plaintext',
*      output: 'json'
*    }
*  };
*
*  return request(options).then(data => {
*    const queryResult = JSON.parse(data).queryresult.datatypes;
*    const classes = queryResult.split(',');
*    return classes;
*  });
* };
* */

const requestGoogle = function(searchTerm) {
  const options = {
    uri: 'https://kgsearch.googleapis.com/v1/entities:search?',
    qs: {
      key: process.env.GOOGLE,
      query: searchTerm,
      limit: 3,
    }
  };

  return request(options).then(data => {
    const outputArr = [];
    const results = JSON.parse(data).itemListElement;
    results.forEach(result => outputArr.push(result.result['@type']));

    return outputArr;
  });
};


module.exports = { classify };
