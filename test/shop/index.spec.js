import { shallowMount, mount } from '@vue/test-utils'

import index from '../../pages/shop/index.vue'

describe('Notification', () => {
  let wrapper

  test.skip('is a Vue instance', () => {
    wrapper = mount(index)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
