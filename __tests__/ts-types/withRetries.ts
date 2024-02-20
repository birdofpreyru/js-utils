import { expectType } from 'tsd-lite';

import withRetries from '../../src/withRetries';

expectType<Promise<string>>(withRetries(() => 'A'));
expectType<Promise<string>>(withRetries(async () => 'A'));
