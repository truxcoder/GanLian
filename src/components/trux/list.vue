<!--
 * @Author: truxcoder
 * @Date: 2021-12-24 09:30:37
 * @LastEditTime: 2021-12-24 14:32:58
 * @LastEditors: truxcoder
 * @Description: 列表
-->

<template>
  <dl class="trux-dl">
    <dt class="trux-dt">
      <div>{{ title }}</div>
    </dt>
    <dd v-for="(item, index) in data" :key="index" class="trux-dd">
      <div><slot :rowData="item">无内容</slot></div>
    </dd>
  </dl>
</template>

<script>
export default {
  name: 'TruxList',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.trux-dl {
  --tw-border-opacity: 1;
  border-width: 1px;
  border: 1px solid rgba(209, 213, 219, var(--tw-border-opacity));
  border-radius: 0.375rem /* 6px */;
  width: 100%;
  color: #606266;
}

.trux-dt {
  --tw-bg-opacity: 1;
  --tw-border-opacity: 1;
  background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  min-height: 2.5rem /* 40px */;
  border-bottom: 1px solid rgba(229, 231, 235, var(--tw-border-opacity));
}
.trux-dt div {
  padding-left: 0.5rem /* 16px */;
  padding-right: 0.5rem /* 16px */;
  font-weight: 600;
  height: 100%;
  line-height: 2.5rem /* 40px */;
}
.trux-dd:not(:last-child) {
  --tw-bg-opacity: 1;
  min-height: 2.5rem /* 40px */;
  border-bottom: 1px solid rgba(229, 231, 235, var(--tw-border-opacity));
}
.trux-dd:last-child {
  --tw-bg-opacity: 1;
  min-height: 2.5rem /* 40px */;
}

.trux-dd div {
  padding-left: 0.5rem /* 16px */;
  padding-right: 0.5rem /* 16px */;
  height: 100%;
  line-height: 2.5rem /* 40px */;
}
</style>
