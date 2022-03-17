import { BadCircularSuite } from './bad-circular-dep/bad-circular.e2e-spec';
import { GoodCircularSuite } from './good-circular-dep/good-circular.e2e-spec';
import { SpelunkerSuite } from './large-app/app.e2e-spec';

SpelunkerSuite.run();
BadCircularSuite.run();
GoodCircularSuite.run();
