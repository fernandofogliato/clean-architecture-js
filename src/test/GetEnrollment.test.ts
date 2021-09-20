import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import { InvoiceStatus } from "../domain/entity/Invoice";
import RepositoryMemoryFactory from "../adapter/factory/RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

beforeEach(function () {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory);
  getEnrollment = new GetEnrollment(repositoryMemoryFactory);
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
  await enrollStudent.execute(enrollmentRequest);
  const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-02-01"));
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
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
  await enrollStudent.execute(enrollmentRequest);
  const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-02-01"));
  expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
  expect(getEnrollmentOutputData.balance).toBe(17000)
  expect(getEnrollmentOutputData.invoices[0].status).toBe(InvoiceStatus.Overdue);
  expect(getEnrollmentOutputData.invoices[1].status).toBe(InvoiceStatus.Open);
});