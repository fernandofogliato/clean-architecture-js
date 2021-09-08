import EnrollStudent from "./EnrollStudent";
import EnrollStudentInputData from "./EnrollStudentInputData";
import GetEnrollment from "./GetEnrollment";
import PayInvoice from "./PayInvoice";
import RepositoryMemoryFactory from "./RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

beforeEach(function () {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory);
  getEnrollment = new GetEnrollment(repositoryMemoryFactory);
  payInvoice = new PayInvoice(repositoryMemoryFactory);
});

test("Should pay enrollment invoice", function () {
  jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 1));

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

  payInvoice.execute("2021EM1A0001", 1, 2021, 1416.66);

  const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001");
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.balance).toBe(15583.34);
});

test("Should pay overdue invoice", function () {
  jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 10));

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

  payInvoice.execute("2021EM1A0001", 1, 2021, 1629.15);

  const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001");
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.invoices[0].penaltyAmount).toBe(141.66);
  expect(getEnrollmentOutputData.invoices[0].interestAmount).toBe(70.83);
  expect(getEnrollmentOutputData.balance).toBe(15583.34);
});