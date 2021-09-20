import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import GetEnrollmentOutputData from "./data/GetEnrollmentOutputData";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  async execute(code: string, currentDate: Date): Promise<GetEnrollmentOutputData> {
    const enrollment = await this.enrollmentRepository.findByCode(code);
    const balance = enrollment?.getInvoiceBalance();
    const getEnrollmentOutputData = new GetEnrollmentOutputData({
      code: enrollment.code.value,
      balance,
      status: enrollment.status.toString(),
      invoices: []
    });
    for (const invoice of enrollment.invoices) {
      getEnrollmentOutputData.invoices.push({
        amount: invoice.amount,
        status: invoice.getStatus(currentDate),
        dueDate: invoice.dueDate,
        penalty: invoice.getPenaltyAmount(currentDate),
        interests: invoice.getInterestAmount(currentDate),
        balance: invoice.getBalance()
      });
    }
    return getEnrollmentOutputData;
  }
}