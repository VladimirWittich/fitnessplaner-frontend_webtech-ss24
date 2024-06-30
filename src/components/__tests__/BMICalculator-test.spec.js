import { describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import BMICalculator from '@/views/BMICalculator.vue'
import axios from 'axios';

vi.mock('axios')
vi.mock('@okta/okta-vue')
describe('BMICalculator.vue', () => {
    vi.mock('axios')
    vi.mock('@okta/okta-vue')

    it('renders greeting message and inputs when authenticated', async () => {
        // Mock the axios request if necessary
        // vi.mocked(axios, true).get.mockResolvedValueOnce({ data: yourMockData })

        const wrapper = shallowMount(BMICalculator)

        await flushPromises()

        // Your expectations here
        expect(wrapper.text()).toContain('Your expected text here')
    })

    it('renders different content when not authenticated', async () => {
        // Mock the axios request if necessary
        // vi.mocked(axios, true).get.mockResolvedValueOnce({ data: yourMockData })

        const wrapper = shallowMount(BMICalculator)

        await flushPromises()

        // Your expectations here
        expect(wrapper.text()).toContain('Your expected text here')
    })
})
