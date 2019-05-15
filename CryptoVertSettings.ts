import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { Messages } from "./CryptoVertStrings";

export namespace CryptoVertSettings {


		// The cryptocompare api key setting
		export const APIKEY: ISetting = {

			id : "APIKEY",
			type: SettingType.STRING,
			packageValue : "", //default value
			value: "",
			public : false, // can standard users see it
			i18nLabel : Messages.API,
			i18nDescription : Messages.API_DESC,
			required : true,

		}


		// Which currency to use as default
		export const HOMECURRENCY = {

			id : "HOME",
			type: SettingType.STRING,
			packageValue : "USD", //default value
			value: "USD",
			public : false, // can standard users see it
			i18nLabel : Messages.HOME,
			i18nDescription : Messages.HOME_DESC,
			required : true,

		}

}

