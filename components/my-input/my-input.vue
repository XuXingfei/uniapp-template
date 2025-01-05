<template>
    <view class="my-input row f-r-y-c-sb" :style="[{ width, height }, customStyle]">
        <view v-if="label" class="label f-r-y-c" :style="labelStyle">
            <text v-if="required" class="required">*</text>
            <text>{{ label }}</text>
            <slot name="label-icon"></slot>
        </view>

        <template v-if="mode == 'input'">
            <input v-model="innerValue" class="f-1" :style="inputStyle" :maxlength="maxlength" :disabled="disabled" :type="innerType"
                :placeholder="placeholder ? placeholder : '请输入' + label" placeholder-class="placeholder-class" @input="emitEvent('input', $event)"
                @focus="emitEvent('focus', $event)" @blur="emitEvent('blur', $event)" @confirm="emitEvent('confirm', $event)" />
            <template v-if="type == 'password' && innerValue">
                <preview-close v-if="innerType == 'password'" @click="innerType = 'text'" theme="outline" size="48" fill="#8A8776" />
                <preview-open v-else theme="outline" @click="innerType = 'password'" size="48" fill="#8A8776" />
            </template>
            <slot></slot>
        </template>

        <template v-else-if="mode == 'choose'">
            <view class="choose_view f-r-y-c" :style="inputStyle" @click="emitEvent('choose', $event)">
                <text v-if="!isEmptyValue(innerValue)">{{ chooseValue || innerValue }}</text>
                <text v-else class="placeholder-class">{{ placeholder ? placeholder : '请选择' + label }}</text>
                <slot>
                    <right size="40" fill="#cccccc" />
                </slot>
            </view>
        </template>

        <view v-else class="custom_view f-r-y-c">
            <slot></slot>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-input",
        props: {
            modelValue: {},
            type: {
                type: String,
                default: 'text'
            },
            maxlength: {},
            placeholder: {
                type: String
            },
            chooseValue: {
                type: String
            },
            mode: {
                type: String,
                default: 'input' // input | choose | custom
            },
            disabled: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '110rpx'
            },
            label: {
                type: String,
                default: ''
            },
            required: {
                type: Boolean,
                default: false
            },
            labelStyle: {
                type: Object,
                default: () => ({})
            },
            inputStyle: {
                type: Object,
                default: () => ({})
            },
            customStyle: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['input', 'focus', 'blur', 'confirm', 'update:modelValue', 'choose'],
        watch: {
            modelValue(val) {
                this.innerValue = val
            },
            innerValue(val) {
                this.emitEvent('update:modelValue', val)
            },
        },
        data() {
            return {
                innerValue: '',
                innerType: ''
            };
        },
        created() {
            this.innerValue = this.modelValue
            this.innerType = this.type
        },
        methods: {
            emitEvent(type, e) {
                if (this.disabled) return console.error('disabled')
                this.$emit(type, e)
            }
        }
    }
</script>

<style lang="scss">
    .my-input {
        width: 100%;
        border-bottom: 1rpx solid var(--border-color);

        &:last-child {
            border: 0;
        }

        .label {
            margin-right: 20rpx;

            text {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 32rpx;
                color: #1A1A1A;
            }

            .required {
                color: #EA4642;
            }
        }

        input {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 32rpx;
            color: #1A1A1A;
            text-align: right;
        }

        .choose_view {
            min-width: 300rpx;
            justify-content: flex-end;

            >text:not(.placeholder-class) {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 30rpx;
                color: #666666;
            }
        }

        .custom_view {
            justify-content: end;
        }
    }
</style>