import { IModelShowable, IModelListable, CurrencySearchCriterion, CurrencyItem, ICurrencyValidator, ICurrencyRepository } from '../common/types'


abstract class AbstractCurrencyModel implements IModelShowable<CurrencySearchCriterion, CurrencyItem>, IModelListable<CurrencySearchCriterion, CurrencyItem> {
  abstract first(options: CurrencySearchCriterion): Promise<CurrencyItem> | Promise<null>
  abstract list(options?: CurrencySearchCriterion): Promise<CurrencyItem[]>
}

export class CurrencyModel extends AbstractCurrencyModel {
  constructor(private validator: ICurrencyValidator, private repository: ICurrencyRepository) {
    super()
  }

  async first(options: CurrencySearchCriterion): Promise<CurrencyItem> | null {
    return await this.repository.getItem(options)
  }

  async list(options?: CurrencySearchCriterion): Promise<CurrencyItem[]> {
    return await this.repository.getItems(options)
  }

  async establishConvertFlow(currencyA: CurrencyItem, currencyB: CurrencyItem): Promise<string> {
    const currencies = await this.list()

    for (let currency of currencies) {
      if (currency.symbol === currencyA.symbol) {
        return 'regular'
      }
      if (currency.symbol === currencyB.symbol) {
        return 'reversed'
      }
    }
    this.validator.reportInvalidation(`Please check your currency list. Neither ${currencyA.symbol} nor ${currencyB.symbol} were identified as valid cryptocurrencies.`)
  }

  calculate(flow: string, rate: number, value: number, digits: number): number {
    this.validator.validateFlow(flow)
    let result = 0
    if (flow === 'regular') {
      result = value * rate
    } else if (flow === 'reversed') {
      result = value / rate
    }
    return Number(result.toFixed(digits))
  }

  async convertItems(fromCurrency: CurrencyItem, toCurrency: CurrencyItem, value: number, digits: number): Promise<number> {
    // Which one is the crypto?
    const flow = await this.establishConvertFlow(fromCurrency, toCurrency)
    if (flow === 'reversed') {
      [fromCurrency, toCurrency] = [toCurrency, fromCurrency]
    }
    const options = { symbol: fromCurrency.symbol, quotes: [toCurrency.symbol] }
    const currency = await this.first(options)
    this.validator.validateCurrency({ currencyToValidate: currency, targetCurrency: toCurrency })
    const rate = currency.quote[toCurrency.symbol].price

    return this.calculate(flow, rate, value, digits)
  }
}