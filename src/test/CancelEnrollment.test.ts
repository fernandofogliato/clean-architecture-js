import CancelEnrollment from "../domain/usecase/CancelEnrollment";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let cancelEnrollment: CancelEnrollment;

describe("Cancel Enrollment Test", function () {
  beforeEach(function () {
    const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
    getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
    cancelEnrollment = new CancelEnrollment(repositoryDatabaseFactory);
  });

  test("Should cancel enrollment", async function () {
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
    await cancelEnrollment.execute(enrollment.code);
    const getEnrollmentOutputData = await getEnrollment.execute(enrollment.code, new Date(2021, 1, 1));
    expect(getEnrollmentOutputData.status).toBe("Cancelled");
  });

  afterEach(async function () {
    const enrollmentRepository = new EnrollmentRepositoryDatabase();
    await enrollmentRepository.clean();
  });
});