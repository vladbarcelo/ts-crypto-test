export interface IController<Request, Response> {
  handle(req: Request): Promise<Response>
}

export interface IValidator {
  reportInvalidation(message: string): void
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

export interface IModelShowable<SearchCriterion, Item> {
  first(options?: SearchCriterion): Promise<Item> | Promise<null>
}

export interface IModelListable<SearchCriterion, Item> {
  list(options?: SearchCriterion): Promise<Item[]>
}


export type CurrencySearchCriterion = {
  symbol: string
  quotes?: string[]
}

export type CurrencyItem = {
  symbol: string
  quote?: CurrencyQuote[]
}

export type CurrencyValidationData = {
  currencyToValidate: CurrencyItem,
  targetCurrency: CurrencyItem
}

type CurrencyQuote = {
  [key: string]: {
    price: number
  }
}

export interface ICurrencyModel {
  convertItems(fromCurrency: CurrencyItem, toCurrency: CurrencyItem, value: number, digits?: number): Promise<number>
}

export interface ICurrencyValidator extends IValidator {
  validateFlow(flow: string): void
  validateCurrency(data: CurrencyValidationData): void
}

export interface IRepositoryShowable<SearchCriterion, Item> {
  getItem(options?: SearchCriterion): Promise<Item> | Promise<null>
}

export interface IRepositoryListable<SearchCriterion, Item> {
  getItems(options?: SearchCriterion): Promise<Item[]>
}

export interface ICurrencyRepository {
  getItem(options?: CurrencySearchCriterion): Promise<CurrencyItem> | Promise<null>
  getItems(options?: CurrencySearchCriterion): Promise<CurrencyItem[]>
}

export interface ICacher {
  set(key: string, value: string): void
  get(key: string): string | null
  checkValidity(key: string): boolean
}

export type CacheItem = {
  tStamp: number
  value: string
}

export interface IConsoleValidator {
  validateRequest(req: ConsoleRequest): void
}