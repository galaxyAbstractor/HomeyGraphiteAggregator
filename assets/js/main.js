import Vue from 'vue';
import App from './components/app.vue';

window.Vue = Vue;

Vue.component('test', require('./components/test.vue'));

const app = new Vue({
	el: "#app",
	render: createEle => createEle(App)
});