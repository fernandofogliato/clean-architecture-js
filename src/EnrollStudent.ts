import CpfValidator from "./CpfValidator";
import EnrollmentRequest from "./EnrollmentRequest";
import Student from "./Student";

export default class EnrollStudent {

  private enrollments = Array<Student>();

  execute(enrollmentRequest: EnrollmentRequest): boolean {
    this.validateStudentInfo(enrollmentRequest.student)

    if (this.enrollments.find(s => s.cpf === enrollmentRequest.student.cpf)) {
      throw new Error('Enrollment with duplicated student is not allowed');
    }
    this.enrollments.push(enrollmentRequest.student);
    return true;
  }

  private validateStudentInfo(student: Student) {
    const regexName = /^([A-Za-z]+ )+([A-Za-z])+$/;
    if (!regexName.test(student.name)) {
      throw new Error('Invalid student name'); 
    }

    if (!new CpfValidator().isValid(student.cpf)) {
      throw new Error('Invalid student cpf');
    }
  }
}