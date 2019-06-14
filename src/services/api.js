import axios from "axios";

if(__DEV__) {
	axios.defaults.baseURL = 'http://10.25.35.84:8080/medico-consultor'
} else {
	//axios.defaults.baseURL = 'https://appmedconsultor.rededor.com.br';
}

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