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

  calculateConversion(rate: number, value: number, digits: number): number {
    const result = value * rate
    return Number(result.toFixed(digits))
  }

  async convertItems(fromCurrency: CurrencyItem, toCurrency: CurrencyItem, value: number, digits: number): Promise<number> {
    const options = { symbol: fromCurrency.symbol, convert: [toCurrency.symbol], amount: value }
    const sourceCurrencyData = await this.first(options)
    this.validator.validateCurrency({ currencyToValidate: sourceCurrencyData, targetCurrency: toCurrency })
    const conversionRate = sourceCurrencyData.quote[toCurrency.symbol].price

    return this.calculateConversion(conversionRate, value, digits)
  }
}