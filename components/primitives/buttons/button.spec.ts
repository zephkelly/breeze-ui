import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from './Button.vue'
import { ButtonWidths, ButtonSizes, ButtonVariants, ButtonColors } from './../../../types/button'

describe('Button', () => {
    describe('Rendering', () => {
        it('renders properly', async () => {
            const wrapper = await mountSuspended(Button)
            expect(wrapper.exists()).toBe(true)
        })

        it('renders Button component', async () => {
            const wrapper = await mountSuspended(Button)
            expect(wrapper.classes()).toContain('breeze-button')
        })
    })

    describe('Props', () => {
        it('passes props to Button', async () => {
            const wrapper = await mountSuspended(Button, {
                props: {
                    disabled: true,
                    loading: true,
                    ariaLabel: 'Custom Label'
                }
            })

            expect(wrapper.classes()).toContain('breeze-button--disabled')
            expect(wrapper.classes()).toContain('breeze-button--loading')
            expect(wrapper.attributes('aria-label')).toBe('Custom Label')
        })

        it.each(ButtonVariants)('applies correct variant class: %s', async (variant) => {
            const wrapper = await mountSuspended(Button, { props: { variant } })
            expect(wrapper.classes()).toContain(`breeze-button--${variant}`)
        })

        it.each(ButtonSizes)('applies correct size class: %s', async (size) => {
            const wrapper = await mountSuspended(Button, { props: { size } })
            expect(wrapper.classes()).toContain(`breeze-button--size-${size}`)
        })

        it.each(ButtonColors)('applies correct color class: %s', async (color) => {
            const wrapper = await mountSuspended(Button, { props: { color } })
            expect(wrapper.classes()).toContain(`breeze-button--color-${color}`)
        })

        it('applies full width class when width prop is full', async () => {
            const wrapper = await mountSuspended(Button, { props: { width: 'full' } })
            expect(wrapper.classes()).toContain('breeze-button--full')
        })

        it('applies bounce class when bounce prop is true', async () => {
            const wrapper = await mountSuspended(Button, { props: { bounce: true } })
            expect(wrapper.classes()).toContain('breeze-button--bounce')
        })

        it('applies compact class when compact prop is true', async () => {
            const wrapper = await mountSuspended(Button, { props: { compact: true } })
            expect(wrapper.classes()).toContain('breeze-button--compact')
        })

        it('applies invert class when invert prop is true', async () => {
            const wrapper = await mountSuspended(Button, { props: { invert: true } })
            expect(wrapper.classes()).toContain('breeze-button--invert')
        })

        it('applies correct shape class', async () => {
            const wrapper = await mountSuspended(Button, { props: { shape: 'rounded' } })
            expect(wrapper.classes()).toContain('breeze-button--rounded')
        })
    })

  describe('Mouse events', () => {
    it('handles mousedown and mouseup events', async () => {
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('mousedown')
        expect(wrapper.classes()).toContain('breeze-button--active')

        await wrapper.trigger('mouseup')
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })

    it('does not emit click event twice when clicked', async () => {
        const wrapper = await mountSuspended(Button, {
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
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('keydown', { key: 'Enter' })
        expect(wrapper.classes()).toContain('breeze-button--active')

        await wrapper.trigger('keyup', { key: 'Enter' })
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })

    it('handles keydown and keyup events for Space key', async () => {
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('keydown', { key: ' ' })
        expect(wrapper.classes()).toContain('breeze-button--active')

        await wrapper.trigger('keyup', { key: ' ' })
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })
})

describe('Touch events', () => {
    it('handles touchstart event', async () => {
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('touchstart')
        expect(wrapper.classes()).toContain('breeze-button--active')
    })

    it('handles touchend event', async () => {
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('touchstart')
        await wrapper.trigger('touchend')
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })

    it('handles touchcancel event', async () => {
        const wrapper = await mountSuspended(Button)

        await wrapper.trigger('touchstart')
        await wrapper.trigger('touchcancel')
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })

    it('prevents default on touchstart', async () => {
        const wrapper = await mountSuspended(Button)
        const event = { preventDefault: vi.fn() }

        await wrapper.trigger('touchstart', event)
        expect(event.preventDefault).toHaveBeenCalled()
    })

    it('does not become active on touch when disabled', async () => {
        const wrapper = await mountSuspended(Button, { props: { disabled: true } })

        await wrapper.trigger('touchstart')
        expect(wrapper.classes()).not.toContain('breeze-button--active')
    })

    it('handles long press correctly', async () => {
        const wrapper = await mountSuspended(Button, { props: { holdable: true } })

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
            const wrapper = await mountSuspended(Button, {
                slots: {
                    default: () => 'Click me'
                }
            })
            
            expect(wrapper.text()).toBe('Click me')
        })

        it('renders leading slot content', async () => {
            const wrapper = await mountSuspended(Button, {
                slots: {
                    leading: () => 'Lead',
                    default: () => 'Click me'
                }
            })

            expect(wrapper.find('.content-left').text()).toBe('Lead')
        })

        it('renders trailing slot content', async () => {
            const wrapper = await mountSuspended(Button, {
                slots: {
                    trailing: () => 'Trail',
                    default: () => 'Click me'
                }
            })
            expect(wrapper.find('.content-right').text()).toBe('Trail')
        })

        it('renders loader slot when loading', async () => {
            const wrapper = await mountSuspended(Button, {
                props: { loading: true },
                slots: {
                    loader: () => 'Loading...',
                    default: () => ''
                }
            })
            expect(wrapper.find('.button-loader').text()).toBe('Loading...')
        })

        it('renders default and loader slot when loading', async () => {
            const wrapper = await mountSuspended(Button, {
                props: { loading: true },
                slots: {
                    default: () => 'Uploading',
                    loader: () => 'Loading...'
                }
            })
            expect(wrapper.find('.button-loader').text()).toBe('Loading...Uploading')
        })
    })

    describe('Headless mode', () => {
        it('passes attributes to slot when headless is true', async () => {
            const wrapper = await mountSuspended(Button, {
                props: {
                    headless: true,
                    disabled: true,
                    ariaLabel: 'Custom Label'
                },
                slots: {
                    // @ts-expect-error
                    default: (props) => h('button', props.attributes, 'Headless Button')
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