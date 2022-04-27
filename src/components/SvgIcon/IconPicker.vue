<!--
 * @Author: truxcoder
 * @Date: 2022-03-29 10:29:36
 * @LastEditTime: 2022-04-01 16:32:43
 * @LastEditors: truxcoder
 * @Description: 图标选择
-->

<template>
  <div>
    <el-input id="iconInput" :style="{width}" class="icon-input" :value="value" placeholder="请选择图标" @input="onInput">
      <i slot="prefix" class="el-input__icon" style="color:#999" :class="value" />>
      <i id="iconOpen" slot="suffix" class="el-input__icon el-icon-menu icon-open" @click="onOpen($event)" />
    </el-input>
    <div v-show="visible" class="options" :style="{'top': mt, 'width':width ? width : '500px'}">
      <dl class="">
        <dt v-for="v in iconList" :key="v.value" class=" inline-block p-2 text-xl"><i :class="v.value" class="icon-item" @click="handleSelect(v.value)" /></dt>
      </dl>
    </div>
  </div>
</template>

<script>
import { iconList } from '@/utils/icon'
export default {
  name: 'IconPicker',
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mt: '-340px',
      iconList,
      visible: false
    }
  },
  methods: {
    onOpen(e) {
      this.mt = document.getElementById('iconOpen').getBoundingClientRect().top > 350 ? '-305px' : '40px'
      this.visible = !this.visible
      // const h = window.window.innerHeight - document.getElementById('iconOpen').getBoundingClientRect().bottom
    },
    onInput(v) {
      this.$emit('input', v)
    },
    handleSelect(item) {
      console.log(item)
      this.visible = !this.visible
      this.$emit('input', item)
    }
  }

}
</script>

<style lang="scss" scoped>
.icon-input {
  margin-top: 0px;
}
.icon-open {
  cursor: pointer;
}
.icon-open:hover {
  color: #09c!important;
}
.options {
  padding: 5px;
  z-index: 999;
  position: absolute;
  overflow: auto;
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  // box-shadow: 0 0 10px 1px #dedede;
}
.icon-item {
  cursor: pointer;
}
.icon-item:hover {
  color: #09c!important;
}
.options::-webkit-scrollbar{
  width:0!important;
}
.options:hover::-webkit-scrollbar{
  width:10px!important;
}

.options::-webkit-scrollbar-track{
  // background-color: #f5f5f5;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
  border-radius: 5px;
}
.options::-webkit-scrollbar-thumb{
  // background-color: rgba(0,0,0,0.2);
  background-color: #bbb;
  border-radius: 5px;
}
.options::-webkit-scrollbar-button{
  display: none;
}

</style>
