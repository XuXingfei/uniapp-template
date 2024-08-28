import { uploadFile } from '@/common/network/http.js'
import * as config from '@/common/config.js'
import * as utils from '@/common/utils/index.js'

export default {
    install(app) {
        app.config.globalProperties.$uploadImage = uploadFile.uploadImage
        app.config.globalProperties.$uploadImages = uploadFile.uploadImages
        app.config.globalProperties.$uploadVideo = uploadFile.uploadVideo
        app.config.globalProperties.$joinUrl = (url) => url ? config.staticBaseUrl + url : ''

        for (let key in config) {
            if (!app.config.globalProperties[key]) app.config.globalProperties[key] = config[key]
            else console.error(`${key} key clash, app.config.globalProperties.${key}=${app.config.globalProperties[key]}`)
        }

        for (let key in utils) {
            if (!app.config.globalProperties[key]) app.config.globalProperties[key] = utils[key]
            else console.error(`${key} key clash, app.config.globalProperties.${key}=${app.config.globalProperties[key]}`)
        }
    }
}