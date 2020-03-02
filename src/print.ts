import { ApplyProp } from './mock';

export const printProperty = (property: PropertyKey) => {
  if (property === ApplyProp) {
    return '';
  }

  if (typeof property === 'symbol') {
    return `[${property.toString()}]`;
  }

  return `.${property}`;
};

export const printCall = (property: PropertyKey, args: any[]) => {
  const prettyArgs = args.join(', ');
  const prettyProperty = printProperty(property);

  return `${prettyProperty}(${prettyArgs})`;
};
