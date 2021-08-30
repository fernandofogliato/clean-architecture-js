import Classroom from "./Classroom";
import EnrollmentCode from "./EnrollmentCode";
import Invoice from "./Invoice";
import Level from "./Level";
import Module from "./Module";
import Student from "./Student";

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

  constructor (student: Student, level: Level, module: Module, classroom: Classroom, issueDate: Date, sequence: number, installments: number = 12) {
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
  }

  private calculateInvoice(): Invoice[] {
    const installmentValue = Math.round((this.module.price/this.installments) * 100) / 100;
    const totalValue = installmentValue * this.installments;
    const diff = Math.round((this.module.price - totalValue) * 100) / 100;

    const invoices = [];
    for (let installment = 1; installment <= this.installments; installment++) {            
        const value = (installment === this.installments) ? installmentValue + diff : installmentValue;
        invoices.push(new Invoice(installment, value));
    }
    return invoices;
  }
}