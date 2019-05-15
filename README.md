# rocketchat-cryptoconvert
rocket.chat app to convert between cryptocurrencies using the cryptocompare API

## Getting started

+ enable development mode in Administration > General > Apps
+ Using `rc-apps deploy` deploy the app to your dev server
+ You will need to enter a cryptocompare API key into the app settings  

> get one free from min-api.cryptocompare.com

## Usage

There are 2 command which this app registers:

+ `/price` fetches the price for a given symbol e.g. `/price BTC` 
+ you can fetch multiple prices for a symbol e.g. `/price BTC in XMR USD`...

+ `/convert` converts between to currencies for example `/convert 1 BTC to XMR`



## Powered by 
![Cryptocompare](https://www.cryptocompare.com/media/35264254/72_horizontal_fullcolour_darkblueflashgreen.png "Cryptocompare")
