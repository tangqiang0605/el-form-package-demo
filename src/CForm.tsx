
import { defineComponent, ref, onMounted, onBeforeUpdate, markRaw, h, resolveComponent, defineExpose, toRaw } from 'vue'
import { get, set, toPairs, omit, mapKeys, startCase, kebabCase } from 'lodash-es'

export default defineComponent({
  props: {
    form: Object,
    formItem: Object,
  },
  emits: ['submit'],
  setup(this, prop, { emit, expose, attrs, slots }) {
    const { form, formItem } = prop;

    const onSubmit = () => {
      console.log(form, prop.form);
      emit('submit')
    }

    const formItemRef = {}
    const newFormItem = ref({});
    newFormItem.value = { ...prop.formItem };
    const keys = Object.keys(prop.formItem);

    for (let key of keys) {
      Reflect.set(formItemRef, key, ref())
      let column = prop.formItem[key];
      // 预处理
      if (typeof column === "string") {
        Reflect.set(newFormItem.value, key, {
          key: key,
          prop: key,
          label: column,
          inner: { is: 'el-input' },
        });
      }
      if (typeof column === "object") {
        // prop.formItem[key] = toRaw(column)
        // 设置默认属性，可以直接使用lodash的defaults
        if (!Reflect.has(column, "key")) {
          Reflect.set(column, "key", key);
        }
        if (!Reflect.has(column, "label")) {
          Reflect.set(column, "label", key);
        }
        if (!Reflect.has(column, "prop")) {
          Reflect.set(column, "prop", key);
        } else if (Array.isArray(column['prop'])) {
          column['prop'] = column['prop'].reduce((pre, cur) => {
            if (isNaN(Number(cur))) {
              return pre + "." + cur;
            } else {
              return pre + "[" + cur + "]";
            }
          });
        }

        // 处理插槽
        const slotKeys = Object.keys(slots);
        for (let key of slotKeys) {
          const res = key.match(/^(\S+)-(\S+)/);
          // 查找不到则res为null
          if (res && res[2] == Reflect.get(column, "key")) {
            if (!Reflect.has(column, "slot")) {
              Reflect.set(column, "slot", {});
            }
            Reflect.set(Reflect.get(column, "slot"), res[1], slots[key]);
          }
        }

        // console.log(column['slot'])

        if (Reflect.has(column, "inner")) {
          if (Reflect.has(column, 'slot')) {
            console.warn('slot已存在，inner将不被渲染')
          } else {
            const comp = Reflect.get(column, "inner");
            if (typeof comp === "string") {
              // {inner:string}
              Reflect.set(column, "inner", { is: comp });
            } else if (typeof comp === "object" && comp) {
              // comp就是column['inner']


              if (Reflect.has(comp, "is")) {
                // {inner:{is:xxx}}
                if (typeof Reflect.get(comp, "is") === "string") {
                } else {
                  // 对组件进行处理
                  Reflect.set(column, "inner", {
                    ...comp,
                    is: kebabCase(comp.name),
                  });
                }
              } else {
                if (Reflect.has(comp, 'name')) {
                  // {inner:组件}
                  // 对组件进行处理
                  Reflect.set(column, "inner", { is: kebabCase(comp.name) });
                } else {
                  // {inner:{ 没有is }}，默认is
                  Reflect.set(column, 'inner', { is: 'el-input' })
                }
              }

              if (Reflect.has(comp, 'event')) {
                Reflect.set(comp, 'event', mapKeys(comp['event'], (value, key) => 'on' + startCase(key)))
              } else {
                Reflect.set(comp, 'event', {})
              }
            }
          }
        } else {
          set(column, "inner.is", 'el-input')
          set(column, "inner.event", {})
          // Reflect.set(column, "inner", { is: comp });
        }
        // 直接对form进行修改，赋初始值，在保证有prop后进行。prop标识属性在form中的位置
        if (Reflect.has(column, "default")) {
          set(prop.form, column.prop, column.default);
        }
      }
    }
    // };
    // genNewFormItem()

    console.log(newFormItem)



    const proxys = new Proxy(form, {
      get: function (target, property) {
        return get(target, property)
      },
      set: function (target, property, value) {
        set(target, property, value)
        return true;
      }
    })

    const genComponents = (type, vModel, attrs, events) => {
      // {
      //   value.inner.is === 'el-input' && 
      // }
      // {
      //   value.inner.is === 'el-switch' && <el-switch v-model={proxys[value.prop]} {...omit(value.inner, ['is', 'event'])} {...value.inner.event}></el-switch>
      // }
      // {
      //   value.inner.is === 'el-rate' && <el-rate v-model={proxys[value.prop]} {...omit(value.inner, ['is', 'event'])} {...value.inner.event}></el-rate>
      // }
      // {
      //   value.inner.is === 'el-color-picker' && <el-color-picker v-model={proxys[value.prop]} {...omit(value.inner, ['is', 'event'])} {...value.inner.event}></el-color-picker>
      // }
      switch (type) {
        case 'el-input':
          return <el-input v-model={vModel} {...attrs} {...events}></el-input>
        case 'el-switch':
          return <el-switch v-model={vModel} {...attrs} {...events}></el-switch>
        default:
          break;
      }
    }

    // 暴露ref、事件，可以使用proxy优化这个过程
    const formRef = ref({})
    expose({ formRef, formItemRef })

    const getSlot = (value) => {
      if (value.slot) {
        return value.slot;
      }
      return genComponents(value.inner.is, proxys[value.prop], { ...omit(value.inner, ['is', 'event']) }, { ...value.inner.event })
    }

    return () => <>
      <el-form model={form} ref={formRef} {...attrs}>
        {
          toPairs(newFormItem.value).map(([key, value]) => {
            return <>
              <el-form-item {...omit(value, ['default', 'inner', 'prop'])} ref={formItemRef[key]}>
                {/* {{
                  default: () => 'default slot',
                  foo: () => <div>foo</div>,
                  bar: () => [<span>one</span>, <span>two</span>]
                }} */}
                {getSlot(value)}
                {/* {value.slot || genComponents(value.inner.is, proxys[value.prop], { ...omit(value.inner, ['is', 'event']) }, { ...value.inner.event })} */}
              </el-form-item>
            </>
          })
        }
        <el-button onClick={onSubmit}>tijiao</el-button>
      </el-form>
    </>
  }
})
