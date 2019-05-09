import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export class CryptoVertSettingAPI implements ISetting {

	public id = "APIKEY";
	public type: SettingType = SettingType.STRING
	public packageValue = ""; //default value
	public public = false; // can standard users see it
	public i18nLabel = "Cryptocompare API Key"
	public i18nDescription = "Please enter a valid cryptocompare API key (You can get one from https://min-api.cryptocompare.com/)"
	public required = true;

	constructor(){}



}