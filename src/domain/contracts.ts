// import Big from 'big.js';
import { Big } from 'big.js'
import { Currency } from './models'


export interface ICurrencyConverter {
  convert(from: Currency, to: Currency, value: Big): Promise<Big>
}

export interface ICurrencyConverterClient {
  fetch(from: Currency, to: Currency): Promise<Big>
}

export interface IController<Request, Response> {
  handle(req: Request): Promise<Response>
}

export type ConsoleRequest = {
  args: {
    from: string,
    to: string
    value: string
    digits?: string
  }
}

export type ConsoleResponse = {
  output: string | null
}

export interface ICacheRepository<DataType> {
  get(key: string): Promise<DataType>
  set(key: string, value: DataType): Promise<DataType>
  exists(key: string): Promise<boolean>
}