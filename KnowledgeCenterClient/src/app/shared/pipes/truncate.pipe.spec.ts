import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;
  const text = 'A text with 31 char to truncate';

  beforeEach( () => {
    pipe = new TruncatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should not truncate text because length is smaller than size', () => {
    const result = pipe.transform(text, 100);
    expect(result).toEqual(text);
  });

  it('should truncate text after "with" word and add tail', () => {
    const result = pipe.transform(text, 11);
    expect(result).toEqual('A text with...');
  });
});
