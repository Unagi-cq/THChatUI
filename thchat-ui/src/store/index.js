import { createStore } from 'vuex'
import app from './app'
import setting from './setting'

export default createStore({
  modules: {
    app,
    setting
  }
})
