const fdk=require('@fnproject/fdk');
const MersenneTwister = require('mersenne-twister');
const generator = new MersenneTwister();

fdk.handle(function(input, ctx){
  //returns an object with a number between the interval [0, 2147483647]
  return {number: generator.random_int31()};
});
