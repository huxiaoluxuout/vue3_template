<template>
  <button :class="customClass" class="btn" :style="resultCustomStyle" @click.stop="btnClick">{{ text }}</button>
</template>
<script>
import {localStringStyle, componentsMixin} from "@/components/ylx-components/ylx-JS/template";
import {convertStyleObjectToString} from "@/utils/tools.js";
export default {
  mixins: [componentsMixin],

  name: 'ylx-button',

  props: {

    text: {
      type: String,
      default: '按钮'
    },
    size: {
      type: String,
      default: '14px'
    },
    color: {
      type: String,
      default: '#fff'
    },
    bgColor: {
      type: String,
      default: '#272729' // 'transparent'
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    rounded: {
      type: String,
      default: '100px'
    },

  },
  computed: {
    resultCustomStyle() {
      return convertStyleObjectToString({
        height: this.height,
        width: this.width,
        fontSize: this.size,
        borderRadius: this.rounded,
        backgroundColor: this.bgColor,
        color: this.color,
      }) + this.customStringStyle
    },
  },

  methods: {
    btnClick() {
      !this.disabled ? this.$emit('btnClick') :
          this.$emit('btnClickErr')
    },
  }


}
</script>

<style scoped>
.btn {

}

.btn:after {
  border: none;
}
</style>

