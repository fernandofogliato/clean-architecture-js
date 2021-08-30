import moment from "moment";

export default class Classroom {
  level: string;
  module: string;
  code: string;
  capacity: number;
  startDate: Date;
  endDate: Date;

  constructor({ level, module, code, capacity, startDate, endDate } : { level: string, module: string, code: string, capacity: number, startDate: Date, endDate: Date }) {
    this.level = level;
    this.module = module;
    this.code = code;
    this.capacity = capacity;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  isFinished(issueDate: Date): boolean {
    return moment(issueDate).isAfter(this.endDate);
  }

  isStarted(issueDate: Date): boolean {
    return moment(issueDate).isAfter(this.startDate);
  }

  getProgress(issueDate: Date) {
    const actualDate = moment(issueDate);
    const startDate = moment(this.startDate);
    const endDate = moment(this.endDate);
    if (this.isFinished(issueDate)) return 100;
    if (!this.isStarted(issueDate)) return 0;
    const days = endDate.diff(startDate, 'days') + 1;
    const daysSinceStart = actualDate.diff(startDate, 'days') + 1;
    return (daysSinceStart * 100) / days;
  }
}