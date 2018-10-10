import Vue from 'vue';
import App from './index.vue';
import 'normalize.css/normalize.css';

const app = new Vue({
    render: h => h(App)
});

app.$mount('#app');
