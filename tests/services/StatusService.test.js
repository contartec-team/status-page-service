'use strict'

const rewire = require('rewire')
const StatusService = rewire('../../lib/services/StatusService')

const SpyMock = require('@contartec-team/spy-mock/lib/SpyMock')

describe('StatusService', () => {
  describe('.DEFAULT_AXIOS_PARAMS', () => {
    context('when env vars are valid', () => {
      let axiosParams = {}
      let params

      before(() => {
        axiosParams = {
          url     : process.env.API_URL,
          method  : process.env.API_METHOD,
          headers : JSON.parse(process.env.API_HEADERS),
          data    : JSON.parse(process.env.API_POST_BODY),
          params  : JSON.parse(process.env.API_QUERY_STRING)
        }

        params = StatusService.DEFAULT_AXIOS_PARAMS
      })

      it('should return `axios` params from env vars', () => {
        expect(params).to.eql(axiosParams)
      })
    })

    context('when `url` is `null`', () => {
      const url = process.env.API_URL

      let axiosParams = {}
      let params

      before(() => {
        process.env.API_URL = ''

        axiosParams = {
          url     : '',
          method  : process.env.API_METHOD,
          headers : JSON.parse(process.env.API_HEADERS),
          data    : JSON.parse(process.env.API_POST_BODY),
          params  : JSON.parse(process.env.API_QUERY_STRING)
        }

        params = StatusService.DEFAULT_AXIOS_PARAMS
      })

      after(() => process.env.API_URL = url)

      it('should return `axios` params from env vars', () => {
        expect(params).to.eql(axiosParams)
      })
    })

    context('when `API_HEADERS` is `null`', () => {
      const headers = process.env.API_HEADERS

      let axiosParams = {}
      let params

      before(() => {
        process.env.API_HEADERS = ''

        axiosParams = {
          url     : process.env.API_URL,
          method  : process.env.API_METHOD,
          headers : null,
          data    : JSON.parse(process.env.API_POST_BODY),
          params  : JSON.parse(process.env.API_QUERY_STRING)
        }

        params = StatusService.DEFAULT_AXIOS_PARAMS
      })

      after(() => process.env.API_HEADERS = headers)

      it('should return `axios` params from env vars', () => {
        expect(params).to.eql(axiosParams)
      })
    })

    context('when `API_POST_BODY` is `null`', () => {
      const body = process.env.API_POST_BODY

      let axiosParams = {}
      let params

      before(async () => {
        process.env.API_POST_BODY = ''

        axiosParams = {
          url     : process.env.API_URL,
          method  : process.env.API_METHOD,
          headers : JSON.parse(process.env.API_HEADERS),
          data    : null,
          params  : JSON.parse(process.env.API_QUERY_STRING)
        }

        params = StatusService.DEFAULT_AXIOS_PARAMS
      })

      after(() => process.env.API_POST_BODY = body)

      it('should return `axios` params from env vars', () => {
        expect(params).to.eql(axiosParams)
      })
    })

    context('when `API_QUERY_STRING` is `null`', () => {
      const queryString = process.env.API_QUERY_STRING

      let axiosParams = {}
      let params

      before(() => {
        process.env.API_QUERY_STRING = ''

        axiosParams = {
          url     : process.env.API_URL,
          method  : process.env.API_METHOD,
          headers : JSON.parse(process.env.API_HEADERS),
          data    : JSON.parse(process.env.API_POST_BODY),
          params  : null
        }

        params = StatusService.DEFAULT_AXIOS_PARAMS
      })

      after(() => process.env.API_QUERY_STRING = queryString)

      it('should return `axios` params from env vars', () => {
        expect(params).to.eql(axiosParams)
      })
    })
  })

  describe('.getAPIResponse', () => {
    context('when `params` is not `null`', () => {
      context('when `url` is not `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : 'https://sistema.contartec.com.br/',
            method  : 'POST',
            headers : JSON.parse(process.env.API_HEADERS),
            data    : JSON.parse('{"username":"la","password":"ha"}'),
            params  : JSON.parse('{"mac":"c4:2a:fe"}')
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse(axiosParams)
        })

        after(() => SpyMock.restoreAll())

        it('should call `axios` with params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `url` is `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : '',
            method  : 'POST',
            headers : JSON.parse(process.env.API_HEADERS),
            data    : JSON.parse('{"username":"la","password":"ha"}'),
            params  : JSON.parse('{"mac":"c4:2a:fe"}')
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse(axiosParams)
        })

        after(() => SpyMock.restoreAll())

        it('should not call `axios`', () => {
          expect(spies.axios).not.to.be.calledOnce
        })
      })

      context('when `headers` are `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : 'https://sistema.contartec.com.br/',
            method  : 'POST',
            headers : null,
            data    : JSON.parse('{"username":"la","password":"ha"}'),
            params  : JSON.parse('{"mac":"c4:2a:fe"}')
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse(axiosParams)
        })

        after(() => SpyMock.restoreAll())

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `data` is `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : 'https://sistema.contartec.com.br/',
            method  : 'POST',
            headers : JSON.parse(process.env.API_HEADERS),
            data    : null,
            params  : JSON.parse('{"mac":"c4:2a:fe"}')
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse(axiosParams)
        })

        after(() => SpyMock.restoreAll())

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `params` is `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : 'https://sistema.contartec.com.br/',
            method  : 'POST',
            headers : JSON.parse(process.env.API_HEADERS),
            data    : JSON.parse('{"username":"la","password":"ha"}'),
            params  : null
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse(axiosParams)
        })

        after(() => SpyMock.restoreAll())

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })
    })

    context('when `params` are `null`', () => {
      context('when `API_URL` is not `null`', () => {
        let axiosParams = {}
        let spies = {}

        before(async () => {
          axiosParams = {
            url     : process.env.API_URL,
            method  : process.env.API_METHOD,
            headers : JSON.parse(process.env.API_HEADERS),
            data    : JSON.parse(process.env.API_POST_BODY),
            params  : JSON.parse(process.env.API_QUERY_STRING)
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse()
        })

        after(() => SpyMock.restoreAll())

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `API_URL` is `null`', () => {
        const url = process.env.API_URL

        let spies = {}

        before(async () => {
          process.env.API_URL = ''

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse()
        })

        after(async () => {
          SpyMock.restoreAll()

          process.env.API_URL = url
        })

        it('should not call `axios`', () => {
          expect(spies.axios).not.to.be.calledOnce
        })
      })

      context('when `API_HEADERS` is `null`', () => {
        const headers = process.env.API_HEADERS

        let axiosParams = {}
        let spies = {}

        before(async () => {
          process.env.API_HEADERS = ''

          axiosParams = {
            url     : process.env.API_URL,
            method  : process.env.API_METHOD,
            headers : null,
            data    : JSON.parse(process.env.API_POST_BODY),
            params  : JSON.parse(process.env.API_QUERY_STRING)
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse()
        })

        after(async () => {
          SpyMock.restoreAll()

          process.env.API_HEADERS = headers
        })

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `API_POST_BODY` is `null`', () => {
        const body = process.env.API_POST_BODY

        let axiosParams = {}
        let spies = {}

        before(async () => {
          process.env.API_POST_BODY = ''

          axiosParams = {
            url     : process.env.API_URL,
            method  : process.env.API_METHOD,
            headers : JSON.parse(process.env.API_HEADERS),
            data    : null,
            params  : JSON.parse(process.env.API_QUERY_STRING)
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse()
        })

        after(async () => {
          SpyMock.restoreAll()

          process.env.API_POST_BODY = body
        })

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })

      context('when `API_QUERY_STRING` is `null`', () => {
        const queryString = process.env.API_QUERY_STRING

        let axiosParams = {}
        let spies = {}

        before(async () => {
          process.env.API_QUERY_STRING = ''

          axiosParams = {
            url     : process.env.API_URL,
            method  : process.env.API_METHOD,
            headers : JSON.parse(process.env.API_HEADERS),
            data    : JSON.parse(process.env.API_POST_BODY),
            params  : null
          }

          spies = {
            axios: SpyMock
              .addDependencySpy(StatusService, 'axios')
          }

          await StatusService.getAPIResponse()
        })

        after(async () => {
          SpyMock.restoreAll()

          process.env.API_QUERY_STRING = queryString
        })

        it('should call `axios` with env var params', () => {
          expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
        })
      })
    })
  })

  describe('.getAPIStatus', () => {
    context('when `status: 200`', () => {
      const STATUS_CODE = 200
      const STATUS = StatusService.STATUS.OPERATIONAL

      let status

      before(async () => {
        status = await StatusService.getAPIStatus(STATUS_CODE)
      })

      it(`should return \`${STATUS}\``, () => {
        expect(status).to.eql(STATUS)
      })
    })

    context('when `status: 400`', () => {
      const STATUS_CODE = 400
      const STATUS = StatusService.STATUS.PARTIAL_OUTAGE

      let status

      before(async () => {
        status = await StatusService.getAPIStatus(STATUS_CODE)
      })

      it(`should return \`${STATUS}\``, () => {
        expect(status).to.eql(STATUS)
      })
    })

    context('when `status: 500`', () => {
      const STATUS_CODE = 500
      const STATUS = StatusService.STATUS.MAJOR_OUTAGE

      let status

      before(async () => {
        status = await StatusService.getAPIStatus(STATUS_CODE)
      })

      it(`should return \`${STATUS}\``, () => {
        expect(status).to.eql(STATUS)
      })
    })

    context('when `status` is not mapped', () => {
      const STATUS_CODE = 404
      const STATUS = StatusService.STATUS.DEGRADED_PERFORMANCE

      let status

      before(async () => {
        status = await StatusService.getAPIStatus(STATUS_CODE)
      })

      it(`should return \`${STATUS}\``, () => {
        expect(status).to.eql(STATUS)
      })
    })
  })

  describe('.updateStatusPage', () => {
    context('when `status: 1`', () => {
      const STATUS = StatusService.STATUS.OPERATIONAL
      const STATUS_CODE = 1

      let spies = {}

      before(async () => {
        const lambdaResponseMock = {
          Payload: {}
        }

        spies = {
          invoke: SpyMock
            .addDependencySpy(StatusService, 'lambda.invoke', { promise: async () => lambdaResponseMock }, false)
        }

        await StatusService.updateStatusPage(STATUS)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `component` with `status: 1', () => {
        const payload = spies.invoke
          .getCall(0).args[0].Payload

        expect(JSON.parse(payload).body.status).to.eql(STATUS_CODE)
      })
    })

    context('when `status: 4`', () => {
      const STATUS = StatusService.STATUS.PARTIAL_OUTAGE
      const STATUS_CODE = 4

      let spies = {}

      before(async () => {
        const lambdaResponseMock = {
          Payload: {}
        }

        spies = {
          invoke: SpyMock
            .addDependencySpy(StatusService, 'lambda.invoke', { promise: async () => lambdaResponseMock }, false)
        }

        await StatusService.updateStatusPage(STATUS)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `component` with `status: 4', () => {
        const payload = spies.invoke
          .getCall(0).args[0].Payload

        expect(JSON.parse(payload).body.status).to.eql(STATUS_CODE)
      })
    })

    context('when `componentIds` is not `null`', () => {
      const STATUS = StatusService.STATUS.OPERATIONAL
      const COMPONENT_IDS = '1,2,3'

      let spies = {}

      before(async () => {
        const lambdaResponseMock = {
          Payload: {}
        }

        spies = {
          invoke: SpyMock
            .addDependencySpy(StatusService, 'lambda.invoke', { promise: async () => lambdaResponseMock }, false)
        }

        await StatusService.updateStatusPage(STATUS, COMPONENT_IDS)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `componentIds` from params', () => {
        const payload = spies.invoke
          .getCall(0).args[0].Payload

        expect(JSON.parse(payload).body.componentIds).to.eql(COMPONENT_IDS)
      })
    })

    context('when `componentIds` is `null`', () => {
      const STATUS = StatusService.STATUS.OPERATIONAL
      const COMPONENT_IDS = process.env.COMPONENT_IDS

      let spies = {}

      before(async () => {
        const lambdaResponseMock = {
          Payload: {}
        }

        spies = {
          invoke: SpyMock
            .addDependencySpy(StatusService, 'lambda.invoke', { promise: async () => lambdaResponseMock }, false)
        }

        await StatusService.updateStatusPage(STATUS)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `componentIds` from env vars', () => {
        const payload = spies.invoke
          .getCall(0).args[0].Payload

        expect(JSON.parse(payload).body.componentIds).to.eql(COMPONENT_IDS)
      })
    })
  })

  describe('.updateStatus', () => {
    context('when `webAPIResponse` is not `null`', () => {
      context('when `webAPIResponse` is `200`', () => {
        const STATUS = 200
        const STATUS_CODE = StatusService.STATUS.OPERATIONAL

        let response = null
        let spies = {}

        before(async () => {
          spies = {
            getAPIResponse: SpyMock
              .addReturnSpy(StatusService, 'getAPIResponse', { status : STATUS }),

            updateStatusPage: SpyMock
              .addReturnSpy(StatusService, 'updateStatusPage')
          }

          response = await StatusService.updateStatus()
        })

        after(() => SpyMock.restoreAll())

        it('should return the `API` `statusCode`', () => {
          expect(response).to.eql(STATUS_CODE)
        })

        it('should call `.updateStatusPage` once', () => {
          expect(spies.updateStatusPage).to.be.calledOnce
        })
      })

      context('when `webAPIResponse` is `400 || 500`', () => {
        const STATUS = 400
        const STATUS_CODE = StatusService.STATUS.PARTIAL_OUTAGE

        let response = null
        let spies = {}

        before(async () => {
          const apiMock = {
            response: { status : STATUS }
          }

          spies = {
            getAPIResponse: SpyMock
              .addExceptionSpy(StatusService, 'getAPIResponse', apiMock),

            updateStatusPage: SpyMock
              .addReturnSpy(StatusService, 'updateStatusPage')
          }

          response = await StatusService.updateStatus()
        })

        after(() => SpyMock.restoreAll())

        it('should return the `API` `statusCode`', () => {
          expect(response).to.eql(STATUS_CODE)
        })

        it('should call `.updateStatusPage` once', () => {
          expect(spies.updateStatusPage).to.be.calledOnce
        })
      })
    })

    context('when `webAPIResponse`is `null`', () => {
      let status = null

      before(async () => {
        SpyMock
          .addReturnSpy(StatusService, 'getAPIResponse')

        status = await StatusService.updateStatus()
      })

      after(() => SpyMock.restoreAll())

      it('should return `null`', () => {
        expect(status).not.to.exist
      })
    })
  })
})