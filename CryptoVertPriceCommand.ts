import { IHttp, IModify, IPersistence, IRead, IEnvironmentRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { Messages } from "./CryptoVertStrings";
import { CryptocompareAPI } from "./CryptocompareAPI";
import { CryptoVertSettings } from "./CryptoVertSettings";
import { APIKEY } from "./devkey";

export class CryptoVertPriceCommand implements ISlashCommand {
	public command = 'price';
	public i18nParamsExample = Messages.PRICE_EXAMPLE; 
	public i18nDescription = Messages.PRICE_DESC;
	public providesPreview = false;

	constructor(private readonly api: CryptocompareAPI, public home: string) { }

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
		await this.sendNotifyMessage(context, modify, Messages.INVALID_COMMAND + Messages.PRICE_USAGE)
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
		let result = await this.api.getPrice(http, data.from, this.home);

		//TODO enum standard messages
		if (result.Response == "Error"){
			await this.sendNotifyMessage(context, modify, result.Message ? result.Message : Messages.FAILED_FETCH);

		} else {
			//convert the price to the amount
			let message = data.from + ": \n" + result[this.home] + " " + this.home;

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
													.setUsernameAlias(Messages.USERNAME)
													.setSender(context.getSender())
													.setAvatarUrl(Messages.AVATAR_URL)
													.setText(text)
													.getMessage();

		return await modify.getNotifier().notifyRoom(context.getRoom(), message);
	}
}