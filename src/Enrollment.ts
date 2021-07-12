import Student from "./Student";

export default class Enrollment {
  id: string;
  student: Student;
  level: string;
  module: string;
  classEnroll: string;
  sequence: string;

  constructor(student: Student, level: string, module: string, classEnroll: string, sequence: number) {
    this.student = student;
    this.level = level;
    this.module = module;
    this.classEnroll = classEnroll;
    this.sequence = sequence.toString().padStart(4, '0');
    this.id = new Date().getFullYear().toString().concat(this.level)
      .concat(this.module).concat(this.classEnroll).concat(this.sequence);
  }
}