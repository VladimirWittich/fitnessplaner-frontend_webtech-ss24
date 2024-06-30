import { shallowMount, createLocalVue } from '@vue/test-utils';
import axios from 'axios';
import OverviewView from '@/views/OverviewView.vue';
import { nextTick } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '@/router';

vi.mock('axios');

describe('OverviewView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading message when data is being fetched', async () => {
        const wrapper = shallowMount(OverviewView, {
            global: {
                plugins: [router],
                mocks: {
                    $auth: {
                        isAuthenticated: vi.fn(() => true),
                        getAccessToken: vi.fn(() => 'fake-token'),
                    },
                },
            },
        });

        await nextTick();

        expect(wrapper.text()).toContain('Loading...');
    });

    it('renders table with data after loading', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    name: 'Push Up',
                    sets: 3,
                    repetitions: 15,
                    weight: [0],
                    totalWeight: 0,
                    createdAt: '2024-01-01',
                },
            ],
        });

        const wrapper = shallowMount(OverviewView, {
            global: {
                plugins: [router],
                mocks: {
                    $auth: {
                        isAuthenticated: vi.fn(() => true),
                        getAccessToken: vi.fn(() => 'fake-token'),
                    },
                },
            },
        });

        await nextTick();
        await nextTick(); // Ensure all async updates are applied

        expect(wrapper.find('table').exists()).toBe(true);
        expect(wrapper.findAll('tbody tr').length).toBe(1);
        expect(wrapper.text()).toContain('Push Up');
    });

    it('filters exercises based on search query', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, name: 'Push Up', sets: 3, repetitions: 15, weight: [0], totalWeight: 0, createdAt: '2024-01-01' },
                { id: 2, name: 'Pull Up', sets: 3, repetitions: 10, weight: [0], totalWeight: 0, createdAt: '2024-01-01' },
            ],
        });

        const wrapper = shallowMount(OverviewView, {
            global: {
                plugins: [router],
                mocks: {
                    $auth: {
                        isAuthenticated: vi.fn(() => true),
                        getAccessToken: vi.fn(() => 'fake-token'),
                    },
                },
            },
        });

        await nextTick();
        await nextTick(); // Ensure all async updates are applied

        await wrapper.setData({ searchQuery: 'Push' });
        await nextTick();

        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(1);
        expect(rows[0].text()).toContain('Push Up');
    });

    it('shows no exercises found message when there are no matching results', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, name: 'Push Up', sets: 3, repetitions: 15, weight: [0], totalWeight: 0, createdAt: '2024-01-01' },
                { id: 2, name: 'Pull Up', sets: 3, repetitions: 10, weight: [0], totalWeight: 0, createdAt: '2024-01-01' },
            ],
        });

        const wrapper = shallowMount(OverviewView, {
            global: {
                plugins: [router],
                mocks: {
                    $auth: {
                        isAuthenticated: vi.fn(() => true),
                        getAccessToken: vi.fn(() => 'fake-token'),
                    },
                },
            },
        });

        await nextTick();
        await nextTick(); // Ensure all async updates are applied

        await wrapper.setData({ searchQuery: 'Squat' });
        await nextTick();

        expect(wrapper.text()).toContain('No exercises found');
    });
});
