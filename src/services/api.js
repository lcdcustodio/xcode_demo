import axios from "axios";

const api = axios.create({
  baseURL: 'http://appmedconsultor-hmg.rededor.com.br/medico-consultor',
});

/*axios.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
});
  
axios.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
});*/

export default api;
