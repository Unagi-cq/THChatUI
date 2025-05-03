<template>
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
    <svg v-else :class="svgClass">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>

export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        isExternal() {
            return this.external(this.iconClass)
        },
        iconName() {
            return `#icon-${this.iconClass}`
        },
        svgClass() {
            if (this.className) {
                return 'svg-icon ' + this.className
            } else {
                return 'svg-icon'
            }
        },
        styleExternalIcon() {
            return {
                mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
            }
        }
    },
    methods: {
        external(path) {
            return /^(https?:|mailto:|tel:)/.test(path)
        }
    }
}
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    outline: none;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
    outline: none;
}
</style>