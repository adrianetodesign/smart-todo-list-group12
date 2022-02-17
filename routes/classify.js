const request = require('request-promise-native');

const classify = function(searchTerm) {
  // return requestWolframAlpha(searchTerm);
  return requestGoogle(searchTerm);
  // return requestYelp(searchTerm);
};

const requestYelp = function(searchTerm) {
  console.log('Yelp is being called');
  const options = {
    uri: 'https://api.yelp.com/v3/businesses/search?',
    headers: {
      Authorization: `Bearer ${process.env.YELP}`
    },
    qs: {
      term: searchTerm,
      location: 'Vancouver',
      categories: 'restaurants',
      // eslint-disable-next-line camelcase
      sort_by: 'best_match',
      limit: 3
    }
  };

  return request(options).then(data => {
    const regex = new RegExp(`${searchTerm}`, 'i');
    const obj = JSON.parse(data);
    for (let searchResult of obj.businesses) {
      if (regex.test(searchResult.name)) {
        console.log(searchResult.name);
        return { classNumber: 2, className: 'restaurants'};
      }
    }
    return { classNumber: 4, className: 'products'};
  });
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
      limit: 10,
    }
  };

  return request(options).then(data => {
    const outputArr = [];
    const results = JSON.parse(data).itemListElement;
    results.forEach(arrItem => outputArr.push(arrItem.result['@type']));
    console.log({outputArr});

    const interesting = [
      'ProductModel',
      'Movie',
      'MovieSeries',
      'TVSeries',
      'Book',
      'BookSeries',
      'Restaurant',
    ];

    const getClass = function(classNumber) {
      switch (classNumber) {
      case 1:
        return { classNumber, className: 'film'};
      case 2:
        return { classNumber, className: 'restaurants'};
      case 3:
        return { classNumber, className: 'books'};
      case 4:
        return { classNumber, className: 'products'};
      }
    };

    for (let sub of outputArr) {
      for (let item of sub) {
        if (interesting.includes(item)) {
          switch (item) {
          case 'Movie':
            return getClass(1);
          case 'MovieSeries':
            return getClass(1);
          case 'TVSeries':
            return getClass(1);
          case 'Restaurant':
            return getClass(2);
          case 'Book':
            return getClass(3);
          case 'BookSeries':
            return getClass(3);
          case 'ProductModel':
            return getClass(4);
          }
        }
      }
    }
    return requestYelp(searchTerm);
  });
};


module.exports = { classify };
