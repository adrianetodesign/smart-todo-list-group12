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

    // console.log(outputArr);

    const interesting = [
      'ProductModel',
      'Movie',
      'MovieSeries',
      'TVSeries',
      'Book',
      'Restaurant'
    ];

    for (let sub of outputArr) {
      for (let item of sub) {
        if (interesting.includes(item)) {
          // console.log({item});
          switch (item) {
          case 'Movie':
            return 1;
          case 'MovieSeries':
            return 1;
          case 'TVSeries':
            return 1;
          case 'Restaurant':
            return 2;
          case 'Book':
            return 3;
          case 'ProductModel':
            return 4;
          default:
            return 2;
          }
        }
      }
    }


    // types to search for are
    // ProductModel
    // Movie
    // MovieSeries
    // TVSeries
    // Book
    console.log({outputArr});


    return outputArr;
  });
};


module.exports = { classify };
