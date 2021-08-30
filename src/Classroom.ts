import moment from "moment";

export default class Classroom {
  level: string;
  module: string;
  code: string;
  capacity: number;
  startDate: Date;
  endDate: Date;

  constructor(level: string, module: string, code: string, capacity: number, startDate: Date, endDate: Date) {
    this.level = level;
    this.module = module;
    this.code = code;
    this.capacity = capacity;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getTimeProgress() {
    const actualDate = moment();
    const startDate = moment(this.startDate);
    const endDate = moment(this.endDate);
    if (actualDate.isAfter(endDate)) return 100;
    if (startDate.isAfter(actualDate)) return 0;
    const days = endDate.diff(startDate, 'days') + 1;
    const daysSinceStart = actualDate.diff(startDate, 'days') + 1;
    return (daysSinceStart * 100) / days;
  }
}