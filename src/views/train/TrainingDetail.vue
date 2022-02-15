<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 19:46:18
 * @LastEditTime: 2022-02-09 10:50:44
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="flex w-full">
      <div class="w-1/2">
        <div class=" font-semibold mb-2">{{ row.title }}</div>
        <hr class="mb-4" />
        <el-descriptions class="margin-top" title="" :column="2" border>
          <el-descriptions-item label="开始时间"> {{ row.startTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="结束时间"> {{ row.endTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="培训地点"> {{ row.place }} </el-descriptions-item>
          <el-descriptions-item label="培训性质"> {{ row.property === 1 ? '系统内培训' : '系统外培训' }} </el-descriptions-item>
          <el-descriptions-item label="组织单位"> {{ row.organ }} </el-descriptions-item>
          <el-descriptions-item label="组织部门"> {{ row.department }} </el-descriptions-item>
          <el-descriptions-item label="培训学时"> {{ row.period }}学时 </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class=" flex-1 ml-4">
        <el-card>
          <div>
            <div class=" font-semibold">培训简介</div>
            <el-divider />
          </div>
          <div>{{ row.intro }}</div>
        </el-card>
      </div>
    </div>
    <!-- <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="培训标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="培训地点" prop="place">
        <el-input v-model="form.place" :style="formLineWidth" placeholder="请输入地点" />
      </el-form-item>
      <el-form-item label="组织单位" prop="organ">
        <el-select v-model="form.organ" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织部门" prop="department">
        <el-select v-model="form.department" :style="formItemWidth" filterable allow-create placeholder="请选择或输入部门名称">
          <el-option v-for="i in options.department" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="性质" prop="property">
        <el-select v-model="form.property" :style="formItemWidth" placeholder="请选择性质">
          <el-option v-for="i in options.property" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学时" prop="period">
        <el-input v-model.number="form.period" type="number" :style="formItemWidth" placeholder="请输入学时(数字)" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="培训简介" prop="intro">
        <el-input v-model="form.intro" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :style="formLineWidth" placeholder="输入培训简介" />
      </el-form-item>
    </el-form> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'

export default {
  name: 'TrainingDetail',
  mixins: [common_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      resource: 'training',
      dialogLoading: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('visibleChange', 'detail')
    }
  }
}
</script>

<style></style>
