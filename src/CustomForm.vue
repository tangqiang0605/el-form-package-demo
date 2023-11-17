<template>
  <el-form :model="form">
    <!-- TODO item是绑定到组件上，但是没有进行过滤 -->
    <el-form-item v-for="item in newFormItem" v-bind="item">
      <component
        v-if="item.inner"
        v-model="form[item.prop]"
        :is="item.inner.is"
        v-bind="item.inner"
      ></component>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { markRaw, onBeforeUpdate, onMounted, ref, watch } from "vue";

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
        inner: { is: "el-input" },
      });
    }

    if (typeof column === "object") {
      // 设置默认属性
      // TODO 可以直接使用lodash的defaults
      if (!Reflect.has(column, "key")) {
        Reflect.set(column, "key", key);
      }
      if (!Reflect.has(column, "label")) {
        Reflect.set(column, "label", key);
      }
      if (!Reflect.has(column, "prop")) {
        Reflect.set(column, "prop", key);
      }

      if (Reflect.has(column, "inner")) {
        const comp = Reflect.get(column, "inner");
        if (typeof comp === "string") {
          Reflect.set(column, "inner", { is: comp });
        } else if (typeof comp === "object" && comp) {
          // comp就是column['inner']
          if (Reflect.has(comp, "is")) {
            if (typeof Reflect.get(comp, "is") === "string") {
            } else {
              // 对组件进行markRaw
              // Object.assign
              Reflect.set(column, "inner", {
                ...comp,
                is: markRaw(comp.is),
              });
            }
          } else {
            // 对组件进行markRaw
            Reflect.set(column, "inner", { is: markRaw(comp) });
          }
        }
      }
      //
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

// watch不生效
// watch(() => prop.formItem, genNewFormItem, { immediate: true });
onMounted(genNewFormItem);
onBeforeUpdate(genNewFormItem);
</script>

<style scoped></style>
