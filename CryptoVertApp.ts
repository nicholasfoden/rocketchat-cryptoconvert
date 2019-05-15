import { IAppAccessors, ILogger, IHttp, IConfigurationExtend, IEnvironmentRead, IConfigurationModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { CryptoVertConvertCommand } from "./CryptoVertConvertCommand";
import { CryptoVertPriceCommand } from "./CryptoVertPriceCommand";
import { CryptocompareAPI } from "./CryptocompareAPI";
import { CryptoVertSettings } from "./CryptoVertSettings";
import { Messages } from "./CryptoVertStrings";

export class CryptoVertApp extends App {

    public api: CryptocompareAPI;
    public allcoins: Array<string>;

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


      this.api = new CryptocompareAPI("");
      this.allcoins = await this.api.getAllCoins(this.getAccessors().http);

    	await this.extendConfiguration(configurationExtend, environmentRead);

    }

    // public async onEnable(
    //     environmentRead: IEnvironmentRead, 
    //     configurationModify: IConfigurationModify,  
    // ): Promise<boolean> {
      
      
    //   return true;
    // }

    protected async extendConfiguration(
    		configuration: IConfigurationExtend, 
    		environmentRead: IEnvironmentRead
    ): Promise<void> {

      await configuration.settings.provideSetting(CryptoVertSettings.APIKEY);
      await configuration.settings.provideSetting(CryptoVertSettings.HOMECURRENCY);

    	await configuration.slashCommands.provideSlashCommand(new CryptoVertConvertCommand(
        this.api, await environmentRead.getSettings().getValueById(CryptoVertSettings.HOMECURRENCY.id))
      );

    	await configuration.slashCommands.provideSlashCommand(new CryptoVertPriceCommand(
        this.api, await environmentRead.getSettings().getValueById(CryptoVertSettings.HOMECURRENCY.id))
      );

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

        case CryptoVertSettings.APIKEY.id: { // APIKEY:  we update the api key in the API

              if (setting.value && typeof setting.value === 'string' && setting.value.length == 64) {
                await configurationModify.slashCommands.enableSlashCommand('convert');
                await configurationModify.slashCommands.enableSlashCommand('price');
                //update the API key
                this.api.setKey(setting.value);
              } 
              else {
                this.getLogger().log(Messages.DISABLED_COMMANDS + setting.id);
                await configurationModify.slashCommands.disableSlashCommand('convert');
                await configurationModify.slashCommands.disableSlashCommand('price');
              }
        }
        case CryptoVertSettings.HOMECURRENCY.id: { // DEFAULT CURRENCY: we issue a new command with the new currency 

             if (setting.value && typeof setting.value === 'string' && this.allcoins.includes(setting.value.toUpperCase())){
               let update = setting.value.toUpperCase();

               await configurationModify.slashCommands.modifySlashCommand(
                 new CryptoVertConvertCommand(this.api, update));

               await configurationModify.slashCommands.modifySlashCommand(
                 new CryptoVertPriceCommand(this.api, update));

             }
             else {
               this.getLogger().log(Messages.DISABLED_COMMANDS + setting.id);
               await configurationModify.slashCommands.disableSlashCommand('convert');
               await configurationModify.slashCommands.disableSlashCommand('price');
             }
         }
      }

    }
}
