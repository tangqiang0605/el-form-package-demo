import { defineComponent } from 'vue'

// // 返回jsx
// export const MyButton = <>hello1</>

// // 返回jsx的函数，函数式组件
// export function MyButton(props, { slots, emit, attrs }) {
//   console.log(props, slots, emit, attrs)
//   return <>hello2</>
// }

// 导出普通对象，使用setup、render分离。return的值被渲染。
// export const MyButton = {
//   render() {
//     return <>hello3</>
//   }
// }

// 导出普通对象，使用setup，返回一个替代render的渲染函数
// export const MyButton = {
//   setup() {
//     return () => <>hello4</>
//   }
// }

// 贵在有语法提示
// export const MyButton = defineComponent({
//   render() {
//     return <>hello55</>
//   }
// })
// export const MyButton = defineComponent({
//   setup(a, b, c) {
//     return () => <>hello55</>
//   }
// })

// 函数式组件，贵在语法提示
export const MyButton = defineComponent((props, ctx) => {
  console.log(props, ctx)
  return () => <>hello66</>
})


