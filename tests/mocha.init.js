'use strict'

require('dotenv').config()

const chai = require('chai')

chai
  .use(require('chai-things'))
  .use(require('chai-as-promised'))
  .use(require('chai-shallow-deep-equal'))
  .use(require('sinon-chai'))

global.expect = chai.expect