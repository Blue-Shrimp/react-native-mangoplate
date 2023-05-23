import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Utility } from '@common'

const tabButtonWidth = ScreenInfo.width / 2 - 18
const SearchTabView = ({ items, selectedIndex, onSelectTab, style }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  const _onPress = (index, item) => {
    if (Utility.isNil(onSelectTab)) {
      return
    }

    setCurrentIndex(index)
    onSelectTab(index, item)
  }

  let views = items.reduce((result = [], item, index) => {
    result.push(
      <TouchableOpacity
        testID={item.title}
        key={index}
        activeOpacity={1}
        onPress={() => {
          _onPress(index, item)
        }}>
        <View style={index === currentIndex ? styles.activeText : styles.normalText}>
          <Text style={index === currentIndex ? textStyles.active : textStyles.normal}>{item.title}</Text>
        </View>
      </TouchableOpacity>,
    )
    return result
  }, [])

  return <View style={[styles.container, style]}>{views}</View>
}

SearchTabView.defaultProps = {
  selectedIndex: 0,
  items: [],
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8,
    marginHorizontal: 18,
    minHeight: 45,
  },
  tabButton: {
    width: tabButtonWidth,
    backgroundColor: 'transparent',
  },
  normalText: {
    width: tabButtonWidth,
    minHeight: 45,
    justifyContent: 'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
  },
  activeText: {
    width: tabButtonWidth,
    minHeight: 45,
    justifyContent: 'center',
    borderBottomColor: '#ef8835',
    borderBottomWidth: 2,
  },
})

const textStyles = StyleSheet.create({
  normal: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'lightgray',
  },
  active: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#ef8835',
  },
})

export default SearchTabView
