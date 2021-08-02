import { IController, ConsoleRequest, ConsoleResponse, ICurrencyConverter } from '../domain/contracts'
import { Big } from 'big.js'

export class ConsoleController implements IController<ConsoleRequest, string> {

  constructor(private converter: ICurrencyConverter) { }

  async handle(req: ConsoleRequest): Promise<string> {
    const from = {
      symbol: req.args.from
    }
    const to = {
      symbol: req.args.to
    }
    const value = new Big(req.args.value)

    return String(await this.converter.convert(from, to, value))
  }
}