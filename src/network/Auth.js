import { URI } from './Common.js'

export async function login(params = {}) {
  if (URI.Auth.useMock) {
    return await Promise.resolve(URI.Auth.mock)
  }
  return await URI.Auth.login.Get(params)
}

export async function join(params = {}) {
  return await URI.Auth.join.doPost(params)
}

export async function refresh(params = {}) {
  return await URI.Auth.refresh.doPost(params)
}

export async function logout(params = {}) {
  return await URI.Auth.logout.doPost(params)
}
