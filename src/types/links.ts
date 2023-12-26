export interface LinksData {
  linkUrl: string
  pageUrl: string
  linkText: string
  noFollow: number
  //  noIndex: number;
  dateFrom: string
  dateTo: string
  ip: string[]
  ipString: string
  qty: number
  linkUrlShort: string
  pageUrlShort: string
  linkTextShort: string
}

export interface FilterData {
  name: string
  val: string
  kind: string
}
