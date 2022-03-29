<!--
 * @Author: truxcoder
 * @Date: 2022-03-09 10:47:02
 * @LastEditTime: 2022-03-09 14:58:05
 * @LastEditors: truxcoder
 * @Description: 文件上传
-->

<template>
  <div>
    <el-upload
      ref="upload"
      :on-change="handleChange"
      :action="uploadURL"
      :file-list="fileList"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { uploadURL } from '@/settings'
export default {
  name: 'Upload',
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  computed: {
    uploadURL() {
      return uploadURL + '/upload'
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>

</style>
