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
