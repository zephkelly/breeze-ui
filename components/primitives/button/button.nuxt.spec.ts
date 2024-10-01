import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from './Button.vue'
import { ButtonWidths, ButtonSizes, ButtonVariants, ButtonColors } from './../../../types/button'

// 80-85% coverage
describe('Button', () => {
    describe('Rendering', () => {
        it('renders properly', async () => {
            const wrapper = await mountSuspended(Button, { props: { variant: 'solid' } })
            expect(wrapper.classes()).toContain('breeze-button--solid')
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

    describe('Holdable prop', () => {
        describe('When holdable is false (default)', () => {
            it('emits click event on mousedown and updates visual state', async () => {
                const wrapper = await mountSuspended(Button, {
                    props: {
                        debounce: false
                    }
                })

                await wrapper.trigger('mousedown')
                expect(wrapper.emitted('click')).toBeTruthy()
                expect(wrapper.classes()).toContain('breeze-button--active')
            })

            it('emits click event on keydown (Enter) and updates visual state', async () => {
                const wrapper = await mountSuspended(Button, {
                    props: {
                        debounce: false
                    }
                })

                await wrapper.trigger('keydown', { key: 'Enter' })
                expect(wrapper.emitted('click')).toBeTruthy()
                expect(wrapper.classes()).toContain('breeze-button--active')
            })

            it('emits click event on keydown (Space) and updates visual state', async () => {
                const wrapper = await mountSuspended(Button, {
                    props: {
                        debounce: false
                    }
                })
                await wrapper.trigger('keydown', { key: ' ' })
                expect(wrapper.emitted('click')).toBeTruthy()
                expect(wrapper.classes()).toContain('breeze-button--active')
            })

            it('removes active visual state on mouseup', async () => {
                const wrapper = await mountSuspended(Button)
                await wrapper.trigger('mousedown')
                await wrapper.trigger('mouseup')
                expect(wrapper.classes()).not.toContain('breeze-button--active')
            })

            it('removes active visual state on keyup', async () => {
                const wrapper = await mountSuspended(Button)
                await wrapper.trigger('keydown', { key: 'Enter' })
                await wrapper.trigger('keyup', { key: 'Enter' })
                expect(wrapper.classes()).not.toContain('breeze-button--active')
            })
        })

        describe('When holdable is true', () => {
            it('emits pressstart on mousedown and updates visual state', async () => {
                const wrapper = await mountSuspended(Button, { props: { holdable: true } })
                await wrapper.trigger('mousedown')
                expect(wrapper.emitted('pressstart')).toBeTruthy()
                expect(wrapper.classes()).toContain('breeze-button--active')
            })

            it('emits click and pressend on mouseup and removes active visual state', async () => {
                const wrapper = await mountSuspended(Button, { props: { holdable: true, debounce: false } })
                await wrapper.trigger('mousedown')
                await wrapper.trigger('mouseup')
                expect(wrapper.emitted('click')).toBeTruthy()
                expect(wrapper.emitted('pressend')).toBeTruthy()
                expect(wrapper.classes()).not.toContain('breeze-button--active')
            })

            it('emits pressstart on keydown (Enter) and updates visual state', async () => {
                const wrapper = await mountSuspended(Button, { props: { holdable: true } })
                await wrapper.trigger('keydown', { key: 'Enter' })
                expect(wrapper.emitted('pressstart')).toBeTruthy()
                expect(wrapper.classes()).toContain('breeze-button--active')
            })

            it('emits click and pressend on keyup (Enter) and removes active visual state', async () => {
                const wrapper = await mountSuspended(Button, { props: { holdable: true, debounce: false } })
                await wrapper.trigger('keydown', { key: 'Enter' })
                await wrapper.trigger('keyup', { key: 'Enter' })
                expect(wrapper.emitted('click')).toBeTruthy()
                expect(wrapper.emitted('pressend')).toBeTruthy()
                expect(wrapper.classes()).not.toContain('breeze-button--active')
            })
        })

        describe('Touch events', () => {
            it('prevents default on touchstart', async () => {
                const wrapper = await mountSuspended(Button)
                const event = { preventDefault: vi.fn() } as unknown as TouchEvent
                await wrapper.trigger('touchstart', event)
                expect(event.preventDefault).toHaveBeenCalled()
            })

            it('emits click event on touchend when holdable is true', async () => {
                const wrapper = await mountSuspended(Button, { props: { holdable: true, debounce: false } })
                await wrapper.trigger('touchstart')
                await wrapper.trigger('touchend')
                expect(wrapper.emitted('click')).toBeTruthy()
            })

            it('emits click event on touchstart when holdable is false', async () => {
                const wrapper = await mountSuspended(Button, {
                    props: {
                        debounce: false
                    }
                })

                await wrapper.trigger('touchstart')
                expect(wrapper.emitted('click')).toBeTruthy()
            })
        })

        it('does not emit click event or become visually active when disabled', async () => {
            const wrapper = await mountSuspended(Button, { props: { disabled: true } })
            await wrapper.trigger('mousedown')
            await wrapper.trigger('mouseup')
            expect(wrapper.emitted('click')).toBeFalsy()
            expect(wrapper.classes()).not.toContain('breeze-button--active')
        })
    })

    describe('Props', () => {
        it('applies the correct size class', async () => {
            for (const size of ButtonSizes) {
                const wrapper = await mountSuspended(Button, { props: { size } })
                expect(wrapper.classes()).toContain(`breeze-button--size-${size}`)
            }
        })

        it('applies the correct variant class', async () => {
            for (const variant of ButtonVariants) {
                const wrapper = await mountSuspended(Button, { props: { variant } })
                expect(wrapper.classes()).toContain(`breeze-button--${variant}`)
            }
        })

        it('applies color classes when color prop is provided', async () => {
            for (const color of ButtonColors) {
                const wrapper = await mountSuspended(Button, { props: { color } })
                expect(wrapper.classes()).toContain('breeze-button--color')
                expect(wrapper.classes()).toContain(`breeze-button--color-${color}`)
            }
        })

        it('applies the correct width class', async () => {
            for (const width of ButtonWidths) {
                const wrapper = await mountSuspended(Button, { props: { width } })
                if (width === 'full') {
                    expect(wrapper.classes()).toContain('breeze-button--full')
                } else {
                    expect(wrapper.classes()).not.toContain('breeze-button--full')
                }
            }
        })

        it('applies the rounded class', async () => {
            const wrapper = await mountSuspended(Button, { props: { shape: 'rounded' } })
            expect(wrapper.classes()).toContain('breeze-button--rounded')
        })

        it('applies the round class', async () => {
            const wrapper = await mountSuspended(Button, { props: { shape: 'round' } })
            expect(wrapper.classes()).toContain('breeze-button--round')
        })

        it('applies the sharp class', async () => {
            const wrapper = await mountSuspended(Button, { props: { shape: 'sharp' } })
            expect(wrapper.classes()).toContain('breeze-button--sharp')
        })

        it('applies the bounce class', async () => {
            const wrapper = await mountSuspended(Button, { props: { bounce: true } })
            expect(wrapper.classes()).toContain('breeze-button--bounce')
        })

        it('applies the correct aria-label', async () => {
            const wrapper = await mountSuspended(Button, { props: { ariaLabel: 'Custom Label' } })
            expect(wrapper.attributes('aria-label')).toBe('Custom Label')
        })

        it('renders as a link when href is provided', async () => {
            const wrapper = await mountSuspended(Button, { props: { href: 'https://example.com' } })
            expect(wrapper.element.tagName).toBe('A')
            expect(wrapper.attributes('href')).toBe('https://example.com')
        })

        it('renders as a NuxtLink when to is provided', async () => {
            const wrapper = await mountSuspended(Button, { props: { to: '/about' } })
            expect(wrapper.element.tagName).toBe('A')
            expect(wrapper.attributes('href')).toBe('/about')
        })
    })

    describe('Prop interactions', () => {
        it('applies unstyled prop correctly', async () => {
            const wrapper = await mountSuspended(Button, {
                props: {
                    unstyled: true,
                    variant: 'solid',
                    color: 'red',
                    size: 'large'
                }
            })
            expect(wrapper.classes()).not.toContain('breeze-button')
            expect(wrapper.classes()).not.toContain('breeze-button--solid')
            expect(wrapper.classes()).not.toContain('breeze-button--color-red')
            expect(wrapper.classes()).not.toContain('breeze-button--size-large')
        })
    })

    describe('Slots', () => {
        it('renders default slot content', async () => {
            const wrapper = await mountSuspended(Button, {
                slots: {
                    default: () => 'Click me'
                }
            })
            expect(wrapper.text()).toContain('Click me')
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

        it('renders slot content', async () => {
            const wrapper = await mountSuspended(Button, {
                slots: {
                    default: () => 'Click me'
                }
            })
            expect(wrapper.text()).toContain('Click me')
        })

        it('applies the loading class and displays loader slot', async () => {
            const wrapper = await mountSuspended(Button, {
                props: { loading: true },
                slots: {
                    default: () => 'Button Text',
                    loader: () => 'Loading...'
                }
            })
            expect(wrapper.classes()).toContain('breeze-button--loading')
            expect(wrapper.find('.button-loader').exists()).toBe(true)
            expect(wrapper.find('.button-loader').text()).toBe('Loading...')
        })
    })

    describe('Watchers And Computed values', () => {
        it('updates button color when color prop changes', async () => {
            const wrapper = await mountSuspended(Button, { props: { color: 'red' } })
            expect(wrapper.classes()).toContain('breeze-button--color-red')

            await wrapper.setProps({ color: 'green' })
            await nextTick()
            expect(wrapper.classes()).toContain('breeze-button--color-green')
        })

        it('correctly handles prop changes', async () => {
            const wrapper = await mountSuspended(Button, {
                props: { variant: 'solid', size: 'medium', color: 'red' }
            })

            expect(wrapper.classes()).toContain('breeze-button--solid')
            expect(wrapper.classes()).toContain('breeze-button--size-medium')
            expect(wrapper.classes()).toContain('breeze-button--color-red')

            await wrapper.setProps({ variant: 'ghost', size: 'large', color: 'blue' })

            expect(wrapper.classes()).toContain('breeze-button--ghost')
            expect(wrapper.classes()).toContain('breeze-button--size-large')
            expect(wrapper.classes()).toContain('breeze-button--color-orange')
            expect(wrapper.classes()).not.toContain('breeze-button--solid')
            expect(wrapper.classes()).not.toContain('breeze-button--size-medium')
            expect(wrapper.classes()).not.toContain('breeze-button--color-red')
        })
    })
    describe('Headless mode', () => {
        it('does not render its own template and provides attributes to slot when headless is true', async () => {
            const wrapper = await mountSuspended(Button, {
                props: {
                    headless: true,
                    disabled: true,
                    ariaLabel: 'Custom Label'
                },
                slots: {
                    //@ts-expect-error
                    default: ({ attributes }) => h('button', attributes, 'Headless Button')
                }
            })

            expect(wrapper.find('.breeze-button').exists()).toBe(false)

            const button = wrapper.find('button')
            expect(button.exists()).toBe(true)
            expect(button.text()).toBe('Headless Button')

            expect(button.attributes('role')).toBe('button')
            expect(button.attributes('disabled')).toBe('')
            expect(button.attributes('aria-label')).toBe('Custom Label')
            expect(button.attributes('tabindex')).toBe('-1')
            expect(button.attributes('aria-disabled')).toBe('true')
        })
    })
})