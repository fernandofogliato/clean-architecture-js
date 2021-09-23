import moment from "moment";
import Classroom from "../domain/entity/Classroom";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;

describe("Enroll Student Test", function () {  
  beforeEach(async function () {
    const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryDatabaseFactory);

    const enrollmentRepository = new EnrollmentRepositoryDatabase();
    await enrollmentRepository.clean();
  });

  test("Should not enroll without valid student name", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana",
      studentCpf: "755.525.774-26",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });
    await expect(() => enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1))).rejects.toThrow(new Error("Invalid student name"))
  });

  test("Should enroll with valid student name", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Fernando Fogliato",
      studentCpf: "755.525.774-26",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });  
    await expect(() => enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1))).toBeTruthy()
  });

  test("Should not enroll without valid student cpf", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana Maria",
      studentCpf: "123",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });

    await expect(() => enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1))).rejects.toThrow(new Error("Invalid cpf"))
  });

  test("Should not enroll duplicated student", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Fernando Fogliato",
      studentCpf: "832.081.519-34",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 6    
    });  

    await enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1));
    await expect(() => enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1))).rejects.toThrow(new Error("Enrollment with duplicated student is not allowed"))
  });

  test("Should generate enrollment code", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Maria Carolina Fonseca",
      studentCpf: "755.525.774-26",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });

    const enrollment = await enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1));
    expect(enrollment.code).toEqual("2021EM1A0001")
  });

  test("Should not enroll student over classroom capacity", async function () {  
    await enrollStudent.execute(new EnrollStudentInputData({
      studentName: "Maria Maria",
      studentCpf: "240.826.286-06",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    }), new Date(2021, 6, 1));

    await enrollStudent.execute(new EnrollStudentInputData({
      studentName: "Maria Carolina",
      studentCpf: "670.723.738-10",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    }), new Date(2021, 6, 1));  

    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Maria Jose",
      studentCpf: "580.255.250-66",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });
    await expect(() => enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1))).rejects.toThrow(new Error("Classroom is over capacity"));
  });

  test("Should not enroll after que end of the class", async function () {
    await enrollStudent.classroomRepository.save(new Classroom({
      level: "EM", 
      module: "3", 
      code: "B23", 
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
      classroom: "B23",
      installments: 12    
    });
    await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Classroom is already finished"));
  });

  test("Should not enroll after 25% of the start of the class", async function () {
    await enrollStudent.classroomRepository.save(new Classroom({
      level: "EM", 
      module: "3", 
      code: "B24", 
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
      classroom: "B24",
      installments: 12    
    });

    await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Classroom is already started"));
  });

  test("Should enroll before 25% of the start of the class", async function () {
    await enrollStudent.classroomRepository.save(new Classroom({
      level: "EM", 
      module: "3", 
      code: "B25", 
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
      classroom: "B25",
      installments: 12    
    });

    await expect(() => enrollStudent.execute(enrollmentRequest)).toBeTruthy();
  });

  test("Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Maria Carolina Fonseca",
      studentCpf: "755.525.774-26",
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12    
    });

    const enrollment = await enrollStudent.execute(enrollmentRequest, new Date(2021, 6, 1));
    expect(enrollment.invoices).toHaveLength(enrollmentRequest.installments);
    expect(enrollment.invoices[11].amount).toEqual(1416.63);
  });

});