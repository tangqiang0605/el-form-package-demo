
import { defineComponent, ref, onBeforeUpdate } from 'vue'
import { get, set, has, toPairs, omit, mapKeys, startCase, kebabCase, defaultsDeep } from 'lodash-es'

const pathArrToString = (arr: Array<string | number>) => {
  return arr.reduce((pre: string | number, cur: string | number) => {
    if (isNaN(Number(cur))) {
      return pre + "." + cur;
    } else {
      return pre + "[" + cur + "]";
    }
  });
}

interface CFormProp {
  form: any,
  formItem: any
}

export default defineComponent({
  props: {
    form: Object,
    formItem: Object,
  },
  setup(prop: CFormProp, { expose, attrs, slots }) {
    const formItemRef: any = {}
    // 根据配置生成渲染所需数据
    const newFormItem = ref({});

    // 代理form，用于在v-model上使用prop表示路径
    const proxys: any = new Proxy(prop.form, {
      get: function (target, property) {
        return get(target, property)
      },
      set: function (target, property, value) {
        set(target, property, value)
        return true;
      }
    })

    const genNewItemForm = () => {
      const keys = Object.keys(prop.formItem);
      newFormItem.value = { ...prop.formItem };
      for (let key of keys) {
        // 预处理
        set(formItemRef, key, ref())
        // 预处理
        let column = prop.formItem[key];
        if (typeof column === "string") {
          set(newFormItem.value, key, {
            key: key,
            prop: key,
            label: column,
            inner: { is: 'el-input', event: {} },
          });
        }
        if (typeof column === "object") {
          // 设置默认属性
          defaultsDeep(column, {
            key: key,
            prop: key,
            label: key,
            inner: { is: 'el-input', event: {} }
          })

          if (has(column, 'event')) {
            if (Object.keys(column.event)) {
              column.event = mapKeys(column.event, (_, key) => 'on' + startCase(key))
            }
          }

          // 处理prop属性
          if (Array.isArray(column['prop'])) {
            column['prop'] = pathArrToString(column['prop'])
          }

          // 处理default属性。
          // 直接对form进行修改，赋初始值，在保证有prop后进行。prop标识属性在form中的位置
          if (has(column, "default")) {
            set(prop.form, column.prop, column.default);
          }

          // 处理slot属性，slot属性为一个插槽对象
          const slotKeys = Object.keys(slots);
          for (let key of slotKeys) {
            const res = key.match(/^(\S+)-(\S+)/);
            if (res && res[2] == column.key) {
              if (!has(column, "slot")) {
                set(column, "slot", {});
              }
              set(column.slot, res[1], slots[key]);
            }
          }
          if (has(column, 'slot') && has(column, 'inner')) {
            console.warn('slot已存在，inner将不被渲染')
          }

          // 处理inner属性
          if (has(column, 'inner') && !has(column, 'slot')) {
            if (typeof column.inner === 'string') {
              set(column, 'inner', { is: column.inner, event: {} })
            }
            if (has(column, 'inner.is.name')) {
              // inner.is支持具名组件
              column.inner.is = kebabCase(column.inner.is.name)
            }
            // if(has(column.inner.event))
            if (Object.keys(column.inner.event)) {
              column.inner.event = mapKeys(column.inner.event, (_, key) => 'on' + startCase(key))
            }
          }
        }
      }
      // console.log(newFormItem.value)
    }
    genNewItemForm()
    // onMounted(genNewItemForm)
    // 更新事件
    onBeforeUpdate(genNewItemForm)
    // 暴露ref、事件，可以使用proxy优化这个过程
    const formRef = ref({})
    expose({ formRef, formItemRef })

    // 渲染inner组件
    const genInner = (type: string, prop: string, attrs: any, events: any) => {
      // {
      //   value.inner.is === 'el-switch' && <el-switch v-model={proxys[value.prop]} {...omit(value.inner, ['is', 'event'])} {...value.inner.event}></el-switch>
      // }
      switch (type) {
        case 'el-input':
          return <el-input v-model={proxys[prop]} {...attrs} {...events}></el-input>
        case 'el-switch':
          return <el-switch v-model={proxys[prop]} {...attrs} {...events}></el-switch>
        case 'el-date-picker':
          return <el-date-picker v-model={proxys[prop]} {...attrs} {...events}></el-date-picker>
        default:
          break;
      }
    }

    // 设置slot或inner
    const getSlotorInner = (value: any) => {
      if (value.slot) {
        return value.slot;
      } else {
        return genInner(value.inner.is, value.prop, { ...omit(value.inner, ['is', 'event']) }, { ...value.inner.event })
      }
    }

    return () => <>
      <el-form model={prop.form} ref={formRef} {...attrs}>
        {
          toPairs(newFormItem.value).map(([key, value]: [string, any]) => {
            return <>
              <el-form-item {...omit(value, ['default', 'inner', 'prop', 'event'])} {...value.event} ref={formItemRef[key]}>
                {getSlotorInner(value)}
              </el-form-item>
            </>
          })
        }
      </el-form>
    </>
  }
})
