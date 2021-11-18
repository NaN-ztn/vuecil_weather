<template>
  <div class="layout">
    <div
      class="smallHead animated fadeInLeft"
      :class="{ active: headerScroll, defcolor: toggle }"
    >
      <ul class="menu-icon" @click="toggle = !toggle">
        <li :class="{ lione: toggle }"></li>
        <li :class="{ litwo: toggle }"></li>
        <li :class="{ lithree: toggle }"></li>
      </ul>
      <svg class="icon logo" aria-hidden="true">
        <use xlink:href="#icon-tianqi"></use>
      </svg>
      <div class="title">天气查询</div>
    </div>
    <el-aside
      class="smallaside animated fadeInLeft"
      v-show="ismobile && toggle"
    >
      <div class="body">
        <el-divider @click="addmenuList">
          <i class="iconfont icon-tianjia"></i>
        </el-divider>
        <el-menu
          background-color="#888"
          text-color="#fff"
          :router="true"
          :default-active="defaultActive"
        >
          <el-menu-item index="/" @click="handleClick">
            <i class="iconfont icon-dingwei"></i>所在地天气
          </el-menu-item>
          <el-menu-item
            v-for="(city, index) in menuList"
            :key="city"
            :index="city"
            @click="handleClick"
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
    <el-container class="container">
      <el-aside class="aside test-1" v-show="!ismobile">
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
      <el-main id="main">
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
      width="80%"
      @close="handleClose"
      center
    >
      <div class="diqu">地区:</div>
      <el-cascader
        ref="cascader"
        :placeholder="defaultCate"
        style="width: 100%"
        :options="options"
        @change="handleChange"
      ></el-cascader>

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
import { onMounted, reactive, toRefs, nextTick, ref, getCurrentInstance, onUnmounted } from 'vue'
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
      headerScroll: false,
      toggle: false,
      ismobile: document.body.clientWidth <= 768,
    })
    const handleClick = () => {
      state.toggle = !state.ismobile
    }
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
      if (state.cityName == '') {
        internalInstance.appContext.app.config.globalProperties.$message({
          type: 'error',
          message: "请选择一个地区",
          duration: 1000
        })
        return
      }
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
      state.toggle = !state.ismobile
      router.push(state.cityName)
      sessionStorage.setItem('menuList', JSON.stringify(state.menuList))
    }
    nextTick(() => {
      document.getElementById('main').addEventListener('scroll', () => {
        let scrollTop = document.getElementById('main').scrollTop
        scrollTop > 50 ? state.headerScroll = true : state.headerScroll = false
      })
    })
    onMounted(() => {
      // console.log(document.getElementById('main').scrollTop)
      // console.log(getCurrentInstance());
      window.addEventListener('resize', handleResize)
      if (sessionStorage.getItem('menuList') === null)
        state.menuList = []
      else
        state.menuList = JSON.parse(sessionStorage.getItem('menuList'))
      // console.log(state.menuList)
      state.defaultActive = '/'
      router.push('/')
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
    const handleResize = () => {
      // console.log(document.body.clientWidth)
      state.ismobile = document.body.clientWidth <= 768
      // console.log(state.ismobile)
    }
    const deleteMenu = (val) => {
      if (router.currentRoute.value.fullPath === state.menuList[val]) {
        router.push('/')
        state.toggle = !state.ismobile
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
      cascader,
      handleClick
    }
  }
}
</script>

<style lang="less" scoped>
.smallaside {
  width: 100% !important;
  height: 100%;
  z-index: 100;
  top: 45px;
  position: absolute;
  background-color: #888;
  .body {
    width: 100% !important;
    .el-divider {
      margin-top: 30px;
    }
  }
}
.smallHead {
  background: #fffcf5;
  height: 50px;
  width: 100%;
  display: none;
  position: fixed;
  z-index: 1000;
  transition: all 500ms;
  &.active {
    background: #888;
  }
}
.body {
  width: 200px !important;
}
.layout {
  background-color: #fffcf5;
  position: relative;
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
.defcolor {
  background-color: #888;
}
@media only screen and (max-width: 768px) {
  .el-menu-item {
    font-size: 4vw;
  }
  .smallHead {
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 5vw;
      text-align: center;
      line-height: 50px;
    }
    .logo {
      margin-right: 10px;
    }
  }
  .menu-icon {
    width: 18px;
    height: 50px;
    position: absolute;
    left: 5px;
    li {
      list-style: none;
      width: 18px;
      height: 1px;
      background-color: #000000;
      position: absolute;
      transition: all 500ms;
      transform-origin: left center;
    }
    li:nth-child(1) {
      top: 18px;
    }
    li:nth-child(2) {
      top: 24px;
    }
    li:nth-child(3) {
      top: 30px;
    }
    .lione {
      transform: rotateZ(40deg);
    }
    .litwo {
      opacity: 0;
    }
    .lithree {
      transform: rotateZ(-40deg);
    }
  }
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