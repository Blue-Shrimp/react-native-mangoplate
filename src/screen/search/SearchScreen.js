import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Text, Keyboard, FlatList, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeBaseView } from '@components'
import { SearchKeywords } from '@common'
import SearchTabView from './SearchTabView'
import { actions as searchActions, states as searchStates } from '@screens/search/state'
import { states as mainStates, actions as mainActions } from '@screens/main/state'
import FoodListView from '@screens/main/subviews/FoodListView'

const SearchType = {
  Recommend: 'Recommend',
  Recent: 'Recent',
  None: 'None',
}

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { recommendKeywords, recentKeywords, addresses, searchList, pageInfo, loading } = useSelector(searchStates)
  const { myLocation, isLocationPermission } = useSelector(mainStates)
  const page = useRef(1)
  const [isSearch, setIsSearch] = useState(false)
  const inputRef = useRef(null)
  const [datas, setDatas] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchInfo, setSearchInfo] = useState({
    type: SearchType.Recommend,
    words: '',
    recommendDatas: [recommendKeywords],
    recentDatas: [recentKeywords],
    addressDatas: [addresses],
  })

  useEffect(() => {
    return () => {
      setSearchText('')
      dispatch(searchActions.reset())
    }
  }, [])

  useEffect(() => {
    if (searchText === '') {
      setSearchInfo({
        ...searchInfo,
        ...{ type: SearchType.Recommend, words: searchText, recommendDatas: [recommendKeywords] },
      })
      return
    }

    setSearchInfo({
      ...searchInfo,
      ...{ type: SearchType.None, words: searchText, addressDatas: [addresses] },
    })
  }, [addresses])

  console.log('recommendKeywords : ', recommendKeywords)
  console.log('recentKeywords : ', recentKeywords)
  console.log('addresses : ', addresses)

  useEffect(() => {
    switch (searchInfo.type) {
      case 'Recommend':
        setDatas(searchInfo.recommendDatas || [])
        break
      case 'Recent':
        setDatas(searchInfo.recentDatas || [])
        break
      default:
        setDatas(searchInfo.addressDatas || [])
    }
  }, [searchInfo])

  const _onChangeText = text => {
    setSearchText(text)
    dispatch(searchActions.fetchAddress({ keyword: text }))
  }

  const _onSearch = () => {
    if (searchText === '') {
      return
    }
    Keyboard.dismiss()
    dispatch(searchActions.fetchAddress({ keyword: searchText }))
  }

  const _onSelectTab = (index, item) => {
    if (searchInfo.type === item.title) {
      return
    }

    switch (item.title) {
      case SearchType.Recommend:
        setSearchText(searchInfo.words)
        break
      case SearchType.Recent:
        setSearchText(searchInfo.words)
        break
      default:
        setSearchText('')
        break
    }

    setSearchInfo({ ...searchInfo, ...{ type: item.title === '추천 검색어' ? SearchType.Recommend : SearchType.Recent } })
  }

  const _leftButtons = () => [
    <View key={1} style={{ flexDirection: 'row', marginLeft: 10 }}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Image resizeMode={'contain'} source={require('@images/leftArrow.png')} style={{ width: 30, height: 30 }}></Image>
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={{
          flex: 1,
          marginLeft: 20,
          marginRight: 5,
          backgroundColor: 'transparent',
          fontSize: 15,
        }}
        placeholder={'키워드로 검색해보세요.'}
        placeholderTextColor={'lightgray'}
        onChangeText={_onChangeText}
        autoCapitalize={'none'}
        autoCorrect={false}
        defaultValue={searchText}
        autoFocus
        textAlignVertical={'center'}
        underlineColorAndroid={'transparent'}
        returnKeyType={'search'}
        keyboardType={'default'}
        keyboardAppearance={'default'}
        onSubmitEditing={_onSearch}
        value={searchText}
        onFocus={() => {
          dispatch(searchActions.setSearchList([]))
          dispatch(searchActions.fetchAddress({ keyword: searchText }))
          setIsSearch(false)
        }}
      />
    </View>,
  ]

  const _renderItem = ({ item, index }) => {
    console.log('item : ', item)
    return (
      <View style={{ marginHorizontal: 18, height: 50, justifyContent: 'center' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          activeOpacity={1}
          onPress={() => {
            setSearchText(item.value)
            SearchKeywords.add(item.value)
            setIsSearch(true)
            setSearchInfo({ ...searchInfo, ...{ type: SearchType.None } })
            dispatch(
              searchActions.fetchSearchFoodList({
                params: {
                  guBun: 'avg',
                  curPage: page.current,
                  keyword: item.name,
                },
              }),
            )
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('@images/search.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
            <Text style={{ fontSize: 15 }}>{item.value}</Text>
          </View>
          {searchInfo.type === SearchType.Recent ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'lightgray', marginRight: 15 }}>{item.date}</Text>
              <TouchableOpacity onPress={() => _onDeleteRecentItem(item)}>
                <Image source={require('@images/close.png')} style={{ width: 15, height: 15 }}></Image>
              </TouchableOpacity>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  const _onDeleteRecentItem = item => {
    SearchKeywords.delete(item.value)
    setSearchInfo({
      ...searchInfo,
      ...{ recentDatas: [SearchKeywords.keywords()] },
    })
  }

  return (
    <SafeBaseView style={{ flex: 1 }} hasTitleBar={true} navigationBarOptions={{ skipLeft: false, leftButtons: _leftButtons() }}>
      <View style={styles.container}>
        {searchText !== '' ? null : (
          <SearchTabView
            items={[
              { id: 0, title: '추천 검색어' },
              { id: 1, title: '최근 검색어' },
            ]}
            selectedIndex={searchInfo.type === SearchType.Recommend ? 0 : searchInfo.type === SearchType.Recent ? 1 : 0}
            onSelectTab={_onSelectTab}
          />
        )}
        {isSearch ? (
          <ScrollView>
            <FoodListView data={searchList} region={['']} />
          </ScrollView>
        ) : (
          <FlatList data={datas[0]?.data} renderItem={_renderItem} keyExtractor={(item, index) => index} />
        )}
      </View>
    </SafeBaseView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default SearchScreen
