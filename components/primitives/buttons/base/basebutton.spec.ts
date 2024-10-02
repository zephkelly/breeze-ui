import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('renders properly', async () => {
      const wrapper = await mountSuspended(BaseButton)
      expect(wrapper.exists()).toBe(true)
    })

    it('renders as button by default', async () => {
      const wrapper = await mountSuspended(BaseButton)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('renders as a link when href is provided', async () => {
      const wrapper = await mountSuspended(BaseButton, { props: { href: 'https://example.com' } })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
    })

    it('renders as a NuxtLink when to is provided', async () => {
      const wrapper = await mountSuspended(BaseButton, { props: { to: '/about' } })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('/about')
    })
  })

    describe('Props', () => {
        it('applies disabled attribute when disabled prop is true', async () => {
        const wrapper = await mountSuspended(BaseButton, { props: { disabled: true } })
        expect(wrapper.attributes('disabled')).toBeDefined()
        })

        it('applies aria-disabled attribute when disabled prop is true', async () => {
        const wrapper = await mountSuspended(BaseButton, { props: { disabled: true } })
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        })

        it('applies aria-busy attribute when loading prop is true', async () => {
        const wrapper = await mountSuspended(BaseButton, { props: { loading: true } })
        expect(wrapper.attributes('aria-busy')).toBe('true')
        })

        it('applies correct aria-label', async () => {
        const wrapper = await mountSuspended(BaseButton, { props: { ariaLabel: 'Custom Label' } })
        expect(wrapper.attributes('aria-label')).toBe('Custom Label')
        })
    })

    describe('Mouse events', () => {
        it('handles mousedown and mouseup events', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('mousedown')
            expect(wrapper.classes()).toContain('breeze-button--active')

            await wrapper.trigger('mouseup')
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })

        it('does not emit click event twice when clicked', async () => {
            const wrapper = await mountSuspended(BaseButton, {
                props: {
                    debounce: false
                }
            })

            await wrapper.trigger('mousedown')
            await wrapper.trigger('mouseup')
            expect(wrapper.emitted('click')).toHaveLength(1)
        })
    })

    describe('Keyboard events', () => {
        it('handles keydown and keyup events for Enter key', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('keydown', { key: 'Enter' })
            expect(wrapper.classes()).toContain('breeze-button--active')

            await wrapper.trigger('keyup', { key: 'Enter' })
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })

        it('handles keydown and keyup events for Space key', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('keydown', { key: ' ' })
            expect(wrapper.classes()).toContain('breeze-button--active')

            await wrapper.trigger('keyup', { key: ' ' })
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })
    })

    describe('Touch events', () => {
        it('handles touchstart event', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('touchstart')
            expect(wrapper.classes()).toContain('breeze-button--active')
        })

        it('handles touchend event', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('touchstart')
            await wrapper.trigger('touchend')
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })

        it('handles touchcancel event', async () => {
            const wrapper = await mountSuspended(BaseButton)

            await wrapper.trigger('touchstart')
            await wrapper.trigger('touchcancel')
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })

        it('prevents default on touchstart', async () => {
            const wrapper = await mountSuspended(BaseButton)
            const event = { preventDefault: vi.fn() }

            await wrapper.trigger('touchstart', event)
            expect(event.preventDefault).toHaveBeenCalled()
        })

        it('does not become active on touch when disabled', async () => {
            const wrapper = await mountSuspended(BaseButton, { props: { disabled: true } })

            await wrapper.trigger('touchstart')
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })

        it('handles long press correctly', async () => {
            const wrapper = await mountSuspended(BaseButton, { props: { holdable: true } })

            await wrapper.trigger('touchstart')
            expect(wrapper.classes()).toContain('breeze-button--active')

            await new Promise(resolve => setTimeout(resolve, 100))

            expect(wrapper.classes()).toContain('breeze-button--active')

            await new Promise(resolve => setTimeout(resolve, 400))

            await wrapper.trigger('touchend')
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })
    })

    describe('Slots', () => {
        it('renders default slot content', async () => {
            const wrapper = await mountSuspended(BaseButton, {
                slots: {
                    default: () => 'Click me'
                }
            })
            expect(wrapper.text()).toBe('Click me')
        })
    })

    describe('Headless mode', () => {
        it('provides attributes to slot when headless is true', async () => {
            const wrapper = await mountSuspended(BaseButton, {
                props: {
                    headless: true,
                    disabled: true,
                    ariaLabel: 'Custom Label'
                },
                slots: {
                    default: ({ attributes }) => h('button', attributes, 'Headless Button')
                }
            })

            const button = wrapper.find('button')
            expect(button.exists()).toBe(true)
            expect(button.text()).toBe('Headless Button')
            expect(button.attributes('disabled')).toBeDefined()
            expect(button.attributes('aria-label')).toBe('Custom Label')
        })
    })
})