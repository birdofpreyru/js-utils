import { expectType } from 'tsd-lite';

import {
  SEC_MS,
  MIN_MS,
  HOUR_MS,
  DAY_MS,
  YEAR_MS,
} from '../../src/time';

expectType<1000>(SEC_MS);
expectType<60000>(MIN_MS);
expectType<3600000>(HOUR_MS);
expectType<86400000>(DAY_MS);
expectType<31536000000>(YEAR_MS);
