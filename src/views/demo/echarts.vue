<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :auto-upload="false"
      :file-list="fileList"
    >
      <el-button
        size="small"
        type="primary"
      >点击上传</el-button>
      <div
        slot="tip"
        class="el-upload__tip"
      >只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button @click="submit">
      上传到服务器
    </el-button>
  </div>
</template>


<script>
export default {
  data () {
    return {
      fileList: [
      ]
    }
  },
  methods: {
    submit () {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>
img{
  width: 100% !important;
}
</style>

