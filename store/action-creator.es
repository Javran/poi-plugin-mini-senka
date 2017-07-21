import { store } from 'views/create-store'
import { bindActionCreators } from 'redux'

const actionCreator = {
  modify: modifier => ({
    type: '@poi-plugin-mini-senka@Modify',
    modifier,
  }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const boundActionCreator =
  mapDispatchToProps(store.dispatch)

export {
  actionCreator,
  mapDispatchToProps,
  boundActionCreator,
}
