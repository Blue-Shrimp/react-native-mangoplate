import { Utility } from '@common'

const kakaoKeywordUrl = 'https://dapi.kakao.com/v2/local/search/address.json'
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

  getAddressByKeyword: async params => {
    let option = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'KakaoAK ' + kakaoRestApiKey,
      },
    }
    return await fetch(kakaoKeywordUrl + '?page=1&size=10&query=' + params.keyword, option)
      .then(response => {
        if (response.status == 200) {
          return response.json()
        } else {
          return Object.assign({
            data: [],
          })
        }
      })
      .then(responseJson => {
        return Object.assign({
          data: responseJson?.documents.reduce((results = [], value) => {
            const location = { latitude: Number(value.y), longitude: Number(value.x) }
            const address = value.address
            results.push(
              Object.assign({
                value: address.address_name,
                name:
                  address.region_3depth_h_name !== ''
                    ? address.region_3depth_h_name
                    : address.region_2depth_name !== ''
                    ? address.region_2depth_name
                    : address.region_1depth_name,
                location: location,
              }),
            )
            return results
          }, []),
        })
      })
      .catch(error => {
        console.log('error1212 : ', error)
        return Object.assign({
          data: [],
        })
      })
  },
}

export { KakaoService }
