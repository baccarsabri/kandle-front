import baseAxios from "axios";

const axiosExternal = baseAxios.create({
    baseURL: "http://54.174.81.125",
});

export default axiosExternal;
