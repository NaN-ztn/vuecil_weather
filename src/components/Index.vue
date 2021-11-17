<template>
  <el-card class="introduce">
    <div class="order">
      <el-card v-loading="loading" class="order-item cityInfo">
        <template #header>
          <svg class="icon size" aria-hidden="true">
            <use v-bind:xlink:href="tianqi"></use>
          </svg>
          <div class="card-header">
            <span>{{ mapData.city }}</span
            ><br />
            <span class="info">(实时)</span>
          </div>
        </template>
        <div class="weather">
          {{ mapData.weather }}
        </div>
        <div class="temperature">
          {{ mapData.temperature }}<i class="iconfont icon-sheshidu"></i>
        </div>
        <div class="wind">
          风力：{{ mapData.windPower }}
          <el-divider direction="vertical"></el-divider>
          风向：{{ mapData.windDirection }}
          <el-divider direction="vertical"></el-divider>
          空气湿度：{{ mapData.humidity }}%
        </div>
      </el-card>
      <el-card class="order-item" v-loading="loading">
        <el-table :data="featureMapData" stripe style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column label="白天">
            <el-table-column label="温度" width="75">
              <template #default="scope">
                <span>{{ scope.row.dayTemp }}</span
                >℃
              </template>
            </el-table-column>
            <el-table-column prop="name" label="天气" width="70">
              <template #default="scope">
                <span>{{ scope.row.dayWeather }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="风向/风力" width="85">
              <template #default="scope">
                <span>{{ scope.row.dayWindDir }}</span>
                <span>{{ scope.row.dayWindPower }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="夜间">
            <el-table-column label="温度" width="75">
              <template #default="scope">
                <span>{{ scope.row.nightTemp }}</span
                >℃
              </template>
            </el-table-column>
            <el-table-column prop="name" label="天气" width="70">
              <template #default="scope">
                <span>{{ scope.row.nightWeather }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="风向/风力" width="85">
              <template #default="scope">
                <span>{{ scope.row.nightWindDir }}</span>
                <span>{{ scope.row.nightWindPower }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div id="echartcontaier"></div>
  </el-card>
</template>
<script>
import { computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
import * as echarts from 'echarts'
let myChart = null;
export default {
  name: 'Index',
  props: { city: String },
  setup(props) {
    const map = {
      '晴': 'qingtian',
      '少云': 'xiaoyu',
      '晴间多云': 'qingzhuanduoyun',
      '多云': 'duoyun',
      '阴': 'yintian',
      '有风': 'baitianyoufeng',
      '平静': 'wu',
      '微风': 'icon-test',
      '和风': 'icon-test',
      '清风': 'icon-test',
      '强风/劲风': 'fengli_qiangfeng',
      '疾风': 'icon-fengli_qiangfeng',
      '大风': 'icon-fengli_qiangfeng',
      '烈风': 'icon-fengli_qiangfeng',
      '风暴': 'fengbao',
      '狂爆风': 'fengbao',
      '飓风': 'fengbao',
      '热带风暴': 'fengbao',
      '霾': 'mai',
      '中度霾': 'mai',
      '重度霾': 'icon-mai',
      '严重霾': 'icon-mai',
      '阵雨': 'zhenyu',
      '雷阵雨': 'leizhenyu',
      '雷阵雨并伴有冰雹': 'leizhenyujibanyoubingbao',
      '小雨': 'xiaoyu',
      '中雨': 'zhongyu',
      '大雨': 'dayu',
      '暴雨': 'baoyu',
      '大暴雨': 'dabaoyu',
      '特大暴雨': 'tedabaoyu',
      '强阵雨': 'qiangzhenyu',
      '强雷阵雨': 'leizhenyu',
      '极端降雨': 'jiduanjiangyu',
      '毛毛雨/细雨': 'xiaoyu',
      '雨': 'xiaoyu',
      '小雨-中雨': 'zhongyu',
      '中雨-大雨': 'dayu',
      '大雨-暴雨': 'baoyu',
      '暴雨-大暴雨': 'dabaoyu',
      '大暴雨-特大暴雨': 'tedabaoyu',
      '雨雪天气': 'yujiaxue',
      '雨夹雪': 'yujiaxue',
      '阵雨夹雪': 'yujiaxue',
      '冻雨': 'dongyu',
      '雪': 'xiaoxue',
      '阵雪': 'zhenxue',
      '小雪': 'xiaoxue',
      '中雪': 'zhongxue',
      '大雪': 'daxue',
      '暴雪': 'baoxue',
      '小雪-中雪': 'zhongxue',
      '中雪-大雪': 'daxue',
      '大雪-暴雪': 'baoxue',
      '浮尘': 'fuchen',
      '扬沙': 'yangsha',
      '沙尘暴': 'shachenbao',
      '强沙尘暴': 'qiangshachenbao',
      '龙卷风': 'fengbao',
      '雾': 'wu',
      '浓雾': 'wu',
      '强浓雾': 'wu',
      '轻雾': 'wu',
      '大雾': 'wu',
      '特强浓雾': 'wu',
      '热': 'gaowen',
      '冷': 'diwen',
      '未知': 'tianqi-weizhitianqi'
    }
    const tianqi = computed(() => '#icon-' + map[state.mapData.weather])
    const state = reactive({
      localTime: "",
      mapData: [],
      featureMapData: [],
      seriesData: [],
      seriesData1: [],
      loading: true,
      menuList: []
    })
    onMounted(() => {
      // console.log(router.currentRoute.value.query.city)
      state.seriesData = []
      state.seriesData1 = []
      if (sessionStorage.getItem('menuList') === null)
        state.menuList = []
      else
        state.menuList = JSON.parse(sessionStorage.getItem('menuList'))
      if (props.city === 'local' || props.city === undefined) {
        initMap()
      }
      else { getCurrentCityData(props.city) }
      state.loading = false
    })
    onUpdated(() => {
      state.seriesData = []
      state.seriesData1 = []
      if (sessionStorage.getItem('menuList') === null)
        state.menuList = []
      else
        state.menuList = JSON.parse(sessionStorage.getItem('menuList'))
      if (props.city === 'local' || props.city === undefined) {
        initMap()
      }
      else { getCurrentCityData(props.city) }
      state.loading = false
    })
    onUnmounted(() => {
      myChart.dispose()
    })
    const initMap = () => {
      AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息 
            // console.log(result);
            getCurrentCityData(result.city);
          }
        })
      })
    }
    const getCurrentCityData = (cityName) => {
      AMap.plugin('AMap.Weather', function () {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive(cityName, function (err, data) {
          state.mapData = data;
          // console.log("1", err, data);
        });
        weather.getForecast(cityName, function (err, data) {
          state.featureMapData = data.forecasts;
          state.featureMapData.map((item) => {
            state.seriesData.push(item.dayTemp);
            state.seriesData1.push(item.nightTemp)
          })
          initEchart();
          // console.log("2", err, data, state.seriesData);
        });
      });
    }
    const initEchart = () => {
      myChart = echarts.getInstanceByDom(document.getElementById('echartcontaier'))
      if (myChart == null) { myChart = echarts.init(document.getElementById('echartcontaier')) }
      let option = null;
      option = {
        title: {
          show: true,
          text: '温度趋势'
        },
        xAxis: [
          {
            show: true,
            splitLine: { show: false },
            type: 'category',
            name: '日期',
            data: ['今天', '明天', '后天', '三天后'],
            axisLine: {
              show: true,
              lineStyle: {
                color: '#888'
              }
            },
            axisTick: { show: false },
          }
        ],
        yAxis: {
          show: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#888'
            }
          },
          axisTick: { show: false },
          splitLine: { show: true }
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          data: ['白天气温', '夜间气温']
        },
        series: [{
          name: '白天气温',
          data: state.seriesData,
          type: 'line'
        },
        {
          name: '夜间气温',
          data: state.seriesData1,
          type: 'line'
        }]
      };
      myChart.setOption(option, true);
    }
    return {
      ...toRefs(state),
      tianqi
    }
  }
}
</script>
<style scoped>
.size {
  width: 3em;
  height: 3em;
  position: absolute;
}
.introduce {
  min-width: 1227px;
}
.introduce .order {
  display: flex;
  margin-bottom: 50px;
}
.introduce .order .order-item {
  flex: 1;
  margin-right: 20px;
}
.introduce .order .order-item:last-child {
  margin-right: 0;
}
.card-header {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}
.weather {
  text-align: center;
  font-size: 20px;
}
.temperature {
  margin-top: 20px;
  text-align: center;
  font-size: 40px;
}
.temperature i {
  font-size: 25px;
}
.wind {
  margin-top: 20px;
  font-size: 20px;
  text-align: center;
}
.wind i {
  font-size: 20px;
}
#echartcontaier {
  min-height: 270px;
}
.info {
  font-size: 20px;
  font-weight: normal;
}
.cityInfo {
  position: relative;
}
</style>