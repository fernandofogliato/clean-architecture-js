import moment from "moment";
import Classroom from "./Classroom";
import EnrollStudent from "./EnrollStudent";
import EnrollStudentInputData from "./EnrollStudentInputData";
import RepositoryMemoryFactory from "./RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;

beforeEach(function () {
    enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
});

test("Should not enroll without valid student name", function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Ana",
    studentCpf: "755.525.774-26",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid student name"))
});

test("Should enroll with valid student name", function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Fernando Fogliato",
    studentCpf: "755.525.774-26",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });  
  expect(enrollStudent.execute(enrollmentRequest)).toBeTruthy()
});

test("Should not enroll without valid student cpf", function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Ana Maria",
    studentCpf: "123",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });

  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid cpf"))
});

test("Should not enroll duplicated student", function () {
  const enrollmentRequest1 = new EnrollStudentInputData({
    studentName: "Fernando Fogliato",
    studentCpf: "832.081.519-34",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });  

  const enrollmentRequest2 = new EnrollStudentInputData({
    studentName: "Fernando Fogliato",
    studentCpf: "832.081.519-34",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });  

  enrollStudent.execute(enrollmentRequest1);
  expect(() => enrollStudent.execute(enrollmentRequest2)).toThrow(new Error("Enrollment with duplicated student is not allowed"))
});

test("Should generate enrollment code", function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria Carolina Fonseca",
    studentCpf: "755.525.774-26",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });

  const enrollment = enrollStudent.execute(enrollmentRequest);
  expect(enrollment.code).toEqual("2021EM1A0001")
});

test("Should not enroll student over classroom capacity", function () {  
  enrollStudent.execute(new EnrollStudentInputData({
    studentName: "Maria Maria",
    studentCpf: "240.826.286-06",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  }));

  enrollStudent.execute(new EnrollStudentInputData({
    studentName: "Maria Carolina",
    studentCpf: "670.723.738-10",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  }));  

  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria Jose",
    studentCpf: "580.255.250-66",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Classroom is over capacity"));
});

test("Should not enroll after que end of the class", function () {
  enrollStudent.classroomRepository.save(new Classroom({
    level: "EM", 
    module: "3", 
    code: "B", 
    capacity: 2, 
    startDate: moment().subtract(7, "days").toDate(), 
    endDate: moment().subtract(1, "days").toDate()
  }));  

  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria Jose",
    studentCpf: "580.255.250-66",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "3",
    classroom: "B",
    installments: 12    
  });
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Classroom is already finished"));
});

test("Should not enroll after 25% of the start of the class", function () {
  enrollStudent.classroomRepository.save(new Classroom({
    level: "EM", 
    module: "3", 
    code: "B", 
    capacity: 2, 
    startDate: moment().subtract(30, "days").toDate(), 
    endDate: moment().add(1, "days").toDate()
  }));

  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria Jose",
    studentCpf: "580.255.250-66",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "3",
    classroom: "B",
    installments: 12    
  });

  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Classroom is already started"));
});

test("Should enroll before 25% of the start of the class", function () {
  enrollStudent.classroomRepository.save(new Classroom({
    level: "EM", 
    module: "3", 
    code: "B", 
    capacity: 2, 
    startDate: moment().subtract(5, "days").toDate(), 
    endDate: moment().add(25, "days").toDate()
  }));  

  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria José",
    studentCpf: "580.255.250-66",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "3",
    classroom: "B",
    installments: 12    
  });

  expect(() => enrollStudent.execute(enrollmentRequest)).toBeTruthy();
});

test("Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice", function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Maria Carolina Fonseca",
    studentCpf: "755.525.774-26",
    studentBirthDate: "2002-03-12",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12    
  });

  const enrollment = enrollStudent.execute(enrollmentRequest);
  expect(enrollment.invoices).toHaveLength(enrollmentRequest.installments);
  expect(enrollment.invoices[11].amount).toEqual(1416.63);
});