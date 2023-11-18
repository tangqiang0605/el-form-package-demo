import { defineComponent, ref, h, resolveComponent, onMounted } from "vue";
export default defineComponent({
  name: "HelloWorld",
  setup(_, { expose }) {
    const text = ref("欢迎关注公众号~WEB前端李志杰~")
    onMounted(() => {

    })
    const setExpose = () => {
      expose({
        a: 'eee'
      })
    }
    setTimeout(setExpose)
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