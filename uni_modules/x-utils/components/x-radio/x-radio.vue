<template>
    <view class="x-radio" @click="onClick">
        <check-one v-if="innerValue" theme="filled" :size="String(size)" :fill="activeColor" />
        <round v-else theme="outline" :size="String(size)" :fill="inactiveColor" />
    </view>
</template>

<script>
    export default {
        props: {
            modelValue: {
                type: Boolean,
                default: false
            },
            size: {
                type: [String, Number],
                default: 36
            },
            activeColor: {
                type: String,
                default: '#14aacd'
            },
            inactiveColor: {
                type: String,
                default: '#ccc'
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        emits: ['update:modelValue', 'click', 'change'],
        watch: {
            modelValue(val) {
                this.innerValue = val
            },
            innerValue(val) {
                this.$emit('update:modelValue', val)
            },
        },
        data() {
            return {
                innerValue: false,
                systemInfo: uni.getSystemInfoSync()
            }
        },
        created() {
            this.innerValue = this.modelValue
        },
        methods: {
            onClick(e) {
                if (this.disabled) return
                this.innerValue = !this.innerValue
                this.$emit('click', e)
                this.$emit('change', this.innerValue)
            }
        }
    }
</script>
<style lang="scss">
    .x-radio {}
</style>