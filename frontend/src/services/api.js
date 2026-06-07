import axios from "axios";

const API = axios.create({
  baseURL: "http://10.127.218.116:5000/api",
});

export default API;