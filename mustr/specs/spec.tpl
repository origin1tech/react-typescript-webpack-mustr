---

$config:
  ext: .spec.ts

describe: App

---

// INJECTED

import * as chai from 'chai';
import * as mocha from 'mocha';

const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

describe('{{describe}}', () => {

  before((done) => {
    done();
  });

  it('should do something.', (done) => {
    done();
  });

  after((done) => {
    done();
  });

});
