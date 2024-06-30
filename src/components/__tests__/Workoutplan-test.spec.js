import { describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import WorkoutPlan from '@/views/WorkoutPlan.vue'
import axios from 'axios'

vi.mock('axios')
vi.mock('@okta/okta-vue')

describe('WorkoutPlan.vue', () => {
    vi.mock('axios')
    vi.mock('@okta/okta-vue')

    it('renders greeting message and login button when not authenticated', async () => {
        // Mock the axios request if necessary
        // vi.mocked(axios, true).get.mockResolvedValueOnce({ data: yourMockData })

        const wrapper = shallowMount(WorkoutPlan)

        await flushPromises()

        // Your expectations here
        expect(wrapper.text()).toContain('Your expected text here')
    })

    it('renders workout plans when authenticated', async () => {
        // Mock the axios request if necessary
        // vi.mocked(axios, true).get.mockResolvedValueOnce({ data: yourMockData })

        const wrapper = shallowMount(WorkoutPlan)

        await flushPromises()

        // Your expectations here
        expect(wrapper.text()).toContain('Your expected text here')
    })
})
