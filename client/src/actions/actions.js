import axios from "axios";
import { constant } from "./validator";
import { Toast } from "../components/elements/Toast";
import { LOADING } from "./types";

export const postData = async (path, data = {}) => {
  if (!navigator.onLine) {
    Toast.error("Internet error");
    return null;
  } else
    return await axios.post(`${process.env.REACT_APP_PROXY_URL}${path}`, data);
};

export const refer = (href, queryData = {}) =>
  (window.location.href = href + arrangeAsGetQuery(queryData));

const arrangeAsGetQuery = (data = {}) => {
  if (!(data && Object.keys(data).length)) return constant.nothing;
  let i = 0;
  let body = constant.nothing;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      body =
        i > 0 ? `${body}&${key}=${data[key]}` : `${body}?${key}=${data[key]}`;
      i++;
    }
  }
  return body;
};

export const navigatorShare = (
  title,
  url,
  afterShared = (_) => {
    console.log("Thanks for sharing!");
  }
) => {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        url: url,
      })
      .then(() => {
        afterShared();
      })
      .catch(console.error);
  } else {
    Toast.show(
      "Sharing not available on your system. However, the url has been copied to your clipboard."
    );
    document.execCommand("copy", true, url);
  }
};

export const loading = () => ({
  type: LOADING,
});
