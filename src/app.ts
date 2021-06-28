require('dotenv').config()
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import { CurrencyClient } from './client/CoinMarketCap'
import { CurrencyConverter } from "./use-case/CurrencyConverter"
import { ConsoleController } from './controller/Console'

(async () => {
  const client = new CurrencyClient();
  const converter = new CurrencyConverter(client)
  const controller = new ConsoleController(converter)
  const args = yargs(hideBin(process.argv)).argv
  const result = await controller.handle({ args })
  console.log(result)
})()