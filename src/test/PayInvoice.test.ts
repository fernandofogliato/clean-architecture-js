import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import PayInvoice from "../domain/usecase/PayInvoice";
import RepositoryMemoryFactory from "../adapter/factory/RepositoryMemoryFactory";
import PayInvoiceInputData from "../domain/usecase/data/PayInvoiceInputData";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

beforeEach(function () {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory);
  getEnrollment = new GetEnrollment(repositoryMemoryFactory);
  payInvoice = new PayInvoice(repositoryMemoryFactory);
});

test("Should pay enrollment invoice", async function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: "Ana Maria",
    studentCpf: "864.464.227-84",
    studentBirthDate: "2002-10-10",
    level: "EM",
    module: "1",
    classroom: "A",
    installments: 12
  });
  await enrollStudent.execute(enrollmentRequest);

  await payInvoice.execute(new PayInvoiceInputData({
    code: "2021EM1A0001", 
    month: 1, 
    year: 2021, 
    amount: 1416.66,
    paymentDate: new Date("2021-01-01")
  }));

  const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-01-01"));
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
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
  enrollStudent.execute(enrollmentRequest);
  
  await payInvoice.execute(new PayInvoiceInputData({
    code: "2021EM1A0001", 
    month: 1, 
    year: 2021, 
    amount: 1629.15,
    paymentDate: new Date("2021-06-20")
  }));

  const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-01-10"));
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.invoices[0].penaltyAmount).toBe(141.66);
  expect(getEnrollmentOutputData.invoices[0].interestAmount).toBe(70.83);
  expect(getEnrollmentOutputData.balance).toBe(15583.34);
});