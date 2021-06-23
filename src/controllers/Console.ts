import { IController, ConsoleRequest, ConsoleResponse, ICurrencyModel, IConsoleValidator } from '../common/types'

abstract class AbstractConsoleController implements IController<ConsoleRequest, ConsoleResponse> {
  abstract handle(req: ConsoleRequest): Promise<ConsoleResponse>
}

export class ConsoleController extends AbstractConsoleController {
  constructor(private currencyModel: ICurrencyModel, private validator: IConsoleValidator) {
    super()
  }
  async handle(req: ConsoleRequest): Promise<ConsoleResponse> {
    this.validator.validateRequest(req)
    let res = { output: '' }
    const fromCurrency = {
      symbol: req.args.from
    }
    const toCurrency = {
      symbol: req.args.to
    }
    const value = Number(req.args.value)
    const digitsArg = req.args.digits
    let digits = 2
    if (digitsArg !== undefined) {
      digits = Number(digitsArg)
    }
    res.output = String(await this.currencyModel.convertItems(fromCurrency, toCurrency, value, digits))

    return res
  }
}