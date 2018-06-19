
export default {
  getAllIcos: state => {
    return state.icos || {}
  },
  getIco: state => id => {
    return state.icos[id] || {}
  },
  hasICOs: state => {
    return state.icosLength > 0
  },
  checkICO: state => id => {
    return state.icos[id] !== undefined
  }
}
