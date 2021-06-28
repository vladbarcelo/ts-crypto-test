import { ICurrencyConverter, ICurrencyConverterClient, ICacheRepository } from '../domain/contracts'
import { Currency } from '../domain/models'
import { Big } from 'big.js'

export class CurrencyConverter implements ICurrencyConverter {

  constructor(public client: ICurrencyConverterClient) { }

  async convert(from: Currency, to: Currency, value: Big): Promise<Big> {
    const price = await this.client.fetch(from, to)
    const result = price.mul(value)
    const resultWithFee = result.mul(1.05)

    return resultWithFee
  }
}

export class CacheableCurrencyConverter extends CurrencyConverter {

  constructor(public client: ICurrencyConverterClient, public repo: ICacheRepository<Big>) {
    super(client)
  }

  async convert(from: Currency, to: Currency, value: Big): Promise<Big> {
    const key = `${from.symbol}_${to.symbol}`
    let result
    if (this.repo.exists(key)) {
      result = await this.repo.get(key)
    } else {
      result = await super.convert(from, to, value)
      await this.repo.set(key, result)
    }

    return result
  }
}