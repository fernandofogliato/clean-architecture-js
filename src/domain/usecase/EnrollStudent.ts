 
import Enrollment from "../entity/Enrollment";
import Student from "../entity/Student";
import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import ClassroomRepository from "../repository/ClassroomRepository";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import LevelRepository from "../repository/LevelRepository";
import ModuleRepository from "../repository/ModuleRepository";
import EnrollStudentInputData from "./data/EnrollStudentInputData";
import EnrollStudentOutputData from "./data/EnrollStudentOutputData";

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
    
	async execute(enrollmentRequest: EnrollStudentInputData, issueDate: Date = new Date()): Promise<EnrollStudentOutputData> {
		const student = new Student(enrollmentRequest.studentName, enrollmentRequest.studentCpf, enrollmentRequest.studentBirthDate);
		const level = await this.levelRepository.findByCode(enrollmentRequest.level);
		const module = await this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module);
		const classroom = await this.classroomRepository.findByCode(enrollmentRequest.classroom);
		const enrollmentSequence = await this.enrollmentRepository.count() + 1;
		const enrollment = new Enrollment(student, level, module, classroom, issueDate, enrollmentSequence);

		const studentsEnrolledInClassroom = await this.enrollmentRepository.findAllByClassroom(level.code, module.code, classroom.code);
		if (studentsEnrolledInClassroom.length === classroom.capacity) throw new Error("Classroom is over capacity");
		const existingEnrollment = await this.enrollmentRepository.findByCpf(student.cpf.value);
		if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
		this.enrollmentRepository.save(enrollment);
		const enrollStudentOutputData = new EnrollStudentOutputData(enrollment.code.value);
		for (const invoice of enrollment.invoices) {
			enrollStudentOutputData.invoices.push(invoice.clone());
		}
		return enrollStudentOutputData;
	}
}