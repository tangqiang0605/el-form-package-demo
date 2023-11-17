<template>
  <CustomForm :form="form" :formItem="items"></CustomForm>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import CustomForm from "./CustomForm.vue";
// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

// name字段名，后面提示
const items = {
  name: "姓名",
  id: "工号",
  age: "年龄",
};

// const onSubmit = () => {
//   console.log("submit!");
// };
</script>
