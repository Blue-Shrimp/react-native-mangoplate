import RNDeviceInfo from 'react-native-device-info'
import { Platform, Dimensions, PixelRatio, NativeModules } from 'react-native'

const currentLocale = (
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager?.settings.AppleLocale || NativeModules.SettingsManager?.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier
)?.split(/[^A-Za-z]/)[0]

const deviceInfo = async () => {
  const info = {
    model: await RNDeviceInfo.getModel(),
    osName: await RNDeviceInfo.getSystemName(),
    osVersion: await RNDeviceInfo.getSystemVersion(),
    deviceId: await RNDeviceInfo.getUniqueId(),
    appVersion: RNDeviceInfo.getVersion(),
  }
  return JSON.stringify(info)
}

const _maxRatio = 1
const _pixelRatio = PixelRatio.get()
const _androidBaseDpi = 420.0
const _currentDpi = 160.0 * _pixelRatio
const _iosBaseWidth = 375.0
const _iosBaseHeight = 667.0
const _currentDpiRatio = Math.min(_currentDpi / _androidBaseDpi, _maxRatio)

global.DeviceUtility = {
  isIos: Platform.OS === 'ios' ? true : false,
  isIPhone5: Platform.OS === 'ios' && Dimensions.get('window').height === 568 ? true : false,
  isIPhonePlus: Platform.OS === 'ios' && Dimensions.get('window').height === 812 ? true : false,
  isIPhoneX: Platform.OS === 'ios' && Dimensions.get('window').height === 812 ? true : false,
  isIPhoneXSMax: Platform.OS === 'ios' && Dimensions.get('window').height === 926 ? true : false,
  isIPhoneXSR: Platform.OS === 'ios' && [896, 844, 926].includes(Dimensions.get('window').height) ? true : false,
  isSmallest: Platform.OS === 'ios' && Dimensions.get('window').height === 480 ? true : false,
  isIphoneXs: [812, 844, 896, 926].includes(Dimensions.get('window').height),

  isDevice: !RNDeviceInfo.isEmulator,
  deviceType: Platform.OS === 'ios' ? 'ios' : 'android',
  currentLocale: currentLocale,
}

global.ScreenInfo = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  screen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  titleBarHeight: 50,
  statusBarHeight: (value = -1) => (Platform.OS === 'ios' ? (DeviceUtility.isIphoneXs ? (value > 0 ? value : 44) : 20) : value > 0 ? value : 0),
  safeAreaBottomMargin: (value = -1) => (Platform.OS === 'ios' ? (DeviceUtility.isIphoneXs ? (value > 0 ? value : 34) : 0) : value > 0 ? value : 0),
  bottomSheetHeight: (value = -1) =>
    Dimensions.get('window').height - (Platform.OS === 'ios' ? (DeviceUtility.isIphoneXs ? (value > 0 ? value : 44) : 20) : 40),
}

global.ScreenRatio = {
  wRatio: Platform.OS === 'ios' ? ScreenInfo.width / _iosBaseWidth : _currentDpiRatio,
  hRatio: Platform.OS === 'ios' ? (DeviceUtility.isSmallest ? 667.0 / _iosBaseHeight : _maxRatio) : _currentDpiRatio,
}

export { deviceInfo }
