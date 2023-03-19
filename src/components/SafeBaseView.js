import React, { useState, useEffect } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, TouchableWithoutFeedback, StatusBar, Platform } from 'react-native'
import PropTypes from 'prop-types'
import { Utility } from '@common'
import NavigationTitleBar from './NavigationTitleBar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const _backgroundColor = props => {
  return props.style?.backgroundColor || 'white'
}

const _titleBar = props => {
  if (props.hasTitleBar) {
    return <NavigationTitleBar style={[styles.titleBar]} title={props.title} isModal={props.isModal} {...props.navigationBarOptions} />
  } else {
    return null
  }
}

export const SafeBaseView = props => {
  const useSafeAreaInsetsValue = useSafeAreaInsets()
  const statusHeight = StatusBar.currentHeight
  const __mainContainerBt = {
    marginTop: ScreenInfo.statusBarHeight(useSafeAreaInsetsValue.top),
    marginBottom: ScreenInfo.safeAreaBottomMargin(useSafeAreaInsetsValue.bottom),
  }

  const _mainView = () => {
    return (
      <View style={[styles.mainContainer, __mainContainerBt, props.modalContentStyle]}>
        {_titleBar(props)}
        {props.children}
      </View>
    )
  }

  return props.isKeyboardBase ? (
    <KeyboardAvoidingView
      style={[styles.keyboardViewStyle, _backgroundColor(props), props.style]}
      keyboardVerticalOffset={props.keyboardVerticalOffset}
      behavior="padding"
      enabled>
      {_mainView()}
      {props.modalView}
      {/*{props.alertView}*/}
    </KeyboardAvoidingView>
  ) : (
    <View style={[props.isModal ? styles.modal : styles.container, _backgroundColor(props), props.style]}>
      {_mainView()}
      {props.modalView}
      {/*{props.alertView}*/}
    </View>
  )
}

SafeBaseView.options = () => {
  return {
    topBar: {
      visible: false,
      _height: 0,
      drawBehind: true,
    },
    //statusBarStyle: 'dark-content',
  }
}

SafeBaseView.propTypes = {
  modalView: PropTypes.node,
}

SafeBaseView.defaultProps = {
  children: [],
  isModal: false,
  alertView: null,
  modalView: null,
  isKeyboardBase: false,
  useKeyboardAware: false,
  useTitleShadow: false,
  hasTitleBar: true,
  titleBarStyle: {},
  navigationBarOptions: {
    skipRight: true,
  },
  loading: false,
  keyboardVerticalOffset: 0,
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  titleBar: {
    marginTop: 0,
    marginHorizontal: 0,
    width: ScreenInfo.width,
    minHeight: 50,
    zIndex: 1,
  },
  keyboardViewStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  touchableStyle: {
    flex: 1,
    margin: 0,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    marginTop: ScreenInfo.statusBarHeight(),
    marginBottom: ScreenInfo.safeAreaBottomMargin(),
    backgroundColor: 'white',
  },
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ScreenInfo.width,
    height: Platform.OS === 'ios' ? ScreenInfo.height : '100%',

    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    zIndex: 1,
    backgroundColor: 'white',
  },
})

export default SafeBaseView

export const BaseView = props => {
  return <View {...props}>{children}</View>
}
