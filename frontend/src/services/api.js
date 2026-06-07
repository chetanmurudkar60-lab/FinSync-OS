import axios from "axios";

const API = axios.create({
  baseURL: "https://finsync-os-backend.onrender.com/api",
  timeout: 30000,
});

export default API;