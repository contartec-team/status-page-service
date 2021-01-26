'use strict'

require('dotenv').config()

const rewire = require('rewire')

const StatusPageIOService = rewire('../../lib/services/StatusPageIOService')

const SpyMock = require('@contartec-team/spy-mock/lib/SpyMock')

describe('StatusPageIOService', () => {
  describe('updateComponentStatus', () => {
    context('when `id` and `status` are not `null`', () => {
      const ID = 'la'
      const status = 'operational'

      let axiosParams = {}
      let spies = {}

      before(async () => {
        axiosParams = { 
          url     : 'https://api.statuspage.io/v1/pages/lalaId/components/la',
          method  : 'PUT',
          headers : StatusPageIOService.DEFAULT_HEADERS,
          data    : {
            component: {
              status
            }
          }
        }

        spies = {
          axios: SpyMock
            .addDependencySpy(StatusPageIOService, 'axios')
        }

        await StatusPageIOService.updateComponentStatus(ID, status)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `components`', () => {
        expect(spies.axios.getCall(0).args[0]).to.eql(axiosParams)
      })
    })

    context('when `id` and `status` are `null`', () => {
      let spies = {}

      before(async () => {
        spies = {
          axios: SpyMock
            .addDependencySpy(StatusPageIOService, 'axios')
        }

        await StatusPageIOService.updateComponentStatus()
      })

      after(() => SpyMock.restoreAll())

      it('should not handle the `event`', () => {
        expect(spies.axios).to.not.have.been.calledOnce
      })
    })
  })

  describe('updateComponentsStatus', () => {
    context('when `componentIds` and `status` are not `null`', () => {
      const componentIds = ['la', 'le', 'ha']
      const status = 'operational'

      let spies = {}

      before(async () => {
        spies = {
          updateComponentStatus: SpyMock
            .addReturnSpy(StatusPageIOService, 'updateComponentStatus')
        }

        await StatusPageIOService.updateComponentsStatus(componentIds, status)
      })

      after(() => SpyMock.restoreAll())

      it('should update the `components`', () => {
        expect(spies.updateComponentStatus).to.be.calledThrice
      })
    })

    context('when `componentIds` and `status` are `null`', () => {
      let spies = {}

      before(async () => {
        spies = {
          updateComponentStatus: SpyMock
            .addReturnSpy(StatusPageIOService, 'updateComponentStatus')
        }

        await StatusPageIOService.updateComponentsStatus()
      })

      after(() => SpyMock.restoreAll())

      it('should update the `components`', () => {
        expect(spies.updateComponentStatus).to.not.have.been.calledOnce
      })
    })
  })
})