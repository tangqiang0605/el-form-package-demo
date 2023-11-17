<template>
  <CustomForm :form="form" :formItem="items"></CustomForm>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import CustomForm from "./CustomForm.vue";
// 使用items替代form
const form = reactive({});

// name字段名，后面提示
const items = {
  name: "姓名",
  id: "工号",
  age: "年龄",
};

// const onSubmit = () => {
//   console.log(form)
//   // console.log("submit!");
// };
</script>
