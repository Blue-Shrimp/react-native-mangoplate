import { Utility } from '@common'

const ContentType = {
  Form: 'application/x-www-form-urlencoded; charset=utf-8',
  Json: 'application/json; charset=utf-8',
}

/**
 * headers: data to add to the http header. format {key: value, key: value...}
 * params: key/value data to add to http body format {key: value, key: value...}
 */
/*
method = 'POST',
	contentType = ContentType.Json,
	requestUrl,
	headers = {},
	params = {},
*/
global.String.prototype.Get = function (params) {
  return FetchUrl('GET', ContentType.Form, this, {}, params)
}
/**
 * params: key/value data to add to http body format {key: value, key: value...}
 */
global.String.prototype.doPut = function (params) {
  return FetchUrl('PUT', ContentType.Json, this, {}, params)
}
/**
 * params: key/value data to add to http body format {key: value, key: value...}
 */
global.String.prototype.doPost = function (params) {
  return FetchUrl('POST', ContentType.Json, this, {}, params)
}
/**
 * params: key/value data to add to http body format {key: value, key: value...}
 */
global.String.prototype.doDelete = function (params) {
  return FetchUrl('DELETE', ContentType.Json, this, {}, params)
}

const FetchUrl = async (method = 'POST', contentType = ContentType.Json, requestUrl, headers = {}, params = {}) => {
  if (Utility.isNil(params)) {
    params = {}
  }

  if (method === 'GET') {
    requestUrl = encodeURI('{0}{1}'.format(requestUrl, buildBody('?', params)))
  }

  return await fetch(requestUrl, {
    method: method,
    credentials: 'include',
    headers: await buildHeader(contentType, headers),
  })
    .then(async response => {
      if (response.status === 200) {
        return response.json()
      } else {
        return response.json()
      }
    })
    .catch(error => {
      return Promise.reject(error?.result)
    })
}

const buildHeader = async (contentType, params) => {
  var headers = {
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    'Content-Type': contentType,
  }

  Object.entries(params).map((item, index) => {
    headers[item[0]] = item[1]
  })

  console.log('===== Network Header start =====')
  console.log(headers)
  console.log('===== Network Header end =====')
  return headers
}

function buildBody(prefix, params) {
  if (Utility.isNil(params)) {
    return {}
  }

  var body = ''
  Object.entries(params).map((item, index) => {
    let value = item[1]
    if (value instanceof Array || value instanceof Map) {
      value = JSON.stringify(value)
    }
    if (index === 0) {
      body = '{0}{1}={2}'.format(prefix, item[0], value)
    } else {
      body = '{0}&{1}={2}'.format(body, item[0], value)
    }
  })
  console.log('===== Network buildBody start =====')
  console.log(body)
  console.log('===== Network buildBody end =====')

  return body
}

global.String.prototype.format = function () {
  let original = this
  for (arg in arguments) {
    original = original.replace('{' + arg + '}', arguments[arg])
  }
  return original
}
