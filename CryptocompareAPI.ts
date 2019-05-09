import { IHttp, IModify, IPersistence, IRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISettingRead } from "@rocket.chat/apps-engine/definition/accessors/";

export class CryptocompareAPI {

    //TODO add option for different API's
    private readonly url: string = 'https://min-api.cryptocompare.com/data/price';
    private key: string;

    constructor(private settings: ISettingRead){
      this.setupKey(settings);
      
    }
    /**
     *  Sets the key based on the APP settings
     * @param settings ISettingRead accessor (can be got from environmentRead)
     */
    private async setupKey(settings: ISettingRead){
      this.key = await settings.getValueById("APIKEY")

    }

    /**
     * Gets a price from the API for a given conversion
     * @returns Object An object containing the price for the symbols requested
     */
    public async getPrice(
        http: IHttp, 
        from: string, 
        to: string
    ): Promise<any> { 

    	// Create options for the request
      let options = {
        header: { authorization: 'Apikey ' + this.key },
        params: { fsym: from, tsyms:  to }
      }

      // Fetch the results from the API
      const result = await http.get(this.url, options);

      // Check we have a proper response 
      if (result.statusCode === HttpStatusCode.OK && result.content) {
      		console.log("result " + JSON.stringify(result));
          return JSON.parse(result.content);
          
      } else {
      		console.log("error " + JSON.stringify(result));
      		throw new Error("Failed to fetch any trades")
      }
    }
}