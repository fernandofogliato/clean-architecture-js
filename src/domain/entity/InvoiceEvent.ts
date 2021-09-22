export enum InvoiceEventType {
  Payment = 'Payment',
  Penalty = 'Penalty',
  Interest = 'Interest'
}

export default class InvoiceEvent {
  type: InvoiceEventType;
  amount: number;

  constructor(type: InvoiceEventType, amount: number) {
    this.type = type;
    this.amount = amount;
  }
}