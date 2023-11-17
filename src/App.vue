<template>
  <CustomForm :form="form" :formItem="items"></CustomForm>
</template>

<script lang="tsx" setup>
import { ref, h, markRaw, resolveComponent } from "vue";
import CustomForm from "./CustomForm.vue";
// import { ElButton } from "element-plus";
import { ElInput, ElSwitch } from "element-plus";

const form = ref<any>({});
// name字段名，后面提示
const items = ref({
  // 默认input
  name: "姓名",
  input2: {
    inner: "el-input",
    label: "输入2",
  },
  switch1: {
    label: "开关1",
    inner: markRaw(ElInput),
    // inner: "el-switch",
    // inner: h(ElInput),
  },
  switch2: {
    label: "开关2",
    inner: {
      is: "el-switch",
    },
  },
  // date: {
  //   label: "日期选择",
  //   inner: {
  //     is: "el-date-picker",
  //     type: "date",
  //   },
  // },
});

// setTimeout(() => {
//   console.log(items.value);
// }, 2000);

// TODO 多层传参
// TODO 日期选择报黄
// 支持item内插槽
// 支持form插槽
// 支持自动导入
// const onSubmit = () => {
//   console.log(form)
//   // console.log("submit!");
// };
</script>
