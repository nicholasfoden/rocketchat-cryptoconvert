import { IHttp, IModify, IPersistence, IRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { CryptocompareAPI } from "./CryptocompareAPI";
import { APIKEY } from "./devkey";

export class CryptoVertPriceCommand implements ISlashCommand {
	public command = 'price';
	public i18nParamsExample = 'price BTC'; 
	public i18nDescription = 'Gets the dollar value of a currency';
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
				case 1:
					return await this.priceHandler(context, read, modify, http, persis);
				default:
					return await this.invalidUsageHandler(context, modify);
		}
	}

	private async invalidUsageHandler(
			context: SlashCommandContext, 
			modify: IModify
	): Promise<void> {

		//TODO use enum for std messages
		await this.sendNotifyMessage(context, modify, 'Invalid usage of the price command. ' + 
			'Please provide the currency symbol to fetch e.g. XMR')
	}

	private async priceHandler(
			context: SlashCommandContext, 
			read: IRead, 
			modify: IModify,
			http: IHttp, 
			persis: IPersistence
	): Promise<void> {

		// TODO check context arguments for correctness
		let args: any = context.getArguments();

		let data = { 
			from: args[0].toUpperCase(),
		};

		//Get the price from API
		let result = await this.getter.getPrice(http, data.from, "USD", APIKEY);

		//TODO enum standard messages
		if (result.Response == "Error"){
			await this.sendNotifyMessage(context, modify, result.Message ? result.Message : "Failed to fetch any trades?");

		} else {
			//convert the price to the amount
			let message = data.from + ": \n" + result["USD"] + " USD";

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
													.setText(text)
													.setUsernameAlias('CryptoVert')
													.setRoom(context.getRoom())
													.setSender(context.getSender())
													.getMessage();

		return await modify.getNotifier().notifyRoom(context.getRoom(), message);
	}
}