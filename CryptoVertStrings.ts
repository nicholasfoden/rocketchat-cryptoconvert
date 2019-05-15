export enum Messages {

	USERNAME					= 'Cryptovert',
	AVATAR_URL				= "https://raw.githubusercontent.com/nicholasfoden/rocketchat-cryptoconvert/master/cclogo.png",
	INVALID_COMMAND 	= 'Invalid usage of the command. ',
	DISABLED_COMMANDS = 'Disabling commands due to invalid setting: ',
	CONVERT_USAGE 		= 'Please provide an amount, the currency symbol to convert FROM and the currency symbol to convert TO, e.g. `convert 0.5 BTC to XMR` or `/convert 1 BTC XMR` or to use the default currency `2 BTC`',
	CONVERT_EXAMPLE		= '/convert 0.5 BTC to XMR',
	CONVERT_DESC			= 'Converts between Cryptocurrencies',
	PRICE_USAGE 			= 'Please provide the currency symbol to fetch e.g. "/price XMR" or for multiple symbols "/price XMR in USD BTC"',
	PRICE_EXAMPLE			= '/price BTC',
	PRICE_DESC				= 'Gets the value of a symbol in the home currency',
	FAILED_FETCH			= 'Failed to fetch any data',
	EQUAL							= ' is equal to: ',
	API								= 'Cryptocompare API Key',
	API_DESC					= 'You can get one from min-api.cryptocompare.com/',
	HOME							= 'Default currency',
	HOME_DESC					= 'The default currency to convert to -- default: USD' //TODO after convert args parsing use this for no currency provided



}