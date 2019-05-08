import { IAppAccessors, ILogger, IConfigurationExtend, IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { CryptoVertConvertCommand } from "./CryptoVertConvertCommand";
import { CryptoVertPriceCommand } from "./CryptoVertPriceCommand";
import { CryptocompareAPI } from "./CryptocompareAPI";

export class CryptoVertApp extends App {

    constructor(
    		info: IAppInfo, 
    		logger: ILogger, 
    		accessors: IAppAccessors
    ) {
      super(info, logger, accessors);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void>{
    	this.getLogger().log('initialising cryptovert');
    	await this.extendConfiguration(configurationExtend, environmentRead);
    }

    protected async extendConfiguration(
    		configuration: IConfigurationExtend, 
    		environmentRead: IEnvironmentRead
    ): Promise<void> {
    	console.log("extendConfiguration")
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertConvertCommand(new CryptocompareAPI));
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertPriceCommand(new CryptocompareAPI));
    }

    //TODO add settings for API key

}
