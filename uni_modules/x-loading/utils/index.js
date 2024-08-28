export default {
    /**
     * Add keyframes to body as style block
     * @param name string
     * @param frames string
     */
    appendKeyframes: (name, frames) => {
        if (!window?.document) {
            return
        }

        const sheet = document.createElement('style')
        sheet.setAttribute('id', name)
        sheet.innerHTML = `@keyframes ${name} {${frames}}`
        document.body.appendChild(sheet)
    },

    /**
     * Remove keyframes from body
     * @param name string
     */
    removeKeyframes: (name) => {
        if (!window?.document) {
            return
        }

        const sheet = document.getElementById(name)
        if (!sheet) {
            return
        }
        sheet.parentNode?.removeChild(sheet)
    },
}