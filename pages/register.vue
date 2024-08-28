<template>
    <my-container>
        <view class="container f-c-x-c">
            <x-placeholder :height="44"></x-placeholder>
            <image class="logo" src="@/static/logo.png" mode=""></image>
            <view class="ipt">
                <text>手机号</text>
                <view class="f-r-y-c">
                    <input v-model="form.phoneNumber" class="f-1" type="number" placeholder="输入手机号" placeholder-class="placeholder-class" />
                </view>
            </view>
            <view class="ipt" style="margin-bottom: 20rpx;">
                <text>验证码</text>
                <view class="f-r-y-c">
                    <input v-model="form.code" class="f-1" type="number" placeholder="输入验证码" placeholder-class="placeholder-class" />
                    <text style="font-size: 25rpx; color: var(--theme-color);" @click="sendCode">{{ sendCodeText }}</text>
                </view>
            </view>
            <view class="ipt" style="margin-bottom: 20rpx;">
                <text>密码</text>
                <view class="f-r-y-c">
                    <input v-model="form.password" class="f-1" type="password" placeholder="输入密码" placeholder-class="placeholder-class" />
                </view>
            </view>
            <view class="ipt" style="margin-bottom: 20rpx;">
                <text>确认密码</text>
                <view class="f-r-y-c">
                    <input v-model="form.rePassword" class="f-1" type="password" placeholder="再次输入密码" placeholder-class="placeholder-class" />
                </view>
            </view>
            <view class="btn" style="margin-top: 70rpx;" @click="confirm">
                确认
            </view>
            <view class="btn" style="background-color: transparent; color: var(--theme-color);" @click="$redTo('/pages/login')">
                已有账户?
            </view>
        </view>
    </my-container>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useCommon } from '@/hooks/useCommon.js'
    import { countDown } from '@/uni_modules/x-utils/js/index.js'
    import { userApi } from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()

    const form = reactive({
        phoneNumber: '',
        code: '',
        password: '',
        rePassword: ''
    })

    function confirm() {
        const tipMap = {
            phoneNumber: '请填写手机号',
            code: '请填写验证码',
            password: '请填写密码',
            rePassword: '请填写确认密码'
        }

        const key = gProps.hasEmptyField(form)
        if (key) return gProps.$toast(tipMap[key])

        userApi.register(form).then(res => {
            gProps.$navTo('/pages/login')
        })
    }

    let timer;
    const sendCodeText = ref('发送验证码')

    function sendCode() {
        if (timer) return gProps.$toast('请稍后再试')
        if (!form.phoneNumber) return gProps.$toast('请输入手机号')
        userApi.getCode({
            phoneNumber: form.phoneNumber
        }).then(res => {
            timer = countDown(Date.now() + 1000 * 60 * 2, ({ str }, isFinish) => {
                sendCodeText.value = str
                if (isFinish) {
                    timer = null
                    sendCodeText.value = '发送验证码'
                }
            }, 's S')
        })
    }
</script>

<style lang="scss">
    .container {

        .logo {
            width: 167rpx;
            height: 167rpx;
            margin-bottom: 100rpx;
        }

        .btn {
            width: 683rpx;
            height: 92rpx;
            background: var(--theme-color);
            border-radius: 13rpx;
            font-family: Roboto, Roboto;
            font-weight: 500;
            font-size: 29rpx;
            color: #FFFFFF;
            text-align: center;
            line-height: 92rpx;
        }

        .forgot {
            width: 100%;
            margin-bottom: 80rpx;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 25rpx;
            color: var(--theme-color);
        }

        .ipt {
            margin-bottom: 30rpx;

            >text {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 25rpx;
                color: #333333;
            }

            view {
                width: 683rpx;
                height: 92rpx;
                margin-top: 15rpx;
                padding: 0 25rpx;
                border-radius: 13rpx;
                border: 2rpx solid #CCCCCC;

                image {
                    width: 35rpx;
                }

                text {
                    margin-left: 10rpx;
                    font-family: Roboto, Roboto;
                    font-weight: 400;
                    font-size: 25rpx;
                    color: #333333;
                }

                input {
                    margin-left: 10rpx;
                    font-family: Roboto, Roboto;
                    font-weight: 400;
                    font-size: 25rpx;
                    color: #000;
                }
            }
        }
    }
</style>