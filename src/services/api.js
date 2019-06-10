import axios from "axios";

axios.defaults.baseURL = 'http://10.25.35.84:8080/medico-consultor';

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