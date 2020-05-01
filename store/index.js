export const state = () => {
  return {
    accessToken: null,
    user: {
      name: null,
    },
    pending: {
      login: false,
      signup: false,
      logout: false,
    },
  }
}

export const mutations = {
  setToken(state, token) {
    state.accessToken = token
  },
  setUser(state, user) {
    state.user = user
  },
  setPending(state, { login, signup, logout }) {
    state.pending = {
      ...login,
      ...signup,
      ...logout,
    }
  },
}

export const actions = {
  /**
   * nuxtServerInit start on initial loading
   * token and user validation
   */
  async nuxtServerInit({ commit, dispatch, state }, { app }) {
    try {
      // Try to get token from Browser
      const accessToken = await this.$cookies.get('getit')

      // Set token to $axios module config
      app.$axios.setToken(accessToken, 'Bearer')

      // Set token to vuex state
      commit('setToken', accessToken)

      // If token exist, try to get user information with getMe action
      if (accessToken) {
        await dispatch('getMe')
      }
    } catch (e) {
      // Clean store if user not exist with logout action
      await dispatch('resetUser')
    }
  },
  async setLocalUser({ commit }, token) {
    // Set CSR Token
    await this.$axios.setToken(token, 'Bearer')
    await this.$cookies.set('getit', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    commit('setToken', token)
  },

  /**
   * resetUser Action
   * resetUser the user clean the state, remove cookie and reset axios config
   */
  async resetUser({ commit }) {
    await this.$axios.setToken(false)
    await this.$cookies.remove('getit')
    commit('setToken', null)
  },
  /**
   * getMe Action
   * get User Information
   */
  async getMe({ commit, dispatch }) {
    try {
      const { data } = await this.$axios.get('/api/users/me')
      await dispatch('shop/getActiveShop', data)
      commit('setUser', data)
    } catch (error) {
      await dispatch('resetUser')
    }
  },
}

export const getters = {
  user: (state) => state.user,
  pending: (state) => state.pending,
  haveShop: (state) => !!state.user.activeShop,
}
