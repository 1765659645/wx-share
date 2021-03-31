import storage from '@/utils/storage';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:7001/'; //根据项目自己更改
//一些配置，发起请求和响应可以打印出来查看
axios.interceptors.request.use((config) => {
  //如果项目中有将token绑定在请求数据的头部，服务器可以有选择的返回数据，只对有效的请求返回数据，这样写
  //这里是用户登录的时候，将token写入了sessionStorage中了，之后进行其他的接口操作时，进行身份验证。
  config.headers.Authorization = `Bearer ${storage.get('token')}`;
  return config;
});
//在response中
axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log('error', error.response);
    if (error && error.response) return error.response;
  },
);

const http = {
  post: '',
  get: '',
  put: '',
  del: '',
};

http.post = function (api, data) {
  //let params = qs.stringify(data);
  return new Promise((resolve, reject) => {
    axios.post(api, data).then((response) => {
      resolve(response);
    });
  });
};

http.get = function (api, data) {
  //let params = qs.stringify(data);
  return new Promise((resolve, reject) => {
    axios.get(api, data).then((response) => {
      resolve(response);
    });
  });
};

http.delete = function (api, data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    axios.delete(api, data).then((response) => {
      resolve(response);
    });
  });
};

http.put = function (api, data) {
  return new Promise((resolve, reject) => {
    axios.put(api, data).then((response) => {
      resolve(response);
    });
  });
};

export default http;
