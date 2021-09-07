import EnrollmentRepository from "./EnrollmentRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor (repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }
    
  execute (code: string): any {
    const enrollment = this.enrollmentRepository.findByCode(code);
    const balance = enrollment?.getInvoiceBalance();
    return {
      code: enrollment?.code.value,
      balance
    }
  }
}