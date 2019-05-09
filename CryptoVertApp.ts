import { IAppAccessors, ILogger, IConfigurationExtend, IEnvironmentRead, IConfigurationModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { CryptoVertConvertCommand } from "./CryptoVertConvertCommand";
import { CryptoVertPriceCommand } from "./CryptoVertPriceCommand";
import { CryptocompareAPI } from "./CryptocompareAPI";
import { CryptoVertSettingAPIKEY } from "./CryptoVertSettingAPIKEY";

export class CryptoVertApp extends App {

    public api: CryptocompareAPI;

    constructor(
    		info: IAppInfo, 
    		logger: ILogger, 
    		accessors: IAppAccessors
    ) {
      super(info, logger, accessors);
    }

    public async initialize(
        configurationExtend: IConfigurationExtend, 
        environmentRead: IEnvironmentRead
    ): Promise<void>{
    	this.getLogger().log('initialising cryptovert');
    	await this.extendConfiguration(configurationExtend, environmentRead);
    }

    public async onEnable(
        environmentRead: IEnvironmentRead, 
        configurationModify: IConfigurationModify
    ): Promise<boolean> {

      this.api = new CryptocompareAPI(environmentRead.getSettings());
      return true;
    }

    protected async extendConfiguration(
    		configuration: IConfigurationExtend, 
    		environmentRead: IEnvironmentRead
    ): Promise<void> {

      await configuration.settings.provideSetting(CryptoVertSettingAPIKEY);
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertConvertCommand(this.api));
    	await configuration.slashCommands.provideSlashCommand(new CryptoVertPriceCommand(this.api));
    }

    /**
     * When we edit the settings 
     */
    public async onSettingUpdated(
        setting: ISetting, 
        configurationModify: IConfigurationModify,
        read: IRead
    ): Promise<void>{

      switch (setting.id){
        case "APIKEY": { // Api key:  we create a new API with the new key

          if (setting.value) {
            await configurationModify.slashCommands.enableSlashCommand('convert');
            await configurationModify.slashCommands.enableSlashCommand('price');
            this.api = new CryptocompareAPI(read.getEnvironmentReader().getSettings());
          } 
          else {
            await configurationModify.slashCommands.disableSlashCommand('convert');
            await configurationModify.slashCommands.disableSlashCommand('price');
          }
          
        }
      }

    }
}
