import stripAnsi from 'strip-ansi';

export const expectAnsilessEqual = (actual: string, expected: string) => {
  expect(stripAnsi(actual)).toEqual(expected);
};

export const expectAnsilessContain = (actual: string, expected: string) => {
  expect(stripAnsi(actual)).toContain(expected);
};
