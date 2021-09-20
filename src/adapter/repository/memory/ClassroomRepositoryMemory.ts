  
import Classroom from "../../../domain/entity/Classroom";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";

export default class ClassroomRepositoryMemory implements ClassroomRepository {
	classrooms: Classroom[];

	constructor () {
		this.classrooms = [];
		this.save(new Classroom({
			level: "EM", 
			module: "3", 
			code: "A", 
			capacity: 2, 
			startDate: new Date('2020-01-01'), 
			endDate: new Date('2999-01-01')
		}));
	}

	save(classroom: Classroom): Promise<void> {
		this.classrooms.push(classroom);
		return Promise.resolve();
	}

	async findByCode(code: string) {
		const classroom = this.classrooms.find(classroom => classroom.code === code);
		if (!classroom) throw new Error("Classroom not found");
		return Promise.resolve(classroom);
	}
}