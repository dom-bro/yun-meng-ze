<template>
  <a-tooltip v-model="popup.tooltip"
             v-bind="$attrs"
             overlayClassName="ant-tooltip-white ant-tooltip-maxWidth"
             :mouseLeaveDelay="0">
    <template #title v-if="isOverflow && !isFocused">
      <span class="fontSize12">{{value}}</span>
    </template>
    <div class="oneline-with-popover"
         @click="$emit('click')"
         ref="wrapper">
      <div class="position-relative" style="width: 100%">
        <div class="oneline-ellipsis" :style="{opacity: isFocused ? 0 : 1}">{{value}}</div>
        <div class="measurement">{{value}}</div>
        <PowerfulTextarea v-if="editable"
                          oneline
                          :noBorder="noBorder"
                          class="filename-textarea"
                          placeholder="请输入1-50个字"
                          maxlength="50"
                          @focus="onFocus"
                          @blur="submitTitle"
                          @pressEnter="onPressEnter"
                          v-model="fileNameInput"></PowerfulTextarea>
      </div>
    </div>
  </a-tooltip>
</template>
<script>
import PowerfulTextarea from '@/components/yun/PowerfulTextarea'

export default {
  components: { PowerfulTextarea },
  props: {
    value: [String, Number],
    editable: Boolean,
    noBorder: Boolean,
  },
  data () {
    return {
      isOverflow: false,
      fileNameInput: '',
      isFocused: false,

      popup: {
        tooltip: false,
      },
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.$nextTick(async () => {
          if (!this.$refs.wrapper) return
          this.isOverflow = this.$refs.wrapper.scrollWidth > this.$refs.wrapper.clientWidth ||
            this.$refs.wrapper.scrollHeight > this.$refs.wrapper.clientHeight
        })
      },
    },
  },
  methods: {
    onFocus () {
      this.fileNameInput = this.value
      this.popup.tooltip = false
      setTimeout(() => {
        this.isFocused = true
      }, 50)
    },
    submitTitle () {
      this.isFocused = false
      this.$emit('change', this.fileNameInput)
    },
    onPressEnter (e) {
      if (!this.fileNameInput) {
        return this.$message.error('请输入1-50个字')
      }
      e.target.blur()
    },
  },
}
</script>
<style lang="less" scoped>
@import "~@/common/css/common";

.oneline-with-popover {
  position: relative;
  z-index: 1;

  .measurement {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: 0;
    pointer-events: none;
    user-select: none;
  }

  .filename-textarea {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;

    &.focus {
      opacity: 1;
      height: auto;
    }
  }
}
</style>
