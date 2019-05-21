import axios from "axios";

axios.defaults.baseURL = 'https://appmedconsultor.rededor.com.br';

axios.defaults.mockService = "http://10.15.24.90:8081/data.json";

axios.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
});
  
axios.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
});

export default axios;