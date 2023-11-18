
import { defineComponent, ref, onMounted, onBeforeUpdate, markRaw, h, resolveComponent } from 'vue'
import { get, set, toPairs, omit } from 'lodash-es'

// const myInput = h(resolveComponent('el-input'))


export default defineComponent({
  components: ['myInput'],
  props: {
    form: Object,
    formItem: Object,
  },
  name: 'mz', emits: ['submit'],
  setup(prop, { emit }) {
    const { form, formItem } = prop;

    const onSubmit = () => {
      console.log(form, prop.form);
      emit('submit')
    }


    const newFormItem = ref({});
    const genNewFormItem = () => {
      newFormItem.value = { ...prop.formItem };

      // 为了支持遍历，

      // console.LockManager(new)

      const keys = Object.keys(prop.formItem);
      for (let key of keys) {
        let column = prop.formItem[key];
        // 预处理
        if (typeof column === "string") {
          Reflect.set(newFormItem.value, key, {
            key: key,
            prop: key,
            label: column,
            inner: { is: h(resolveComponent("el-input")) },
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
          // console.log(column)
          if (!Reflect.has(column, "prop")) {
            Reflect.set(column, "prop", key);
          } else if (Array.isArray(column['prop'])) {
            // 传入数组表示path需要处理
            // TODO 格式检查，比如第一个字母不能是
            try {
              // 让get去检查格式问题并报错。但是试过了没有反应
              get(form, column['prop'])
            } catch (e) {
              console.log(e);
            }
            column['prop'] = column['prop'].reduce((pre, cur) => {
              if (isNaN(Number(cur))) {
                return pre + "." + cur;
              } else {
                return pre + "[" + cur + "]";
              }
            });
            // console.log(column['prop']);
          }

          if (Reflect.has(column, "inner")) {
            const comp = Reflect.get(column, "inner");
            if (typeof comp === "string") {
              Reflect.set(column, "inner", { is: h(resolveComponent(comp)) });
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
          // 直接对form进行修改，赋初始值，在保证有prop后进行。prop标识属性在form中的位置
          if (Reflect.has(column, "default")) {
            // 这里的prop还不支持多层路径写法
            // Reflect.set(prop.form, column.prop, column.default);
            // prop:string / string[]
            set(prop.form, column.prop, column.default);
          }
        }
      }

      // console.log(newFormItem.value);
      // toPairs(newFormItem.value).forEach(([key, value]) => {
      //   console.log(value.inner.is)
      // })
    };

    // TODO 无法处理多层嵌套
    // watch不生效
    // watch(() => prop.formItem, genNewFormItem, { immediate: true });
    onMounted(genNewFormItem);
    onBeforeUpdate(genNewFormItem);

    const proxys = new Proxy(form, {
      get: function (target, property) {
        // function返回值用于读取
        // console.log(target)
        // console.log(form)
        return get(target, property)
        // 如果是数组怎么办？预处理时将其转换为字符串
      },
      set: function (target, property, value) {
        // console.log(value)
        set(target, property, value)
        return true;
      }
    })

    // const myInput = (str) => <>{str}</>
    return () => <>
      {/* <el-form>
        <el-form-item label='名字'>
          <el-input></el-input>
        </el-form-item>
      </el-form> */}
      <el-form model={form}>
        {
          toPairs(newFormItem.value).map(([key, value]) => {
            return <>
              <el-form-item {...omit(value, ['default', 'inner', 'prop'])} >
                {/* <myInput v-model={proxy[value.prop]}></myInput> */}
                {/* {myInput('hhh')} */}
                {/* {h(resolveComponent('el-input'))} */}
                {/* <component is={} v-model={proxys[value.prop]}></component> */}
                {/* {h(value.inner.is, { 'v-model': proxys[value.prop] })} */}
                {/* {h(resolveComponent('el-input'), { 'v-model': proxy[value.prop] }, '按钮')} */}
                {/* <el-input v-model={proxys[value.prop]}></el-input> */}
                {/* <el-input v-model={proxys[value.prop]}></el-input> */}
              </el-form-item></>
          })
        }
        <el-button onClick={onSubmit}>tijiao</el-button>
      </el-form>
    </>
  }
})
