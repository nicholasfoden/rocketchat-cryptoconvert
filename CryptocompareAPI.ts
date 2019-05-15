import { IHttp, IModify, IPersistence, IRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISettingRead } from "@rocket.chat/apps-engine/definition/accessors/";

import { Messages } from "./CryptoVertStrings";

export class CryptocompareAPI {

    //TODO add option for different API's
    private readonly url: string = 'https://min-api.cryptocompare.com/data/';

    constructor(private key: string){      
      this.setKey(key);
    }

    public setKey(key): void {
      this.key = key;
    }

    public async getAllCoins(http: IHttp) {

      let options = {
        headers: { authorization: 'Apikey ' + this.key },
      }

      const result = await http.get(this.url + 'all/coinlist', options);

      if(result.statusCode == HttpStatusCode.OK && result.content){
        return Object.values(JSON.parse(result.content).Data).map((coin: any) => coin.Symbol); 
      }
      else {
        throw new Error(Messages.FAILED_FETCH);
      }
    }

    /**
     * Gets a price from the API for a given conversion
     * @returns Object An object containing the price for the symbols requested e.g. `{ USD: 123.45 }`
     */
    public async getPrice(
        http: IHttp, 
        from: string, 
        to: string
    ): Promise<any> { 

    	// Create options for the request
      let options = {
        headers: { authorization: 'Apikey ' + this.key },
        params: { fsym: from, tsyms:  to }
      }
 
      // Fetch the results from the API
      const result = await http.get(this.url + 'price', options);

      // Check we have a proper response 
      if (result.statusCode === HttpStatusCode.OK && result.content) {
      		console.log("result " + JSON.stringify(result));
          return JSON.parse(result.content);
          
      } else {
      		console.log("error " + JSON.stringify(result));
      		throw new Error(Messages.FAILED_FETCH);
      }
    }
}