import VueRouter from 'vue-router'

import List from '../App'
//import Product from '../components/lembrete'
//import Add from '../components/add'
//import Edit from '../components/edit'
//import Delete from '../components/delete'

const router = new VueRouter({
  routes: [
    {path: '/', component: List},
    //{path: '/lembrete/:lembrete_id/edit', component: Edit, name: 'edit'},
    //{path: '/lembrete/:lembrete_id/delete', component: Delete, name: 'delete'},
    //{path: '/lembrete/:lembrete_id', component: Product, name: 'lembrete'},
    //{path: '/add', component: Add}
  ]
}) 

export default router