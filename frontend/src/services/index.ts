import axios from "axios";

const API_URL = 'http://localhost:5000'

export const BackendAuthenticatedService = axios.create({
    baseURL: API_URL
})