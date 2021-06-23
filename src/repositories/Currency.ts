import { IRepositoryShowable, IRepositoryListable, CurrencySearchCriterion, CurrencyItem, ICacher, CurrencyConvertOptions } from "../common/types";
import axios from 'axios'

abstract class AbstractCurrencyConversionRepository implements IRepositoryShowable<CurrencyConvertOptions, CurrencyItem>, IRepositoryListable<CurrencyConvertOptions, CurrencyItem> {
  abstract getItems(): Promise<CurrencyItem[]>
  abstract getItem(options: CurrencySearchCriterion): Promise<CurrencyItem> | null
}

export class CurrencyConversionRepository extends AbstractCurrencyConversionRepository {

  constructor(private cacher: ICacher) {
    super()
  }

  async getItem(options: CurrencyConvertOptions): Promise<CurrencyItem> | null {
    let cacheString = `cr_${options.symbol}_q_${options.convert.join('_')}`
    if (this.cacher.checkValidity(cacheString)) {
      return JSON.parse(this.cacher.get(cacheString))
    } else {
      const data = await this.getItemFromAPI(options)
      this.cacher.set(cacheString, JSON.stringify(data))
      return data
    }
  }

  async getItems(): Promise<CurrencyItem[]> {
    return []
  }

  async getItemFromAPI(options: CurrencyConvertOptions): Promise<CurrencyItem> {
    const params = {
      symbol: options.symbol,
      convert: options.convert.join(','),
      amount: options.amount
    }
    const headers = { [process.env.KEY_HEADER]: process.env.KEY }
    const baseURL = process.env.API_BASE_URL
    const url = '/tools/price-conversion'
    const { data } = await axios.request({ url, baseURL, params, headers })
    return data.data[options.symbol]
  }
}