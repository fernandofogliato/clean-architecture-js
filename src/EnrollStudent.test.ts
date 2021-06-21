import EnrollmentRequest from './EnrollmentRequest';
import EnrollStudent from './EnrollStudent';
import Student from './Student';

test('Should not enroll without valid student name', function () {
    const student = new Student('Ana', '123');
    const enrollmentRequest = new EnrollmentRequest(student);
    const enrollStudent = new EnrollStudent();
    
    expect(() => enrollStudent.execute(enrollmentRequest))
      .toThrow(new Error('Invalid student name'))
});

test('Should enroll with valid student name', function () {
  const student = new Student('Fernando Fogliato', '832.081.519-34');
  const enrollmentRequest = new EnrollmentRequest(student);
  const enrollStudent = new EnrollStudent();
  
  expect(enrollStudent.execute(enrollmentRequest)).toBeTruthy()
});

test('Should not enroll without valid student cpf', function () {
  const student = new Student('Fernando Fogliato', '123');
  const enrollmentRequest = new EnrollmentRequest(student);
  const enrollStudent = new EnrollStudent();
  
  expect(() => enrollStudent.execute(enrollmentRequest))
    .toThrow(new Error('Invalid student cpf'))
});

test('Should not enroll duplicated student', function () {
  const enrollmentRequest1 = new EnrollmentRequest(new Student('Fernando Fogliato', '832.081.519-34'));
  const enrollmentRequest2 = new EnrollmentRequest(new Student('Fernando Fogliato', '832.081.519-34'));
  const enrollStudent = new EnrollStudent();
  enrollStudent.execute(enrollmentRequest1);

  expect(() => enrollStudent.execute(enrollmentRequest2))
    .toThrow(new Error('Enrollment with duplicated student is not allowed'))
});