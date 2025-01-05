<template>
    <button :class="`my-button f-r-xy-c ${type} ${customClass}`" :style="[innerStyle, customStyle]" :open-type="openType"
        @contact="$emit('contact', $event)" @getphonenumber="$emit('getphonenumber', $event)" @click.stop="onClick">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: "my-button",
        props: {
            type: {
                type: String,
                default: 'primary'
            },
            customClass: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '88rpx'
            },
            radius: {
                type: String
            },
            openType: {},
            customStyle: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['click', 'contact', 'getphonenumber'],
        computed: {
            innerStyle() {
                const { width, height, radius } = this
                return {
                    width,
                    height,
                    borderRadius: radius ? radius : this.$upx2px(parseInt(height)) / 2 + 'px'
                }
            }
        },
        data() {
            return {

            };
        },
        methods: {
            onClick(e) {
                this.$emit('click', e)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my-button {
        height: 88rpx;
        padding: 0;
        border: 0;
        background-color: transparent;
        /* #ifndef APP-PLUS */
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        /* #endif */

        flex-shrink: 0;

        :deep(text) {
            font-size: 32rpx;
            color: #1A1A1A;
        }

        &::after {
            display: none;
        }

        &:active {
            opacity: 0.9;
        }
    }

    .default {
        border: 1px solid #ccc;
    }

    .primary {
        background-color: var(--theme-bg);
    }

    .border {
        background-color: #fff;
        border: 1px solid var(--theme-color);
    }
</style>