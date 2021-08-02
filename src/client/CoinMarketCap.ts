import { Big } from 'big.js'
import { ICurrencyConverterClient } from '../domain/contracts'
import { Currency } from '../domain/models'
import axios from 'axios'

export class CurrencyClient implements ICurrencyConverterClient {
  async fetch(from: Currency, to: Currency): Promise<Big> {
    // Impl
    const params = {
      symbol: from.symbol,
      convert: to.symbol,
      amount: 1
    }
    const headers = { [process.env.KEY_HEADER]: process.env.KEY }
    const baseURL = process.env.API_BASE_URL
    const url = '/tools/price-conversion'
    const { data } = await axios.request({ url, baseURL, params, headers })
    // TODO: validate
    const price = data.data[from.symbol].quote[to.symbol].price
    return new Big(price);
  }
}
