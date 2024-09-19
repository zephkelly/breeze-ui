export default defineEventHandler((event) => {
    const cookies = parseCookies(event)
    const colorScheme = cookies['color-scheme'] || 'light'
    
    // Add the color scheme to the event context
    event.context.colorScheme = colorScheme
})