import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import { InvoiceStatus } from "../domain/entity/Invoice";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

describe("Get Enrollment tests", function() {
  beforeEach(function () {
    const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
    getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
  });

  test("Should get enrollment with balance", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana Maria",
      studentCpf: "864.464.227-84",
      studentBirthDate: "2002-10-10",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12
    });
    const enrollment = await enrollStudent.execute(enrollmentRequest, new Date(2021, 2, 1));
    const getEnrollmentOutputData = await getEnrollment.execute(enrollment.code, new Date(2021, 2, 1));
    expect(getEnrollmentOutputData.code).toBe(enrollment.code);
    expect(getEnrollmentOutputData.balance).toBe(17000);
  });

  test("Should calculate due date and return status open or overdue for each invoice", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana Maria",
      studentCpf: "864.464.227-84",
      studentBirthDate: "2002-10-10",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12
    });
    const enrollment = await enrollStudent.execute(enrollmentRequest, new Date(2021, 2, 1));
    const getEnrollmentOutputData = await getEnrollment.execute(enrollment.code, new Date(2021, 2, 1));
    expect(getEnrollmentOutputData.code).toBe(enrollment.code);
    expect(getEnrollmentOutputData.invoices[0].status).toBe(InvoiceStatus.Overdue);
    expect(getEnrollmentOutputData.invoices[1].status).toBe(InvoiceStatus.Open);
  });

  afterEach(async function () {
    const enrollmentRepository = new EnrollmentRepositoryDatabase();
    await enrollmentRepository.clean();
  });  
});