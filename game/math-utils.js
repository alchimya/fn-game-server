const request = require('request');
const NodeCache = require('node-cache');
const nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
class MathUtils {
    static getMathDefinition (fnServerIp, gameID, callback) {
        //get game math def from cache if exists, otherwise load from service and store into cache
        nodeCache.get( gameID, function( cacheErr, mathDefCached ){
            if( !cacheErr ){
                if(mathDefCached === undefined){
                    // key not found, so call the service
                    request.post(`http://${fnServerIp}:8080/t/fn-game-server/math`, {json: {gameID: gameID}}, (mathError, mathRes, mathBody) => {
                        if (mathError || !mathBody || !mathBody.mathContent) {
                            callback ({mathContent: null});
                        } else {
                            nodeCache.set(gameID, mathBody.mathContent);
                            callback ({mathContent: mathBody.mathContent, cached: false});
                        }
                    })
                }else{
                    callback ({mathContent: mathDefCached, cached: true});
                }
            }
        });
    }
}
module.exports = MathUtils;




