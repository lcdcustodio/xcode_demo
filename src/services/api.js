import axios from "axios";

axios.defaults.baseURL = 'http://10.25.35.84:8080/medico-consultor';
 
axios.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
});
  
axios.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
});

export default axios;