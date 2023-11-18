支持 tsx
pnpm i @vitejs/plugin-vue-jsx -D
https://zhuanlan.zhihu.com/p/423860019?utm_id=0&wd=&eqid=afdc27b5000037d800000003645f575a

使用：

1. vue 文件中
   script 使用 jsx 作为 lang，可以书写 fc，并在 template 以函数名引用
   script 中 export default 对象的 setup 中书写 fc，并返回函数名。不需要书写 template。
2. jsx 文件中
   使用 vue 提供的 defineComponent，接收一个函数，该函数和 setup 类似，并返回函数名。
   使用 vue 提供的 defineComponent，接收一个对象，和 export default 是一样的。使用 props 对象定义属性。在 setup 中接收 props。

方案二：h 函数

## 动态表单

1. 不可直接新增 ref 的属性。
2. 组件要用 markRaw 包裹，用字符串就不用。

## 自动导入

暂时不支持自动导入写法。
全局导入可以直接使用字符串。

## v-model 问题

1. 无法绑定表达式。new function 不行，不支持 jsx。最后通过代理+lodash 解决了。
2. 无法绑定到变量组件，需要预先写好 el-input 才能绑定 v-model。h 可以传入其它参数，但是不能接收 v-model。
