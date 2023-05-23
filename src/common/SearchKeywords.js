const recentKeywords = 'RecentKeywords'
const maxSearchKeywords = 5
const initialKeywords = { data: [] }
const SearchKeywords = {
  keywords: () => {
    let keywords = recentKeywords.getObject()
    if (keywords === null || keywords === undefined) {
      return { ...initialKeywords }
    }

    return keywords || initialKeywords
  },
  add: value => {
    if (value === '' || value === null || value === undefined) {
      return false
    }

    let keywords = recentKeywords.getObject()
    if (keywords === null || keywords === undefined) {
      keywords = { ...initialKeywords }
    }

    if ((keywords.data || []).filter(v => v.value === value).length > 0) {
      const filteredData = (keywords.data || []).filter(v => v.value !== value)
      keywords.data = [{ id: new Date(), date: new Date().toISOString().substring(5, 10), value: value }, ...(filteredData || [])]
    } else {
      keywords.data = [{ id: new Date(), date: new Date().toISOString().substring(5, 10), value: value }, ...(keywords.data || [])]
      if (keywords.data.length > maxSearchKeywords) {
        keywords.data.pop()
      }
    }

    recentKeywords.setValue(keywords)
    return true
  },
  delete: value => {
    let keywords = recentKeywords.getObject()
    if (keywords === null || keywords === undefined) {
      return true
    }

    keywords.data = (keywords.data || []).filter(v => v.value !== value)
    recentKeywords.setValue(keywords)
    return true
  },
  deleteLast: () => {
    let keywords = recentKeywords.getObject()
    if (keywords === null || keywords === undefined) {
      return true
    }

    keywords.data?.pop()
    recentKeywords.setValue(keywords)
    return true
  },
  clear: () => {
    recentKeywords.setValue({ ...initialKeywords })
    return true
  },
}

export default SearchKeywords
