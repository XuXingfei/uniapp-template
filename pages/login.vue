<template>
    <my-container>
        <view class="container f-c-x-c">
            <x-placeholder :height="44"></x-placeholder>
            <image class="logo" src="@/static/logo.png" mode=""></image>
            <view class="ipt">
                <text>手机号</text>
                <view class="f-r-y-c">
                    <input v-model="form.username" class="f-1" type="number" placeholder="输入手机号" placeholder-class="placeholder-class" />
                </view>
            </view>
            <view class="ipt" style="margin-bottom: 20rpx;">
                <text>密码</text>
                <view class="f-r-y-c">
                    <input v-model="form.password" class="f-1" type="password" placeholder="输入密码" placeholder-class="placeholder-class" />
                </view>
            </view>
            <view class="forgot" @click="$navTo('/pages/forgotPwd')">
                忘记密码？
            </view>
            <view class="btn" @click="login">
                登录
            </view>
            <view class="btn" style="background-color: transparent; color: var(--theme-color);" @click="$redTo('/pages/register')">
                注册
            </view>
        </view>
    </my-container>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useCommon } from '@/hooks/useCommon.js'
    import { userApi } from '@/common/api/index.js'
    const { gProps, userStore, globalStore } = useCommon()

    const form = reactive({
        username: '',
        password: ''
    })

    async function login() {
        try {
            if (gProps.$hasEmptyField(form)) return gProps.$toast('请填写完整')

            const token = await userApi.login(form)

            userStore.setToken(token)

            await userStore.setUserInfo()

            gProps.$toast('登录成功')

            gProps.$tabTo('/pagesMain/home', 500)
        } catch (e) {
            console.log(e);
            userStore.setToken('')
        }
    }
</script>

<style lang="scss">
    .container {

        .logo {
            width: 167rpx;
            height: 167rpx;
            border-radius: 50%;
            margin-bottom: 100rpx;
            margin-top: 30px;
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
            padding-left: 32rpx;
            margin-bottom: 104rpx;
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