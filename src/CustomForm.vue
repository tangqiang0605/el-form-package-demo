<template>
  <el-form :model="form">
    <el-form-item v-for="item in newFormItem" v-bind="item">
      <el-input v-model="form[item.key]" />
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
import { onMounted, ref } from "vue";

// defineProp
const prop = defineProps<{
  form: any;
  formItem: any;
}>();
// TODO 如何处理emit
defineEmits(["onSubmit"]);

const onSubmit = () => {
  console.log(prop.form);
};
const newFormItem = ref({});
const genNewFormItem = () => {
  newFormItem.value = { ...prop.formItem };
  const keys = Object.keys(prop.formItem);
  for (let key of keys) {
    let column = prop.formItem[key];
    // 预处理
    if (typeof column === "string") {
      Reflect.set(newFormItem.value, key, {
        key: key,
        prop: key,
        label: column,
      });
    }

    if (typeof column === "object") {
      // 设置默认属性
      if (!Reflect.has(column, "key")) {
        Reflect.set(column, "key", key);
      }
      if (!Reflect.has(column, "label")) {
        Reflect.set(column, "label", key);
      }
      if (!Reflect.has(column, "prop")) {
        Reflect.set(column, "prop", key);
      }
      // defaults
      // 处理插槽
      // const slotKeys = Object.keys(slots);
      // for (let key of slotKeys) {
      //   const res = key.match(/^(\S+)-(\S+)/);
      //   // 查找不到则res为null
      //   if (res && res[2] == Reflect.get(column, "key")) {
      //     if (!Reflect.has(column, "slot")) {
      //       Reflect.set(column, "slot", {});
      //     }
      //     Reflect.set(Reflect.get(column, "slot"), res[1], res[0]);
      //   }
      // }
    }
  }
  console.log(newFormItem.value);
};
// onMounted(genNewTableHeader);
// onBeforeUpdate(genNewTableHeader);
onMounted(genNewFormItem);
</script>

<style scoped></style>
