import Classroom from "../../../domain/entity/Classroom";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";
import ConnectionPool from "../../../infra/database/ConnectionPool";

export default class ClassroomRepositoryDatabase implements ClassroomRepository {
  
  async save(classroom: Classroom): Promise<void> {
    await ConnectionPool.one("insert into system.classroom (level, module, code, capacity, start_date, end_date) values ($1, $2, $3, $4, $5, $6) returning *", 
      [classroom.level, classroom.module, classroom.code, classroom.capacity, classroom.startDate, classroom.endDate]);
  }

  async findByCode(code: string): Promise<Classroom> {
    const classroomData = await ConnectionPool.one("select * from system.classroom where code = $1", [code]);
    return new Classroom({
      level: classroomData.level,
      module: classroomData.module,
      code: classroomData.code,
      capacity: classroomData.capacity,
      startDate: classroomData.start_date,
      endDate: classroomData.end_date
    });
  }
}