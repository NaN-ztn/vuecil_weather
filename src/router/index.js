import { createRouter, createWebHashHistory } from 'vue-router'
const Index = () => import(/* webpackChunkName:"Index_component" */ '../components/Index.vue')
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      props: route => ({ city: route.query.city })
    }
  ]
})
export default router