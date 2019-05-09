import { IHttp, IModify, IPersistence, IRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { CryptocompareAPI } from "./CryptocompareAPI";

export class CryptoVertConvertCommand implements ISlashCommand {
	public command = 'convert';
	public i18nParamsExample = 'convert 0.5 BTC to XMR'; 
	public i18nDescription = 'Converts between Cryptocurrencies';
	public providesPreview = false;

	constructor(private readonly getter: CryptocompareAPI) { }

	public async executor(
			context: SlashCommandContext,
			read: IRead,
			modify: IModify, 
			http: IHttp, 
			persis: IPersistence
	): Promise<void> {

		switch (context.getArguments().length) {
				case 4:
					return await this.currencyConversionHandler(context, read, modify, http, persis);
				default:
					return await this.invalidUsageHandler(context, modify);
		}
	}

	private async invalidUsageHandler(
			context: SlashCommandContext, 
			modify: IModify
	): Promise<void> {

		//TODO use enum for std messages
		await this.sendNotifyMessage(context, modify, 'Invalid usage of the convert command. ' + 
			'Please provide an amount, the currency symbol to convert FROM and the currency symbol to convert TO, e.g. 0.5 BTC to XMR')
	}

	private async currencyConversionHandler(
			context: SlashCommandContext, 
			read: IRead, 
			modify: IModify,
			http: IHttp, 
			persis: IPersistence
	): Promise<void> {

		// TODO check context arguments for correctness
		let args: any = context.getArguments();

		let data = { 
			amount: args[0],
			from: args[1].toUpperCase(),
			to: args[3].toUpperCase()
		};

		//Get the price from API
		let result = await this.getter.getPrice(http, data.from, data.to);

		//TODO enum standard messages
		if (result.Response == "Error"){
			await this.sendNotifyMessage(context, modify, result.Message ? result.Message : "Failed to fetch any trades?");

		} else {
			//convert the price to the amount
			let conversion = data.amount * result[data.to];
			let message = data.amount + " " + data.from + " is equal to \n" + conversion + " " + data.to;

			await this.sendNotifyMessage(context, modify, message);
		}
	}

	private async sendNotifyMessage(
			context: SlashCommandContext, 
			modify: IModify, 
			text: string
	): Promise<void> {

		const message = modify.getCreator()
													.startMessage()
													.setGroupable(false)
													.setRoom(context.getRoom())
													.setUsernameAlias('CryptoVert')
													.setSender(context.getSender())
													.setAvatarUrl("https://raw.githubusercontent.com/nicholasfoden/rocketchat-cryptoconvert/master/cclogo.png")
													.setText(text)
													.getMessage();

		return await modify.getNotifier().notifyRoom(context.getRoom(), message);
	}
}