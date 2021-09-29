import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import PayInvoice from "../domain/usecase/PayInvoice";
import PayInvoiceInputData from "../domain/usecase/data/PayInvoiceInputData";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

describe("Pay Invoice Test", function () {  
  beforeEach(function () {
    const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
    getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
    payInvoice = new PayInvoice(repositoryDatabaseFactory);
  });

  test("Should pay enrollment invoice", async function () {
    const issueDate = new Date(2021, 1, 1);
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana Maria",
      studentCpf: "864.464.227-84",
      studentBirthDate: "2002-10-10",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12
    });
    const enrollment = await enrollStudent.execute(enrollmentRequest, issueDate);

    await payInvoice.execute(new PayInvoiceInputData({
      code: enrollment.code, 
      month: 1, 
      year: 2021, 
      amount: 1416.66,
      paymentDate: new Date(2021, 1, 1)
    }));

    const getEnrollmentOutputData = await getEnrollment.execute(enrollment.code, issueDate);
    expect(getEnrollmentOutputData.code).toBe(enrollment.code);
    expect(getEnrollmentOutputData.balance).toBe(15583.34);
  });

  test("Should pay overdue invoice", async function () {
    const enrollmentRequest = new EnrollStudentInputData({
      studentName: "Ana Maria",
      studentCpf: "864.464.227-84",
      studentBirthDate: "2002-10-10",
      level: "EM",
      module: "1",
      classroom: "A",
      installments: 12
    });
    const enrollment = await enrollStudent.execute(enrollmentRequest, new Date(2021, 1, 1));
    
    await payInvoice.execute(new PayInvoiceInputData({
      code: enrollment.code, 
      month: 1, 
      year: 2021, 
      amount: 1629.15,
      paymentDate: new Date(2021, 1, 10)
    }));

    const getEnrollmentOutputData = await getEnrollment.execute(enrollment.code, new Date(2021, 1, 10));
    expect(getEnrollmentOutputData.code).toBe(enrollment.code);
    expect(getEnrollmentOutputData.invoices[0].penalty).toBe(141.66);
    expect(getEnrollmentOutputData.invoices[0].interests).toBe(70.83);
    expect(getEnrollmentOutputData.balance).toBe(15583.34);
  });

  afterEach(async function () {
    const enrollmentRepository = new EnrollmentRepositoryDatabase();
    await enrollmentRepository.clean();
  });  
});