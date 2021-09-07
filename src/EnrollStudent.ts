import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollStudentInputData from "./EnrollStudentInputData";
import EnrollStudentOutputData from "./EnrollStudentOutputData";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";
import Student from "./Student";

export default class EnrollStudent {
	levelRepository: LevelRepository;
	moduleRepository: ModuleRepository;
	classroomRepository: ClassroomRepository;
	enrollmentRepository: EnrollmentRepository;

	constructor(repositoryFactory: RepositoryAbstractFactory) {
		this.levelRepository = repositoryFactory.createLevelRepository();
		this.moduleRepository = repositoryFactory.createModuleRepository();
		this.classroomRepository = repositoryFactory.createClassroomRepository();
		this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
	}
    
	execute(enrollmentRequest: EnrollStudentInputData): EnrollStudentOutputData {
		const student = new Student(enrollmentRequest.studentName, enrollmentRequest.studentCpf, enrollmentRequest.studentBirthDate);
		const level = this.levelRepository.findByCode(enrollmentRequest.level);
		const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module);
		const classroom = this.classroomRepository.findByCode(enrollmentRequest.classroom);
		const enrollment = new Enrollment(student, level, module, classroom, new Date(), this.enrollmentRepository.count() + 1);

		const studentsEnrolledInClassroom = this.enrollmentRepository.findAllByClassroom(level.code, module.code, classroom.code);
		if (studentsEnrolledInClassroom.length === classroom.capacity) throw new Error("Classroom is over capacity");
		const existingEnrollment = this.enrollmentRepository.findByCpf(student.cpf.value);
		if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
		this.enrollmentRepository.save(enrollment);
		const enrollStudentOutputData = new EnrollStudentOutputData(enrollment.code.value);
		for (const invoice of enrollment.invoices) {
			enrollStudentOutputData.invoices.push(invoice.clone());
		}
		return enrollStudentOutputData;
	}
}