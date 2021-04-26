<template>
  <div class="m-textarea"
       :style="{'pointer-events': (justEditableWhenFocused && !isFocused) ? 'none' : 'auto'}"
       :class="{'show-word-limit': showWordLimit, focus: isFocused, noBorder}">
    <div class="inner-text">{{tempInput || placeholder}}</div>
    <textarea v-model="input"
              @input="onInput"
              class="textarea"
              ref="textarea"
              :placeholder="placeholder"
              @keydown.enter="onPressEnter"
              @focus="onFocus"
              @blur="onBlur"></textarea>
    <div class="word-limit" v-if="showWordLimit">
      <div class="count">{{getStringLength(value)}}</div>
      /{{maxlength}}
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: String,
    value: String,
    maxlength: [Number, String],
    oneline: Boolean,
    showWordLimit: Boolean,
    getStringLength: { // 允许自定义字符串长度计算方式
      type: Function,
      default (str) {
        return str.length
      }
    },
    undoWhenEmpty: Boolean,
    noBorder: Boolean,
    justEditableWhenFocused: Boolean,
  },
  components: {},
  data () {
    return {
      input: '',
      tempInput: '', // fix 中文输入bug：input 和 $event.value不一致

      isFocused: false,

      focusedValue: '',
    }
  },
  methods: {
    onPressEnter (e) {
      if (this.oneline) {
        e.preventDefault()
      }
      // setTimeout用于处理中文输入法bug，字符达到最大长度后继续输入按回车会导致英文字母会跑到字符串开头
      setTimeout(() => {
        this.$emit('pressEnter', e)
      })
    },
    onInput (e) {
      const { value } = e.target
      this.tempInput = value
      if (this.input !== value) return

      let res = ''
      if (this.maxlength) {
        // 截取最大长度
        for (let i = 0; i < value.length; ++i) {
          let temp = value.substr(0, i + 1)
          if (this.getStringLength(temp) <= Number(this.maxlength)) {
            res = temp
          } else {
            break
          }
        }
      } else {
        res = value
      }

      this.tempInput = this.input = res
      this.$emit('input', res)
    },

    onFocus () {
      this.isFocused = true
      this.focusedValue = this.value
      this.$emit('focus')
    },
    onBlur (e) {
      this.isFocused = false
      this.$emit('blur', e)
      if (this.undoWhenEmpty && !this.value) {
        this.$emit('input', this.focusedValue)
      }
    },
    focus () {
      this.$refs['textarea'].focus()
    },
    blur () {
      this.$refs['textarea'].blur()
    },
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.tempInput = this.input = newVal
      }
    },
  },
  created () {
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
.m-textarea {
  position: relative;
  box-sizing: content-box;

  .textarea,
  .inner-text {
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    word-break: break-all;
  }

  .textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    padding: 0;
    border-radius: 0;
    /*opacity: 0.5;*/
    color: inherit;
    overflow: hidden;

    &:focus {
      box-shadow: 0 0 0 2px fade(#00b075, 20%);
      background: white;
      z-index: 400;

      & + .word-limit {
        opacity: 1;
      }
    }

    &::placeholder {
      font-weight: normal;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .inner-text {
    opacity: 0;
    white-space: pre-wrap;
  }

  .word-limit {
    position: absolute;
    color: #909399;
    bottom: 0;
    right: 1px;
    font-size: 12px;
    line-height: 1;
    pointer-events: none;
    opacity: 0;
    transform: scale(.8);
    transform-origin: bottom right;
    display: flex;

    .count {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      transform: translateX(-100%);
    }
  }

  &.show-word-limit {
    padding-bottom: 10px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &.noBorder {
    .textarea {
      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style>
