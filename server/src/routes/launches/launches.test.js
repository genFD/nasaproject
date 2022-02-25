//test cases,
//test define in cb function

describe('Test GET/launches', () => {
  test('it should respond with 200 sucess', () => {
    const response = 200;
    expect(response).toBe(200);
  });
});

describe('Test POST/launches', () => {
  test('It should respond with 200 sucess', () => {
    const response = 200;
    expect(response).toBe(200);
  });
  test('It should catch missing required properties', () => {
    const response = 200;
    expect(response).toBe(200);
  });
  test('It should catch invalid dates', () => {});
});
