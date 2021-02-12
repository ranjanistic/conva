import { Key } from "../keys";
import { get } from "../paths/get";
import { Link } from "react-router-dom";

export const setCurrentTheme = () => {
  localStorage.getItem(Key.theme)
    ? document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem(Key.theme)
      )
    : localStorage.setItem(Key.theme, Key.light);
  if(Key.theme===Key.dark){
    document.getElementById("themeswitch").click();
  }
};

export const switchTheme = () => {
  ((theme = Key.light) => {
    localStorage.setItem(Key.theme, theme);
    document.getElementById("themecolor").setAttribute("content", "#000000");
    document.documentElement.setAttribute("data-theme", theme);
  })(localStorage.getItem(Key.theme) === Key.light ? Key.dark : Key.light);
};

export const navBar = () => {
  return (
    <div className="w3-top w3-padding" id="navbar">
      <Link to={get.ROOT}>
        <span className="btn-flat waves-effect">
          <i className="material-icons left">keyboard_backspace</i> Back
        </span>
      </Link>
      <label>
        <input type="checkbox" onClick={switchTheme} id="themeswitch"/>
        <div className="switch">
          <div></div>
          <div></div>
          <span></span>
        </div>
      </label>
    </div>
  );
};
