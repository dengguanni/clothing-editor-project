const buttonLimit = (arr: Array<any>, obj: any) => {
    let allNotDisabled = true
    if (obj.isBackground !== undefined) {
        allNotDisabled = false
        arr.forEach(el => {
            if (el.type == 'layer') {
                el.disabled = true
            } else {
                el.disabled = false
            }
        })
    } else {
        arr.forEach(el => el.disabled = false)
    }
    if (!obj.hasControls) {
        allNotDisabled = false
        arr.forEach(el => {
            if (el.type !== 'lock') {
                el.disabled = true
            } else {
                el.disabled = false
            }
        })
    }
    if (allNotDisabled) arr.forEach(el => el.disabled = false)
}
export default buttonLimit