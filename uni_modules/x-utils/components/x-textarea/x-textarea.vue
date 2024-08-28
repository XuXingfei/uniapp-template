<template>
    <view :class="'x-textarea '+ customClass" :style="[{ width }, customStyle]">
        <textarea v-model="innerValue" class="f-1" :maxlength="maxLength" :placeholder="placeholder" placeholder-class="placeholder-class"
            :style="[textareaStyle, { height: height || innerTextareaStyle.height + padding * 2 + 'px', padding: padding + 'px' }]" :cursor-spacing="cursorSpacing || padding" :cursor="99999"
            :adjust-position="true" :auto-blur="true" :show-confirm-bar="false" :hold-keyboard="true" :focus="innerFocus" @focus="onFocus" @blur="onBlur" @linechange="onLinechange"
            @keyboardheightchange="$emit('keyboardheightchange', $event)" @confirm="$emit('confirm', $event)"></textarea>
    </view>
</template>

<script>
    export default {
        name: "x-textarea",
        props: {
            value: {},
            modelValue: {},
            width: {
                type: String,
                default: '600rpx'
            },
            height: {
                type: String
            },
            padding: {
                type: Number,
                default: 5
            },
            placeholder: {
                type: String,
                default: '请输入'
            },
            cursorSpacing: {
                type: Number,
                default: 0
            },
            focus: {
                type: Boolean,
                default: false
            },
            maxLine: {
                type: [Number, String],
                default: 3
            },
            maxLength: {
                type: [Number, String],
                default: '-1'
            },
            textareaStyle: {
                type: Object,
                default: () => ({})
            },
            customStyle: {
                type: Object,
                default: () => ({})
            },
            customClass: {
                type: String,
                default: ''
            },
        },
        emits: ['input', 'focus', 'blur', 'confirm', 'keyboardheightchange', 'update:modelValue'],
        data() {
            return {
                innerValue: '',
                innerFocus: false,
                innerTextareaStyle: {}
            };
        },
        watch: {
            value(val) {
                this.innerValue = val
            },
            modelValue(val) {
                this.innerValue = val
            },
            innerValue(val) {
                this.$emit('input', val)
                this.$emit('update:modelValue', val)
            },
            textareaStyle: {
                deep: true,
                handler(val = {}) {
                    this.innerTextareaStyle = { ...val, height: this.height }
                }
            },
            focus(val) {
                this.innerFocus = val
            }
        },
        created() {
            this.innerValue = this.modelValue || this.value
            this.innerFocus = this.focus
            this.innerTextareaStyle = { ...this.textareaStyle, height: this.height }
        },
        methods: {
            onFocus(e) {
                this.innerFocus = true
                this.$emit('focus', e)
            },
            onBlur(e) {
                this.innerFocus = false
                this.$emit('blur', e)
            },
            onLinechange({
                detail
            }) {
                if (detail.lineCount <= this.maxLine) {
                    this.innerTextareaStyle.height = detail.height
                }
            }
        }
    }
</script>

<style lang="scss">
    .x-textarea {
        width: 100%;
        background-color: #fff;
        overflow: hidden;

        textarea {
            width: 100%;
        }
    }
</style>