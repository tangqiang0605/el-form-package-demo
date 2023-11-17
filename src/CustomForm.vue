<template>
  <el-form :model="form">
    <el-form-item
      v-for="(value, key) in formItem"
      :label="value"
      :key="key"
      :prop="key"
    >
      <el-input v-model="form[key]" />
    </el-form-item>
    <!-- <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// defineProp
const props = defineProps<{
  form: any;
  formItem: any;
}>();
const onSubmit = () => {
  console.log(props.form);
};
</script>

<style scoped></style>
