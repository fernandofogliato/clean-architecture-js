import Enrollment from "./Enrollment";
import Student from "./Student";

export default class EnrollStudent {

  private enrollments = Array<Enrollment>();

  execute(enrollmentRequest: any): Enrollment {
    const student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf);
    console.log(student.cpf.value);
    if (this.enrollments.find(s => s.student.cpf.value === student.cpf.value)) {
      throw new Error('Enrollment with duplicated student is not allowed');
    }
    const enrollment = new Enrollment(
      student,
      enrollmentRequest.level, 
      enrollmentRequest.module, 
      enrollmentRequest.class, 
      this.enrollments.length+1);
    this.enrollments.push(enrollment);
    return enrollment;
  }
}