<template>
  <!-- <CustomForm :form="form" :formItem="items"></CustomForm> -->
  <CForm
    :form="form"
    :form-item="items"
    @submit="onSubmit"
    label-width="100"
    ref="formRef"
    @validate="show"
  >
    <template #default-input2> hello </template>
  </CForm>
  <!-- <Normal ref="formRef"></Normal> -->
  <el-button @click="getSomething">插入一项</el-button>
</template>

<script lang="tsx" setup>
import CForm from "./CForm";
import { ref } from "vue";
const formRef = ref<any>();
const getSomething = async () => {
  const result = await formRef.value.formRef.validate();
  console.log(result);
};
const show = () => {
  console.log("事件被触发，透传成功");
};
const form = ref<any>({});
// name字段名，后面提示
const items = ref({
  // 默认input
  name: "姓名",
  input2: {
    inner: "el-input",
    label: "输入2",
    default: "默认输入2",
  },
  switch1: {
    label: "开关1",
    inner: {
      is: "el-switch",
      event: {
        blur: () => {
          console.log("失去焦点");
        },
      },
    },
    // slot:true,
    // inner: markRaw(ElInput),
    // prop: "a[0].b.c",
    prop: ["a", "c", "b", "c"],
    // 如果输入数组，会在被proxys使用前转换为字符串，即['a','b']转换为'a,b'
  },
  // switch2: {
  //   label: "开关2",
  //   inner: {
  //     is: "el-switch",
  //   },
  // },
});
const onSubmit = () => {
  console.log("外部得到的值", form.value);
  // console.log("submit!");
};
</script>
