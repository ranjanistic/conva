export const Button = {
    flat:(content,onclick=_=>{},classnames)=>(<button className={`btn-flat waves-effect ${classnames}`} onClick={onclick}>{content}</button>),
    circle:(content,onclick=_=>{},attr={classnames:String,title:String})=>(<button className={`btn-floating waves-effect ${attr.classnames}`} style={{minWidth:"fit-content"}} title={attr.title} onClick={onclick}>{content}</button>)
}
