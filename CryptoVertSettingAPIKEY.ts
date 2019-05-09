import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const CryptoVertSettingAPIKEY: ISetting = {

	id : "APIKEY",
	type: SettingType.STRING,
	packageValue : "", //default value
	value: "",
	public : false, // can standard users see it
	i18nLabel : "Cryptocompare API Key",
	i18nDescription : "Please enter a valid cryptocompare API key (You can get one from https://min-api.cryptocompare.com/)",
	required : true,

}

