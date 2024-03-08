import axios from 'axios';

const userRequest = axios.create({
	baseURL: 'http://localhost:5174',
	headers: { 'Content-Type': 'application/json' },
});

// 統一管理 API Call
export function postApiData(data) {
	return userRequest.post('/users', data);
}
export function getApiData(url) {
	return userRequest.get(url);
}
