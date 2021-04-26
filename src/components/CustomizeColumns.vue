<template>
  <a-modal :visible="visible"
           @cancel="hide"
           :bodyStyle="{padding: '0 0 30px 0'}"
           width="902px"
           style="top:100px">
    <div class="modal-title">自定义列</div>
    <a-input-search size="small"
                    allowClear
                    @search="doSearch"
                    @pressEnter="doSearch"
                    @change="onSearchChange"
                    v-model="search"
                    class="search-input"
                    placeholder="可搜索名称">
      <a-button slot="enterButton" icon="search">搜索
      </a-button>
    </a-input-search>
    <div class="content">
      <div class="panel options">
        <div class="panel-head">可添加的列</div>
        <div class="panel-body">
          <div class="left">
            <template v-for="category in tree">
              <div class="dt">{{category.label}}</div>
              <div class="dd">
                <div class="li"
                     v-for="sub in filterEmpty(category.data)"
                     :class="{active: activeFloor === sub.label}"
                     @click="scrollTo(sub)">{{sub.label}}
                </div>
              </div>
            </template>
          </div>
          <div id="columnFloor" class="right">
            <div style="padding-bottom: 20px">
              <template v-for="category in tree">
                <div v-for="sub in filterEmpty(category.data)"
                     :id="sub.label" :key="sub.label">
                  <div class="dt">{{sub.label}}</div>
                  <div class="dd">
                    <div class="li"
                         v-if="sub.data.length > 1"
                         @click="toggleSelectAll(sub)"
                         :class="{checked: isSelectedAll(sub)}">
                      <h-icon class="iconxuanzhong" v-if="isSelectedAll(sub)"></h-icon>
                      <span class="icon" v-else></span>
                      全选
                    </div>
                    <div class="li"
                         @click="toggleSelect(item)"
                         :class="{
                         disabled: item.fixedOld,
                         checked: isSelected(item),
                       }"
                         v-for="item in sub.data">
                      <h-icon class="iconxuanzhong" v-if="item.fixedOld || isSelected(item)"></h-icon>
                      <span class="icon" v-else></span>
                      {{getTitle(item)}}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="panel selected">
        <div class="panel-head">
          已选{{selected.length}}项
          <span class="link" @click="selected=[]">清空全部</span>
        </div>
        <div class="panel-body">
          <template v-if="fixedFields.length">
            <div class="dt">冻结列</div>
            <div class="dd">
              <div class="li disabled" v-for="item in fixedFields">
                <a-icon type="menu"/>
                {{getTitle(item)}}
              </div>
            </div>
          </template>
          <template v-if="selected.length">
            <div class="dt">活动列</div>
            <div class="dd">
              <draggable v-model="selected" :animation="200">
                <div class="li" v-for="item in selected" :key="item.title">
                  <a-icon type="menu"/>
                  <div class="txt">{{getTitle(item)}}</div>
                  <a-icon type="close" @click="toggleSelect(item)"/>
                </div>
              </draggable>
            </div>
          </template>
        </div>
      </div>
    </div>

    <template slot="footer">
      <a-button @click="hide">取消</a-button>
      <a-button type="primary" @click="clickApply">
        应用
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import Floor from '@/common/js/Floor'
import draggable from 'vuedraggable'
import { deepClone } from '@/common/js/utils'

