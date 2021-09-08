import EnrollStudent from "./EnrollStudent";
import EnrollStudentInputData from "./EnrollStudentInputData";
import GetEnrollment from "./GetEnrollment";
import { InvoiceStatus } from "./Invoice";
import RepositoryMemoryFactory from "./RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

beforeEach(function () {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory);
  getEnrollment = new GetEnrollment(repositoryMemoryFactory);
});

test("Should get enrollment with balance", function () {
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
  const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001");
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.balance).toBe(17000);
});

test("Should calculate due date and return status open or overdue for each invoice", function () {
  jest.useFakeTimers('modern').setSystemTime(new Date(2021, 2, 1));

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
  const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001");
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.balance).toBe(17000)
  expect(getEnrollmentOutputData.invoices[0].status).toBe(InvoiceStatus.Overdue);
  expect(getEnrollmentOutputData.invoices[1].status).toBe(InvoiceStatus.Open);
});