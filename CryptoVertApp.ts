import { IAppAccessors, ILogger, IConfigurationExtend, IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { CryptoVertConvertCommand } from "./CryptoVertConvertCommand";
import { CryptoVertPriceCommand } from "./CryptoVertPriceCommand";
import { CryptocompareAPI } from "./CryptocompareAPI";
import { CryptoVertSettingAPI } from "./CryptoVertSettingAPI";

export class CryptoVertApp extends App {

    public api: CryptocompareAPI;

    constructor(
    		info: IAppInfo, 
    		logger: ILogger, 
    		accessors: IAppAccessors
    ) {
      super(info, logger, accessors);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void>{
    	this.getLogger().log('initialising cryptovert');
        this.api = new CryptocompareAPI(environmentRead.getSettings())
    	await this.extendConfiguration(configurationExtend, environmentRead);
    }

    protected async extendConfiguration(
    		configuration: IConfigurationExtend, 
    		environmentRead: IEnvironmentRead
    ): Promise<void> {
        await configuration.settings.provideSetting(new CryptoVertSettingAPI());
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertConvertCommand(this.api));
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertPriceCommand(this.api));
    }
}
