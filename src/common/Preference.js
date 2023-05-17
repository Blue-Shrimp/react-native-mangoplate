import Preference from 'react-native-preference'

const Storage = {
  clearAll: () => {
    Preference.clear()
    return true
  },
}

global.Storage = Storage
global.String.prototype.setValue = function (value) {
  this.valueOf().setWhiteList()
  switch (typeof value) {
    case 'boolean':
    case 'number':
      Preference.set(this.valueOf(), '{0}'.format(value))
      break
    case 'string':
      Preference.set(this.valueOf(), '{0}'.format(value))
      break
    case 'object':
      Preference.set(this.valueOf(), JSON.stringify(value))
      break
  }
  return true
}

// 안드로이드 전용
global.String.prototype.setWhiteList = function () {
  const storage = Preference.get()
  const keys = Object.keys(storage)

  Preference.setWhiteList(keys)
  Preference.addPreferenceChangedListener(changed => {
    //console.log('preference has changed')
  })
}

global.String.prototype.getString = function () {
  let value = Preference.get(this.valueOf())
  return value === null || value === undefined ? '' : value
}

global.String.prototype.getBool = function () {
  let value = Preference.get(this.valueOf())
  return value === null || value === undefined ? false : true
}

global.String.prototype.getObject = function () {
  let value = Preference.get(this.valueOf())
  return value === null || value === undefined ? null : JSON.parse(value)
}

global.String.prototype.clear = function () {
  Preference.clear(this.valueOf())
  return true
}
