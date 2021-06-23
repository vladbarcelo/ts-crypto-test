import { CurrencyValidationData, IValidator, ConsoleRequest } from "../common/types";

export class ValidationError extends Error { }

abstract class Validator implements IValidator {
  reportInvalidation(message: string): void {
    throw new ValidationError(message)
  }
}

export class CurrencyValidator extends Validator {
  validateCurrency(data: CurrencyValidationData): void {
    if (!data.currencyToValidate.hasOwnProperty('quote')) {
      this.reportInvalidation(`Currency ${data.currencyToValidate.symbol} has no 'quote' prop.`)
    }
    if (!data.currencyToValidate.quote.hasOwnProperty(data.targetCurrency.symbol)) {
      this.reportInvalidation(`Currency ${data.currencyToValidate.symbol} has no information regarding change rate to ${data.targetCurrency.symbol}.`)
    }
    if (!data.currencyToValidate.quote[data.targetCurrency.symbol].hasOwnProperty('price')) {
      this.reportInvalidation(`Currency ${data.currencyToValidate.symbol} has no defined change rate to ${data.targetCurrency.symbol}.`)
    }
  }

  validateFlow(flow: string): void {
    if (!['regular', 'reversed'].includes(flow)) {
      this.reportInvalidation(`Unexpected flow: ${flow}`)
    }
  }
}

export class ConsoleRequestValidator extends Validator {
  validateRequest(req: ConsoleRequest): void {
    for (let requiredArg of ['from', 'to', 'value']) {
      if (!req.args.hasOwnProperty(requiredArg)) {
        this.reportInvalidation(`Argument '${requiredArg}' is required.`)
      }
    }
  }
}