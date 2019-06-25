import axios from "axios";

axios.defaults.baseURL = 'http://appmedconsultor-hmg.rededor.com.br';

axios.interceptors.request.use((request) => {
	console.log('Starting Request', request)
	return request; 
},(error) => {
	console.log(error);
});

axios.interceptors.response.use((response) => {
	console.log('Response:', response);
	return response;
},(error) => {
	console.log(error);
});

export default axios;