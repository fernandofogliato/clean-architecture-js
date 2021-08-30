import { isConstructorDeclaration } from "typescript";
import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import Invoice from "./Invoice";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import Student from "./Student";

export default class EnrollStudent {
    levelRepository: LevelRepository;
    moduleRepository: ModuleRepository;
    classroomRepository: ClassroomRepository;
    enrollmentRepository: EnrollmentRepository;

    constructor (levelRepository: LevelRepository, moduleRepository: ModuleRepository, classRepository: ClassroomRepository, enrollmentRepository: EnrollmentRepository) {
        this.levelRepository = levelRepository;
        this.moduleRepository = moduleRepository;
        this.classroomRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    
    execute (enrollmentRequest: any) {
        const student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf, enrollmentRequest.student.birthDate);
        const level = this.levelRepository.findByCode(enrollmentRequest.level);
        const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module);
        const classroom = this.classroomRepository.findByCode(enrollmentRequest.classroom);
        if (student.getAge() < module.minimumAge) throw new Error("Student below minimum age");
        if (classroom.getTimeProgress() === 100) throw new Error("Classroom is already finished");
        if (classroom.getTimeProgress() > 25) throw new Error("Classroom is already started");
        const studentsEnrolledInClassroom = this.enrollmentRepository.findAllByClassroom(level.code, module.code, classroom.code);
        if (studentsEnrolledInClassroom.length === classroom.capacity) throw new Error("Classroom is over capacity");
        const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf);
        if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
        const enrollmentDate = new Date();
        const sequence = new String(this.enrollmentRepository.count() + 1).padStart(4, "0");
        const code = `${enrollmentDate.getFullYear()}${level.code}${module.code}${classroom.code}${sequence}`;
        const invoices = this.calculateInvoice(module.price, enrollmentRequest.installments);
        const enrollment = new Enrollment(student, level.code, module.code, classroom.code, code, invoices);
        
        this.enrollmentRepository.save(enrollment);
        return enrollment;
    }

    private calculateInvoice(modulePrice: number, installments: number): Invoice[] {
        if (!installments) {
            return [];
        }
        const installmentValue = Math.round((modulePrice/installments) * 100) / 100;
        const totalValue = installmentValue * installments;
        const diff = Math.round((modulePrice - totalValue) * 100) / 100;

        console.log(installmentValue, totalValue, diff);
        const invoices = [];
        for (let installment = 1; installment <= installments; installment++) {            
            const value = (installment === installments) ? installmentValue + diff : installmentValue;
            invoices.push(new Invoice(installment, value));
        }
        return invoices;
    }
}