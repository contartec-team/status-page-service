'use strict'

const axios = require('axios')

const API_KEY = process.env.STATUS_PAGE_API_KEY
const DEFAULT_PAGE_ID = process.env.STATUS_PAGE_PAGE_ID

const URL = 'https://api.statuspage.io/v1/pages'

/**
 * Service that handle updates to [`Status Page`](https://www.atlassian.com/software/statuspage)
 * @class StatusPageIOService
*/
class StatusPageIOService {

  /**
   * The list of `component` `status`
   * @enum {Object} COMPONENT_STATUS
  */
  static get STATUS() {
    return {
      OPERATIONAL           : 'operational',
      UNDER_MAINTENANCE     : 'under_maintenance',
      DEGRADED_PERFORMANCE  : 'degraded_performance',
      PARTIAL_OUTAGE        : 'partial_outage',
      MAJOR_OUTAGE          : 'major_outage'
    }
  }

  /**
   * The list of `component` `status` numbers
   * @enum {Object} COMPONENT_STATUS_NUMBER
  */
  static get STATUS_NUMBER() {
    return {
      1: StatusPageIOService.STATUS.OPERATIONAL,
      2: StatusPageIOService.STATUS.UNDER_MAINTENANCE,
      3: StatusPageIOService.STATUS.DEGRADED_PERFORMANCE,
      4: StatusPageIOService.STATUS.PARTIAL_OUTAGE,
      5: StatusPageIOService.STATUS.MAJOR_OUTAGE
    }
  }

  /**
   * Default `headers`
   * @type {Object}
  */
  static get DEFAULT_HEADERS() {
    return {
      Authorization: `OAuth ${API_KEY}`
    }
  }

  /**
   * Updates the `component` status
   *
   * @param {string} id The `component` id
   * @param {string} status The `component` status (@see {link StatusPageIOService.COMPONENT_STATUS})
   * @param {string} [pageId] The `page` id
   *
   * @return {Promise<Object>} The http response
  */
  static updateComponentStatus(id, status, pageId = DEFAULT_PAGE_ID) {
    let promise = null

    if (id && status) {
      const url = `${URL}/${pageId}/components/${id}`

      promise = axios({
        url,
        method  : 'PUT',
        headers : StatusPageIOService.DEFAULT_HEADERS,
        data    : {
          component: {
            status
          }
        }
      })
    }

    return promise
  }

  /**
   * Updates the `components` status
   *
   * @param {string | Array<string>} componentIds The `components` ids
   * @param {string} status The `component` status (@see {link StatusPageIOService.COMPONENT_STATUS})
   * @param {string} [pageId] The `page` id
   *
   * @return {Promise<Array>} The http responses
  */
  static updateComponentsStatus(componentIds, status, pageId = DEFAULT_PAGE_ID) {
    let responses = []

    if (componentIds && status) {
      let componentIdsTemp = [ ...componentIds ]

      if (typeof(componentIds) === 'string') {
        componentIdsTemp = componentIds
          .replace(/ /g, '')
          .split(',')
      }

      const promises = componentIdsTemp
        .map(id => {
          return StatusPageIOService
            .updateComponentStatus(id, status, pageId)
        })
      
      responses = Promise.all(promises)
    }

    return responses
  }
}

module.exports = StatusPageIOService