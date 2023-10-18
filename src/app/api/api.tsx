import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.NEXT_URL
})

export const setAuthToken = (token: string) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
};