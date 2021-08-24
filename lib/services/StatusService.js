'use strict'

const AWS = require('aws-sdk')
const axios = require('axios')

const lambda = new AWS.Lambda({
  region: 'us-west-2'
})

const DEFAULT_LAMBDA_PARAMS = {
  FunctionName    : `status-page-update-${process.env.STAGE}-http`,
  InvocationType  : 'RequestResponse'
}

/**
 * Status page status list
 * @type {Object}
 * @memberof StatusService
*/
const STATUS = {
  OPERATIONAL           : 1,
  UNDER_MAINTENANCE     : 2,
  DEGRADED_PERFORMANCE  : 3,
  PARTIAL_OUTAGE        : 4,
  MAJOR_OUTAGE          : 5
}

const COMPONENT_IDS = process.env.COMPONENT_IDS

/**
 * Handle `Status Page` updates
 * @class StatusService
*/
class StatusService {

  static get STATUS()           { return STATUS }

  static get API_URL()          { return process.env.API_URL }
  static get API_METHOD()       { return process.env.API_METHOD }
  static get API_QUERY_STRING() { return process.env.API_QUERY_STRING }
  static get API_POST_BODY()    { return process.env.API_POST_BODY }
  static get API_HEADERS()      { return process.env.API_HEADERS }


  /**
   * Return the env var params
   *
   * @return {Object} The API env vars
  */
  static get DEFAULT_AXIOS_PARAMS() {
    const data = StatusService.API_POST_BODY ?
      JSON.parse(StatusService.API_POST_BODY) :
      null

    const params = StatusService.API_QUERY_STRING ?
      JSON.parse(StatusService.API_QUERY_STRING) :
      null

    const headers = StatusService.API_HEADERS ?
      JSON.parse(StatusService.API_HEADERS) :
      null

    const defaultParams = {
      url     : StatusService.API_URL,
      method  : StatusService.API_METHOD,
      headers,
      data,
      params
    }

    return defaultParams
  }

  /**
   * Return the web API
   *
   * @param {Object} params The axios params
   * @param {Object} params.url The server url
   * @param {Object} params.method The request method
   * @param {Object} params.headers The headers request
   * @param {Object} params.data The body request
   * @param {Object} params.params The URL parameters
   *
   * @return {Object} The axios response
  */
  static getAPIResponse(params = {}) {
    let webAPIResponse = null

    const paramsTemp = {
      ...StatusService.DEFAULT_AXIOS_PARAMS,
      ...params
    }

    if (paramsTemp.url)
      webAPIResponse = axios(paramsTemp)

    return webAPIResponse
  }

  /**
   * Return the API status
   *
   * @param {(StatusService.STATUS | Number)} status The http status code
   *
   * @return {StatusService.STATUS} The API status
  */
  static getAPIStatus(status) {
    let response = null

    switch (status) {
      case 200:
        response = STATUS.OPERATIONAL
        break
      case 400:
        response = STATUS.PARTIAL_OUTAGE
        break
      case 500:
        response = STATUS.MAJOR_OUTAGE
        break
      default:
        response = STATUS.DEGRADED_PERFORMANCE
        break
    }

    return response
  }

  /**
   * Updates the `Status Page` with `status`
   *
   * @param {(StatusService.STATUS | Number)} status The new status
   * @param {Array<string>} [componentIds = COMPONENT_IDS] The `Status Page` components ids separeted by comma
   *
   * @return {Promise} The lambda response invocation
  */
  static updateStatusPage(status, componentIds = COMPONENT_IDS) {
    const lambdaParams = {
      ...DEFAULT_LAMBDA_PARAMS,
      Payload: JSON
        .stringify({
          body: {
            status,
            componentIds
          }
        })
    }

    return lambda
      .invoke(lambdaParams)
      .promise()
  }

  /**
   * Updates the component(s) `status`
   * @async
   *
   * @param {Object} [params] The axios params (@see {@link StatusService.getAPIResponse})
   *
   * @return {StatusService.STATUS} The API status
  */
  static async updateStatus(params = {}) {
    let webAPIResponse = null

    try {
      webAPIResponse = await StatusService
        .getAPIResponse(params)

      console
        .warn(`[StatusService.updateStatus] ${new Date().toJSON()} webAPIResponse`, {
          webAPIResponse
        })
    }
    catch (e) {
      webAPIResponse = e.response

      console
        .error(`[StatusService.updateStatus] ${new Date().toJSON()} error`, {
          error: e.message,
          stack: e.stack,
          e
        })
    }

    let status = null

    if (webAPIResponse) {
      console
        .warn(`[StatusService.updateStatus] ${new Date().toJSON()} webAPIResponse ${webAPIResponse.status}`, {
          body    : webAPIResponse.body,
          headers : webAPIResponse.headers
        })

      status = StatusService.getAPIStatus(webAPIResponse.status)

      await StatusService.updateStatusPage(status)
    }

    return status
  }
}

module.exports = StatusService