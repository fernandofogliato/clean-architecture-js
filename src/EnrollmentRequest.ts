import Student from "./Student";

export default class EnrollmentRequest {
  student: Student;

 constructor (student: Student) {
     this.student = student;
 }
}
