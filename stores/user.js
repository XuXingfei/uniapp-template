import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getUserInfo } from "@/common/api/user.js";

export const useUserStore = defineStore("user", () => {
    const token = ref("");

    function setToken(payload) {
        token.value = payload;
        uni.setStorageSync("token", payload);
    }

    const userInfo = ref({});

    async function setUserInfo() {
        try {
            const res = await getUserInfo();
            Object.assign(userInfo.value, res);
            return res;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    function logout() {
        userInfo.value = {};
        setToken("");
        uni.reLaunch({
            url: "/pages/login"
        });
    }

    return {
        token,
        setToken,
        userInfo,
        setUserInfo,
        logout
    };
});
