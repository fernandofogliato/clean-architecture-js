export default class CpfValidator {
  private FACTOR_DIGIT_1 = 10;
  private FACTOR_DIGIT_2 = 11;
  private MAX_DIGITS_1 = 9;
  private MAX_DIGITS_2 = 10;

  isValid(formattedCpf = ""): Boolean {
      const cpf = this.extractDigits(formattedCpf);
      if (this.isInvalidLength(cpf)) return false;
      if (this.isBlocked(cpf)) return false;

      const digit1 = this.calculateDigit(cpf, this.FACTOR_DIGIT_1, this.MAX_DIGITS_1);
      const digit2 = this.calculateDigit(cpf, this.FACTOR_DIGIT_2, this.MAX_DIGITS_2);
      
      let calculatedCheckDigit = `${digit1}${digit2}`;  
      return this.getCheckDigit(cpf) == calculatedCheckDigit;
  }
  
  private extractDigits(cpf: string) {
      return cpf.replace(/\D/g, "");
  }
  
  private isInvalidLength(cpf: string) {
      return cpf.length !== 11;
  }
  
  private isBlocked(cpf: string) {
      const [digit1] = cpf;
      return cpf.split("").every(digit => digit === digit1);
  }
  
  private calculateDigit(cpf: string, factor: number, max: number) {
      let total = 0;
      for (const digit of this.toDigitArray(cpf).slice(0, max)) {
          total += digit * factor--;
      }
      return (total%11 < 2) ? 0 : (11 - total%11);
  }
  
  private toDigitArray(cpf: string) {
      return [...cpf].map(digit => parseInt(digit));
  }
  
  private getCheckDigit(cpf: string) {
      return cpf.slice(9);
  }
}
