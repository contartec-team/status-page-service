'use strict'

require('module-alias/register')
require('dotenv').config()

const chai = require('chai')

chai
  .use(require('chai-things'))
  .use(require('chai-as-promised'))
  .use(require('chai-shallow-deep-equal'))
  .use(require('sinon-chai'))

global.expect = chai.expect