import Classroom from "./Classroom";

export default interface ClassroomRepository {
  save(classroom: Classroom): void;
  findByCode(code: string): any;
}