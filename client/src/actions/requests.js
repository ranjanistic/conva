import axios from 'axios';
import {constant} from "./validator"

export const postData =async(path,data={})=>{
    return await axios.post(`${process.env.REACT_APP_PROXY_URL}${path}`, data)
}

export const refer =(href,queryData = {})=> window.location.href = href + arrangeAsGetQuery(queryData);

const arrangeAsGetQuery = (data = {}) => {
    if (!(data&&Object.keys(data).length)) return constant.nothing;
    let i = 0;
    let body = constant.nothing;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        body = i > 0 ? `${body}&${key}=${data[key]}` : `${body}?${key}=${data[key]}`;
        i++;
      }
    }
    return body;
};