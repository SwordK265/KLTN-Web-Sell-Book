import { createApp } from 'vue';

// Ant design
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Vue loading plugin
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

// Moment
import MomentPlugin from './plugins/moment.plugin';

// CSS Global
import './styles.css';

// Router
import router from './router';

// App
import App from './App.vue';

// Font awesome icon
import { iconPlugin } from './plugins/icon.plugin';

// Axios
import AxiosPlugin from './plugins/axios.plugin';

// Vuetify
import Vuetify from './plugins/vuetify.plugin';

// Store
import store from './store';

const app = createApp(App);

app.use(Antd);
app.use(LoadingPlugin);
app.use(MomentPlugin);
app.use(ToastPlugin, { position: 'top-right' });
app.use(store);
app.use(iconPlugin);
app.use(router);
app.use(AxiosPlugin);
app.use(Vuetify);

app.mount('#app');
