const fdk=require('@fnproject/fdk');
const request = require('request');
const MathUtils = require('./math-utils');

fdk.handle(function(input, ctx){

    if (!input.gameID || !input.bet || !input.betSymbol ) {
        return {
            error: "Input params are incosistent."
        };
    }
    const fn_server_ip = ctx._config.FNSERVER_IP ? ctx._config.FNSERVER_IP : "docker.for.mac.localhost";
    return new Promise((resolve, reject) => {

        MathUtils.getMathDefinition(fn_server_ip, input.gameID, (ret) => {
            if (ret.mathContent) {
                request(`http://${fn_server_ip}:8080/t/fn-game-server/rng`, (rngError, rngRes, rngBody) => {
                    const rngNumber = JSON.parse(rngBody).number;

                    if (rngError || !rngBody || ! rngNumber) {
                        reject({error: rngError});
                    }

                    //get the symbol stop by nomralization of the the rng result
                    const wheelStop = (rngNumber % ret.mathContent.game.wheel.items.length);
                    //get the symbol name
                    const symbolName = ret.mathContent.game.wheel.items[wheelStop].toString();

                    let win = 0;
                    if (symbolName === input.betSymbol) {
                        //get the symbol item
                        const symbol = ret.mathContent.game.symbols.filter (function (item){
                            return item.name === symbolName;
                        });
                        if (symbol.length > 0) {
                            //calculate the bet as bet * symbols pays
                            win = input.bet * symbol[0].pays;
                        }
                    }
                    resolve (
                        {
                            bet: input.bet,
                            betSymbol: input.betSymbol,
                            symbol: symbolName,
                            win: win,
                            wheelStop: wheelStop,
                            cached: ret.cached
                        }
                    );

                });
            } else {
                reject({error: "Error in math definition"});
            }
        });

    });
});