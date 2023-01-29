import Config from 'react-native-config'

global.appConfig = {
  envName: Config.ENV,
  buildVersion: Config.BUILD_VERSION,
  appVersion: Config.APP_VERSION,
  appName: Config.APP_NAME,
  appId: Config.APP_ID,
}
