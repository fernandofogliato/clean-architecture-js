import moment from "moment";
import InvoiceEvent, { InvoiceEventType } from "./InvoiceEvent";

export enum InvoiceStatus {
  Open,
  Overdue,
  Paid
}

export default class Invoice {
  code: string;
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  events: InvoiceEvent[];

  constructor(code: string, month: number, year: number, amount: number) {
    this.code = code;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.dueDate = new Date(year, month, 5);
    this.events = [];
  }

  addEvent(invoiceEvent: InvoiceEvent) {
    this.events.push(invoiceEvent);
  }

  getBalance() {
    return this.events.reduce((total, event) => {
      if (event.type === InvoiceEventType.Payment) {
        total -= event.amount;   
      } else {
        total += event.amount;
      }      
      return total;
    }, this.amount);
  }

  clone() {
    return JSON.parse(JSON.stringify(this));
  }

  get status(): InvoiceStatus {
    if (moment().isAfter(this.dueDate)) {
      return InvoiceStatus.Overdue;
    }
    if (this.events.some(event => event.type === InvoiceEventType.Payment)) {
      return InvoiceStatus.Paid;
    }
    return InvoiceStatus.Open;
  }

  get penaltyAmount(): number {
    if (this.status === InvoiceStatus.Overdue) {
      return Math.trunc(this.amount * 0.10 * 100) / 100;
    }
    return 0.
  }

  get interestAmount(): number {
    if (this.status === InvoiceStatus.Overdue) {
      const diff = moment().diff(this.dueDate, 'days') / 100;
      return Math.trunc(this.amount * diff * 100) / 100;
    }
    return 0;
  }
}