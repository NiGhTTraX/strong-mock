import { describe, it } from '../../../../../tests/node/suite';
import XMock from '../../../src';

describe('XMock', () => {
  it('should not blow up', () => {
    // eslint-disable-next-line no-new
    new XMock();
  });
});
