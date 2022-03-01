<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 17:48:17
 * @LastEditTime: 2022-02-28 17:51:29
 * @LastEditors: truxcoder
 * @Description:import E from 'wangeditor'
const editor = new E('#div1')
// 或者 const editor = new E( document.getElementById('div1') )
editor.create()
-->

<template />

<script>
import E from 'wangeditor'
export default {
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    // 创建编辑器
    this.editor = new E(`#demo`)
    // 默认情况下，显示所有菜单
    this.editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'emoticon',
      'image',
      'video',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo'
    ]
    this.editor.create()
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style></style>
