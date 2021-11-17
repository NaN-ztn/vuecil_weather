<template>
  <div class="layout">
    <el-container class="container">
      <el-aside class="aside test-1">
        <div class="body">
          <div class="head">
            <svg class="icon logo" aria-hidden="true">
              <use xlink:href="#icon-tianqi"></use>
            </svg>
            <span>天气查询</span>
          </div>
          <el-divider @click="addmenuList">
            <i class="iconfont icon-tianjia"></i>
          </el-divider>
          <el-menu
            background-color="#888"
            text-color="#fff"
            :router="true"
            :default-active="defaultActive"
          >
            <el-menu-item index="/">
              <i class="iconfont icon-dingwei"></i>所在地天气
            </el-menu-item>
            <el-menu-item
              v-for="(city, index) in menuList"
              :key="city"
              :index="city"
            >
              <div class="menuInfo">
                {{ city.slice(7) }}
                <i
                  class="iconfont icon-shanchu1"
                  @click.stop="deleteMenu(index)"
                ></i>
              </div>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <transition mode="out-in" enter-active-class="fadeInLeft">
          <router-view class="animated" v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </router-view>
        </transition>
      </el-main>
    </el-container>
    <el-dialog
      v-model="visible"
      title="添加城市"
      width="600px"
      @close="handleClose"
      center
    >
      <el-form :model="ruleForm" label-width="100px" class="good-form">
        <el-form-item label="地区">
          <el-cascader
            ref="cascader"
            :placeholder="defaultCate"
            style="width: 300px"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, nextTick, ref, getCurrentInstance } from 'vue'
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
// import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const internalInstance = getCurrentInstance()
    const cascader = ref(null)
    const taiwan = ["台北市", "高雄市", "基隆市", "台中市", "台南市", "新竹市", "嘉义市"]
    const router = useRouter()
    const state = reactive({
      ruleForm: {},
      menuList: [],
      visible: false,
      defaultCate: '',
      options: provinceAndCityData,
      cityName: '',
      defaultActive: '/',

    })
    const handleClose = () => {
      cascader.value.panel.clearCheckedNodes()
    }
    const addmenuList = () => {
      state.visible = true
    }
    const handleChange = (val) => {
      // val.map((item) => {
      //   console.log(CodeToText[item])
      // })
      if (val !== null)
        state.cityName = '/?city=' + ((CodeToText[val[1]] === '市辖区' || CodeToText[val[1]] === '县' || CodeToText[val[1]] === '自治区直辖县级行政区划' || CodeToText[val[1]] === '省直辖县级行政区划') ? CodeToText[val[0]] : CodeToText[val[1]])
    }
    const submitForm = async () => {
      if (taiwan.includes(state.cityName.slice(7))) {
        // console.log(getCurrentInstance())
        internalInstance.appContext.app.config.globalProperties.$message({
          type: 'error',
          message: "暂不支持台湾地区的查询",
          duration: 1000
        })
        return
      }
      if (!state.menuList.includes(state.cityName))
        state.menuList.splice(0, 0, state.cityName)
      state.visible = false
      await nextTick()
      state.defaultActive = state.cityName
      router.push(state.cityName)
      sessionStorage.setItem('menuList', JSON.stringify(state.menuList))
    }
    onMounted(() => {
      // console.log(getCurrentInstance());
      if (sessionStorage.getItem('menuList') === null)
        state.menuList = []
      else
        state.menuList = JSON.parse(sessionStorage.getItem('menuList'))
      // console.log(state.menuList)
      state.defaultActive = '/'
      router.push('/')
    })
    const deleteMenu = (val) => {
      if (router.currentRoute.value.fullPath === state.menuList[val]) {
        router.push('/')
        state.defaultActive = '/'
      }
      state.menuList.splice(val, 1)
      sessionStorage.setItem('menuList', JSON.stringify(state.menuList))
    }
    return {
      ...toRefs(state),
      handleClose,
      addmenuList,
      handleChange,
      submitForm,
      deleteMenu,
      cascader
    }
  }
}
</script>

<style scoped>
.body {
  width: 200px !important;
}
.layout {
  min-height: 100vh;
  background-color: #fffcf5;
}
.container {
  height: 100vh;
}
.aside {
  width: 210px !important;
  background-color: #888;
  overflow-x: hidden;
}
.test-1::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.test-1::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.test-1::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.head {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head .logo {
  margin-right: 10px;
}
.head span {
  font-size: 20px;
}
.el-divider {
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #333;
}
.icon-tianjia {
  color: rgb(11, 179, 179);
  font-size: 20px;
}
.el-divider:hover {
  -webkit-animation: animation 1000ms linear both;
  animation: animation 1000ms linear both;
}
.el-menu-item i {
  margin-right: 10px;
}
</style>

<style>
:root {
  --el-color-primary: rgb(11, 179, 179);
}
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-divider__text {
  padding: 0 10px;
  background-color: #888;
}
.icon {
  width: 3em;
  height: 3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.menuInfo {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.menuInfo i {
  font-size: 10px;
}
.menuInfo i:hover {
  -webkit-animation: animation1 1000ms linear infinite both;
  animation: animation1 1000ms linear infinite both;
}
</style>