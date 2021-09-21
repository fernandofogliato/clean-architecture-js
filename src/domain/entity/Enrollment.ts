import Classroom from "./Classroom";
import EnrollmentCode from "./EnrollmentCode";
import Invoice, { InvoiceStatus } from "./Invoice";
import InvoiceEvent, { InvoiceEventType } from "./InvoiceEvent";
import Level from "./Level";
import Module from "./Module";
import Student from "./Student";

export enum EnrollmentStatus {
  Active,
  Cancelled
}

export default class Enrollment {
  student: Student;
  level: Level;
  module: Module;
  classroom: Classroom;
  code: EnrollmentCode;
  sequence: number;
  issueDate: Date;
  installments: number;
  invoices: Invoice[];
  status: EnrollmentStatus;

  constructor(student: Student, level: Level, module: Module, classroom: Classroom, issueDate: Date, sequence: number, installments: number = 12, status: EnrollmentStatus = EnrollmentStatus.Active) {
    if (student.getAge() < module.minimumAge) throw new Error("Student below minimum age");
    if (classroom.isFinished(issueDate)) throw new Error("Classroom is already finished");
    if (classroom.getProgress(issueDate) > 25) throw new Error("Classroom is already started");

    this.student = student;
    this.level = level;
    this.module = module;
    this.classroom = classroom;
    this.sequence = sequence;
    this.issueDate = issueDate;
    this.installments = installments;
    this.code = new EnrollmentCode(level.code, module.code, classroom.code, issueDate, sequence);
    this.invoices = this.calculateInvoice();
    this.status = status;
  }

  private calculateInvoice(): Invoice[] {
    const installmentValue = Math.round((this.module.price/this.installments) * 100) / 100;
    const totalValue = installmentValue * this.installments;
    const diff = Math.round((this.module.price - totalValue) * 100) / 100;

    const invoices = [];
    for (let installment = 1; installment <= this.installments; installment++) {            
        const value = (installment === this.installments) ? installmentValue + diff : installmentValue;
        invoices.push(new Invoice(this.code.value, installment, this.issueDate.getFullYear(), value));
    }
    return invoices;
  }

  getInvoiceBalance() {
    return this.invoices.reduce((total, invoice) => {
      total += invoice.getBalance();
      return total;
    }, 0);
  }

  getInvoice(month: number, year: number): Invoice | undefined {
    const invoice = this.invoices.find(invoice => invoice.month === month && invoice.year === year);
    return invoice;
  }

  payInvoice(month: number, year: number, amount: number, paymentDate: Date) {
    const invoice = this.getInvoice(month, year);
    if (!invoice) throw new Error("Invalid invoice");
    if (invoice.getStatus(paymentDate) === InvoiceStatus.Paid) throw new Error("Invoice already paid");

    if (invoice.getStatus(paymentDate) === InvoiceStatus.Overdue) {
      invoice.addEvent(new InvoiceEvent(InvoiceEventType.Penalty, invoice.getPenaltyAmount(paymentDate)));
      invoice.addEvent(new InvoiceEvent(InvoiceEventType.Penalty, invoice.getInterestAmount(paymentDate)));
    }
    invoice.addEvent(new InvoiceEvent(InvoiceEventType.Payment, amount));
  }
}