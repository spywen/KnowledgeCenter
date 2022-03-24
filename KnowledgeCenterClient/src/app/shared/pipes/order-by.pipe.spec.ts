import { OrderByStringPipe } from './order-by.pipe';

describe('OrderByPipe', () => {
  let pipe: OrderByStringPipe;

  beforeEach(() => {
    pipe = new OrderByStringPipe();
  });

  const arrayOfObjects = [
    { name: 'x' },
    { name: 'a' }
  ];

  it('should order by alphabetical order', () => {
    const result = pipe.transform(arrayOfObjects, 'name');
    expect(result[0].name).toBe('a');
    expect(result[1].name).toBe('x');
  });

  it('should return nothing when not providing array', () => {
    expect(pipe.transform(undefined, 'name')).toBeUndefined();
  });

  it('should return array provided without modifciation if invalid field name provided', () => {
    expect(pipe.transform(arrayOfObjects, 'unknown')).toBe(arrayOfObjects);
  });
});
