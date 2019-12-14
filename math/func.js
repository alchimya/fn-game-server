const fdk=require('@fnproject/fdk');
const fs = require('fs');

fdk.handle((input, ctx) => {

  if (!input.gameID) {
    return {
      error: "Input params are incosistent."
    };
  }
  const mathFile = "math-def/" + input.gameID + '.json';

  return new Promise((resolve, reject) => {
    fs.stat (mathFile, function(err, stats) {

      if (err || !stats) {
        reject({"error": "Math definition not found or an error occurred:" + mathFile});
      }

      fs.readFile (mathFile, (err, data) => {
        if (err) {
          reject({error: "Math definition acnnot be read."});
        }
        resolve( {
          error: null,
          mathContent: JSON.parse(data)
        });
      });

    });
  });

});