export default {
  props: {
    visible: Boolean,
    data: Array,
    value: Array,
  },
  components: {
    draggable,
  },
  data () {
    return {
      selected: [],
      activeFloor: undefined,
      search: '',

      tree: [],
    }
  },
  methods: {
    hide () {
      this.$emit('update:visible', false)
    },

    toggleSelect (item) {
      const exist = this.isSelected(item)
      exist ? this.selected.splice(this.selected.indexOf(exist), 1) : this.selected.push(item)
    },

    toggleSelectAll (subCategory) {
      if (this.isSelectedAll(subCategory)) {
        this.selected = this.selected.filter(item => !subCategory.data.find(ele => this.isEqual(ele, item)))
      } else {
        subCategory.data.forEach(item => {
          if (!item.fixedOld && !this.isSelected(item)) {
            this.selected.push(item)
          }
        })
      }
    },

    doSearch () {
      let res = []
      for (let category of this.data) {
        let tempCategory = deepClone(category)
        tempCategory.data = []
        if (category.data) {
          Object.values(category.data).forEach(sub => {
            const hits = sub.data.filter(ele => this.getTitle(ele).includes(this.search))
            if (hits.length) {
              let tempSub = deepClone(sub)
              tempSub.data = hits
              tempCategory.data.push(tempSub)
            }
          })
          if (tempCategory.data.length) res.push(tempCategory)
        }
      }
      this.tree = res
      this.$nextTick(() => {
        this.columnFloor.refresh()
      })
    },

    onSearchChange () {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.doSearch(), 300)
    },

    scrollTo (sub) {
      this.activeFloor = sub.label
      this.columnFloor.scrollTo(`#${sub.label}`, 300)
    },

    clickApply () {
      const columns = [
        ...this.fixedFields,
        ...this.selected,
      ]
      clog(columns)
      this.$emit('change', columns)
      this.$emit('input', columns)
      this.hide()
    },

    isEqual (a, b) {
      return a && b &&
        a.dataIndex === b.dataIndex &&
        this.getTitle(a) === this.getTitle(b)
    },

    getTitle (item) {
      return item.title || item.customTitle
    },

    isSelected (item) {
      return this.selected.find(ele => this.isEqual(ele, item))
    },
    isSelectedAll (subCategory) {
      return subCategory.data.filter(item => !item.fixedOld)
        .every(item => this.isSelected(item))
    },

    filterEmpty (subCategoryList = []) {
      if (!Array.isArray(subCategoryList)) {
        subCategoryList = Object.values(subCategoryList)
      }
      return subCategoryList.filter(item => item.data && item.data.length)
    },
    initFloor () {
      const vm = this
      vm.columnFloor = new Floor({
        container: '#columnFloor',
        baseline: 0.6, // 基准线，作为判断 active floor 的依据，
        // baselineDebug: true, // 是否显示基准线
        onFloorChange () {
          vm.activeFloor = vm.floors[this.activeIndex]
        }
      })
    },

    initSelected () {
      this.selected = this.value.filter(item => !this.fixedFields.find(ele => this.isEqual(item, ele)))
    },
  },
  computed: {
    // 冻结列
    fixedFields () {
      let res = []
      if (!this.data) return res
      for (let category of this.data) {
        if (category.data) {
          Object.values(category.data).forEach(sub => {
            //控制table的列展示的时候会删除fixed属性，所以用fixedOld属性
            res = res.concat(sub.data.filter(ele => ele.fixedOld))
          })
        }
      }
      return res
    },
    floors () {
      let res = []
      for (let category of this.tree) {
        for (let sub of this.filterEmpty(category.data)) {
          res.push(sub.label)
        }
      }
      return res
    },
  },
  watch: {
    data: {
      immediate: true,
      async handler (newVal) {
        this.tree = newVal
        if (this.columnFloor) {
          await this.$nextTick()
          this.columnFloor.refresh()
        }
      }
    },
    value: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.initSelected()
        }
      },
    },
    visible: {
      immediate: true,
      async handler (newVal) {
        if (newVal) {
          this.initSelected()
          await this.$nextTick()
          this.columnFloor ? this.columnFloor.refresh() : this.initFloor()
        }
      }
    },
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
  @import "~@/assets/colors";

  .modal-title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 21px;
    padding: 19px 24px 24px;
  }

  .search-input {
    width: 304px;
    margin: 0 0 22px 24px;

    .ant-btn {
      height: 32px;
      margin-left: -2px;
      border-bottom-right-radius: var(--border-radius-base);
      border-top-right-radius: var(--border-radius-base);
      padding: 0 24px;
      color: rgba(0, 0, 0, 0.65);
      font-family: PingFangSC-Regular, PingFang SC;
    }

    /deep/ .ant-input-suffix {
      right: 0;
    }
  }

  .content {
    display: flex;
    height: 467px;
    padding: 0 24px;
    justify-content: space-between;

    @borderStyle: 1px solid #D9D9D9;

    .panel {
      display: flex;
      flex-direction: column;
      border-radius: var(--border-radius-base);
      overflow: hidden;
      border: @borderStyle;

      .panel-head {
        background: rgba(0, 176, 117, 0.04);
        height: 38px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: @borderStyle;
        padding: 0 17px;
        flex-shrink: 0;

        .link {
          cursor: pointer;
          color: @green-blue;
        }
      }
    }

    .options {
      width: 614px;

      .panel-body {
        display: flex;
        flex: 1;
        overflow: hidden;
        cursor: default;

        .dt {
          padding: 0 17px;
          font-weight: 500;
          font-family: PingFangSC-Medium, PingFang SC;
          margin-top: 12px;
        }

        .left {
          height: 100%;
          width: 206px;
          border-right: @borderStyle;
          overflow-y: auto;
          line-height: 22px;

          .dd {
            .li {
              cursor: pointer;
              padding: 0 17px 0 31px;
              margin-top: 12px;
            }

            .active {
              color: @green-blue;
            }
          }
        }

        .right {
          flex: 1;
          height: 100%;
          overflow-y: auto;

          .dd {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 14px;

            .li {
              width: 50%;
              padding: 0 17px;
              margin-top: 12px;
              display: flex;
              align-items: center;
              cursor: pointer;
              white-space: nowrap;

              .icon {
                flex-shrink: 0;
                width: 16px;
                height: 16px;
                background: rgba(255, 255, 255, 1);
                border-radius: 50%;
                border: 1px solid rgba(0, 0, 0, 0.15);
                margin-right: 5px;
              }

              .iconfont {
                margin-right: 5px;
                font-size: 16px !important;
                line-height: 1 !important;
              }

              &.disabled {
                pointer-events: none;
                cursor: default;

                .iconfont {
                  color: rgba(0, 0, 0, 0.65);
                }
              }

              &.checked {
                .iconfont {
                  color: @green-blue;
                }
              }
            }

            &:not(:last-of-type) {
              border-bottom: @borderStyle;
            }
          }
        }
      }
    }

    .selected {
      width: 228px;

      .panel-body {
        overflow: auto;
        flex: 1;

        .dt {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: rgba(0, 0, 0, 0.65);
          line-height: 20px;
          padding: 0 19px;
          margin: 12px 0 7px;
        }

        .dd {
          .li {
            width: 195px;
            height: 28px;
            background: rgba(245, 245, 245, 1);
            border-radius: var(--border-radius-base);
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            color: rgba(0, 0, 0, 0.65);
            padding: 0 8px 0 10px;
            box-sizing: border-box;
            cursor: move;
            user-select: none;

            .anticon {
              margin-right: 6px;
              font-size: 12px;
              font-weight: lighter;
            }

            .txt {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .anticon-close {
              margin-left: auto;
              color: rgba(0, 0, 0, 0.45);
              transform: scale(.8);
              margin-right: 0;
              cursor: pointer;
              flex-shrink: 0;
            }
          }

          .disabled {
            cursor: default;
            color: rgba(0, 0, 0, 0.45);
            background: rgba(0, 0, 0, 0.25);
          }
        }
      }
    }
  }
</style>
