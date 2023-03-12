import { URI } from './Common.js'

export async function fetchMainList(params = {}) {
  return await URI.Main.mainList.Get(params)
}
