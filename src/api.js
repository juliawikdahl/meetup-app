import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 


const getToken = () => localStorage.getItem('token');


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});


axiosInstance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// API-funktioner
export const login = (credentials) => axiosInstance.post('/auth/login', credentials);
export const register = (userData) => axiosInstance.post('/auth/register', userData); 
export const getAllMeetups = () => axiosInstance.get('/meetups');
export const getMeetupById = (id) => axiosInstance.get(`/meetups/${id}`);
export const createMeetup = (meetup) => axiosInstance.post('/meetups', meetup);


export const attendMeetup = async (meetupId) => {
    const token = getToken();
    const userEmail = localStorage.getItem('email'); 
    console.log("Skickar e-post till API:", userEmail); 
    return axiosInstance.post(`/meetups/${meetupId}/attend`, { userEmail }, { 
        headers: {
            Authorization: `Bearer ${token}`, 
        },
    });
};


export const cancelAttendance = async (meetupId) => {
    const token = getToken(); 
    const userEmail = localStorage.getItem('email'); 

    return axiosInstance.delete(`/meetups/${meetupId}/attend`, {
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        data: {
            userEmail, 
        },
    });
};


export const searchMeetups = (query) => axiosInstance.get('/meetups/search', { params: { query } });

export const getUserMeetups = () => axiosInstance.get('/meetups/my-meetups');
export const getPastUserMeetups = () => axiosInstance.get('/meetups/my-meetups/past');
