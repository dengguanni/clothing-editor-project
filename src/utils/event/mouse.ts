class MouseEventEventListener {
    static event: any
    static setMouseupFn: any
    static setMouseup= () => {
        window.addEventListener('mouseup', (event => {
            MouseEventEventListener.event = event
            MouseEventEventListener.setMouseupFn()
        }), true)
    }
    static rmMouseup= () => {
        window.removeEventListener('mouseup', (event => {
            MouseEventEventListener.event = event
            MouseEventEventListener.setMouseupFn()
        }), true)
    }
}
 export default MouseEventEventListener