import { IRepositoryShowable, IRepositoryListable, CurrencySearchCriterion, CurrencyItem, ICacher } from "../common/types";
import axios from 'axios'

abstract class AbstractCurrencyRepository implements IRepositoryShowable<CurrencySearchCriterion, CurrencyItem>, IRepositoryListable<CurrencySearchCriterion, CurrencyItem> {
  abstract getItems(): Promise<CurrencyItem[]>
  abstract getItem(options: CurrencySearchCriterion): Promise<CurrencyItem> | null
}

export class CurrencyRepository extends AbstractCurrencyRepository {

  constructor(private cacher: ICacher) {
    super()
  }

  async getItem(options: CurrencySearchCriterion): Promise<CurrencyItem> | null {
    let cacheString = `cr_${options.symbol}`
    if (options.quotes) {
      cacheString += `_q_${options.quotes.join('_')}`
    }
    if (this.cacher.checkValidity(cacheString)) {
      return JSON.parse(this.cacher.get(cacheString))
    } else {
      const data = await this.getItemFromAPI(options)
      this.cacher.set(cacheString, JSON.stringify(data))
      return data
    }
  }

  async getItems(): Promise<CurrencyItem[]> {
    let cacheString = `cr_list`
    if (this.cacher.checkValidity(cacheString)) {
      return JSON.parse(this.cacher.get(cacheString))
    } else {
      const data = await this.getItemsFromAPI()
      this.cacher.set(cacheString, JSON.stringify(data))
      return data
    }
  }

  async getItemsFromAPI(): Promise<CurrencyItem[]> {
    const headers = { [process.env.KEY_HEADER]: process.env.KEY }
    const baseURL = process.env.API_BASE_URL
    const url = '/cryptocurrency/map'
    const { data } = await axios.request({ url, baseURL, headers })
    return data.data
  }

  async getItemFromAPI(options: CurrencySearchCriterion): Promise<CurrencyItem> {
    const params = {
      symbol: options.symbol,
      convert: options.quotes.join(',')
    }
    const headers = { [process.env.KEY_HEADER]: process.env.KEY }
    const baseURL = process.env.API_BASE_URL
    const url = '/cryptocurrency/quotes/latest'
    const { data } = await axios.request({ url, baseURL, params, headers })
    return data.data[options.symbol]
  }
}