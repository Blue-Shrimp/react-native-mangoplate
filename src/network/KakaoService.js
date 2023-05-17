import { Utility } from '@common'

const kakaoKeywordUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json'
const kakakoCoordUrl = 'https://dapi.kakao.com/v2/local/geo/coord2address.json'
const kakaoRestApiKey = 'bad23c84cd5372dcbfdc2bc0a89a48da'
const KakaoService = {
  getAddressByCoordinate: async myLocation => {
    let option = {
      method: 'GET',
      headers: {
        // Accept: 'application/json',
        Authorization: 'KakaoAK ' + kakaoRestApiKey,
      },
    }
    return await fetch(kakakoCoordUrl + '?x=' + myLocation.longitude + '&y=' + myLocation.latitude, option)
      .then(response => {
        if (response.status == 200) {
          return response.json()
        } else {
          console.log('errorerrorerrorerrorerror : ', response)
        }
      })
      .then(responseJson => {
        return responseJson?.documents || []
      })
      .catch(error => {
        console.log('error : ', error)
      })
  },
}

export { KakaoService }
