export class CodeUtil {

    static codeType = ['user']

    static scan(options = {}) {
        return uni.scanCode(options)
    }

    static async getCodeInfo(options) {
        const { scanType, result } = await CodeUtil.scan(options)

        return CodeUtil.parseCode(result)
    }

    static makeCode(type, content) {
        const t = CodeUtil.codeType.indexOf(type)

        if (t == -1) {
            console.error('codeType', QrCodeJSON.typeEnum)
            return null
        }

        return JSON.stringify({
            t,
            c: content
        })
    }

    static parseCode(codeInfo) {
        try {
            const { t, c } = JSON.parse(codeInfo)

            const type = CodeUtil.codeType[t]

            if (type) return { type, content: c }

            return { type: 'unknown', content: codeInfo }

        } catch (err) {

            console.error(err)

            return { type: 'unknown', content: codeInfo }
        }
    }
}