require('dotenv').config()
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import { ConsoleController } from './controllers/Console'
import { CurrencyModel } from './models/Currency'
import { CurrencyConversionRepository } from './repositories/Currency'
import { ValidationError, CurrencyValidator, ConsoleRequestValidator } from './services/Validator'
import { Cacher } from './services/Cacher'


(async () => {
  const cacher = new Cacher()
  try {
    const currencyValidator = new CurrencyValidator()
    const consoleReqValidator = new ConsoleRequestValidator()
    const currencyRepo = new CurrencyConversionRepository(cacher)
    const currencyModel = new CurrencyModel(currencyValidator, currencyRepo)
    const consoleController = new ConsoleController(currencyModel, consoleReqValidator)
    const args = yargs(hideBin(process.argv)).argv
    const { output } = await consoleController.handle({ args })
    console.log(output)
  } catch (e) {
    if (e instanceof ValidationError) {
      console.warn(`Validation failed: ${e.message}`)
    } else {
      cacher.invalidateAll()
      console.error(e.message)
    }
  }
})()