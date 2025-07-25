
/*
 * This test verifies that these modules and types are exported correctly
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  interpolate,
} from '@mui/x-charts-vendor/d3-interpolate';

describe('d3-interpolate', () => {
  it('exports valid functions', () => {
    expect(interpolate).instanceOf(Function);
  });
});
