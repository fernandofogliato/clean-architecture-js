export default class Name {
  value: string;
 
  constructor(value: string) {
    const regexName = /^([A-Za-z]+ )+([A-Za-z])+$/;
    if (!regexName.test(value)) {
      throw new Error('Invalid student name'); 
    }
    this.value = value;
  }
}