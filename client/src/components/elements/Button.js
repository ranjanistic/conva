export const Button = {
    flat:(content,onclick=_=>{},classnames)=>(<button className={`btn-flat waves-effect ${classnames}`} onClick={onclick}>{content}</button>)
}