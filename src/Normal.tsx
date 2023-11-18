import { defineComponent, ref, h, resolveComponent } from "vue";
export default defineComponent({
  name: "HelloWorld",
  setup() {
    const text = ref("欢迎关注公众号~WEB前端李志杰~");

    // let sum = new Function('a', 'b', 'return form');
    // const proxys = new Proxy(form, {
    //   get: function (target, property) {
    //     // function返回值用于读取
    //     return get(form, property)
    //     // 如果是数组怎么办？预处理时将其转换为字符串
    //   },
    //   set: function (target, property, value) {
    //     set(form, property, value)
    //   }
    // })
    // console.log(sum(1, 2)); // the result is 3

    return () => (
      <>
        <h1>{text.value}</h1>
        {/* v-model无法通过h绑定，也无法通过value+onInput处理 */}
        {/* <el-input v-model={proxys[]}></el-input> */}
        {/* {h(resolveComponent('el-input'), { 'placeholder': 'aaa' })} */}
        {/* <input v-model={text.value} placeholder="请关注关注公众号~WEB前端李志杰~" /> */}
      </>
    );
  },
});