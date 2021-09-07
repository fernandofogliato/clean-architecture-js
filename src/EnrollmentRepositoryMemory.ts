import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
    enrollments: Enrollment[];

    constructor () {
        this.enrollments = [];
    }

    save(enrollment: Enrollment): void {
        this.enrollments.push(enrollment);
    }
    findAllByClassroom(level: string, module: string, classroom: string): Enrollment[] {
        return this.enrollments.filter(enrollment => enrollment.level.code === level && enrollment.module.code === module && enrollment.classroom.code === classroom);
    }
    findByCpf(cpf: string): Enrollment | undefined {
        return this.enrollments.find(enrollment => enrollment.student.cpf.value === cpf);
    }
    findByCode(code: string): Enrollment | undefined {
        return this.enrollments.find(enrollment => enrollment.code.value === code);
    }    
    count(): number {
        return this.enrollments.length;
    }
}