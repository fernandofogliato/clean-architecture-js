import EnrollStudent from './EnrollStudent';

test('Should not enroll without valid student name', function () {
    const enrollmentRequest = {
      student: {
        name: 'Ana',
        cpf: '123'
      }
    }
    const enrollStudent = new EnrollStudent();
    expect(() => enrollStudent.execute(enrollmentRequest))
      .toThrow(new Error('Invalid student name'))
});

test('Should enroll with valid student name', function () {
  const enrollmentRequest = {
    student: {
      name: 'Fernando Fogliato',
      cpf: '832.081.519-34'
    }
  }
  const enrollStudent = new EnrollStudent();
  expect(enrollStudent.execute(enrollmentRequest)).toBeTruthy()
});

test('Should not enroll without valid student cpf', function () {
  const enrollmentRequest = {
    student: {
      name: 'Fernando Fogliato',
      cpf: '123'
    }
  }
  const enrollStudent = new EnrollStudent();
  expect(() => enrollStudent.execute(enrollmentRequest))
    .toThrow(new Error('Invalid cpf'))
});

test('Should not enroll duplicated student', function () {
  const enrollmentRequest1 = {
    student: {
      name: 'Fernando Fogliato',
      cpf: '832.081.519-34'
    }
  }

  const enrollmentRequest2 = {
    student: {
      name: 'Fernando Fogliato',
      cpf: '832.081.519-34'
    }
  }

  const enrollStudent = new EnrollStudent();
  enrollStudent.execute(enrollmentRequest1);
  expect(() => enrollStudent.execute(enrollmentRequest2))
    .toThrow(new Error('Enrollment with duplicated student is not allowed'))
});

test('Should generate enrollment code', function () {
  const enrollmentRequest = {
    student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12"
    },
    level: "EM",
    module: "1",
    class: "A"
  }

  const enrollStudent = new EnrollStudent();
  const enrollment = enrollStudent.execute(enrollmentRequest);
  expect(enrollment.id).toEqual("2021EM1A0001")
});
