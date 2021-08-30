  
import Classroom from "./Classroom";
import ClassroomRepository from "./ClassroomRepository";

export default class ClassroomRepositoryMemory implements ClassroomRepository {
    classrooms: any[];

    constructor () {
        this.classrooms = [];
        this.save(new Classroom("EM", "3", "A", 2, new Date('2020-01-01'), new Date('2999-01-01')));
    }

    save(classroom: Classroom): void {
       this.classrooms.push(classroom);
    }

    findByCode(code: string) {
        const classroom = this.classrooms.find(classroom => classroom.code === code);
        if (!classroom) throw new Error("Classroom not found");
        return classroom
    }
}