export const Icon = (name,attrs={classnames:String,size:Number, color:String})=>(<i className={`material-icons ${attrs.classnames}`} style={{fontSize:`${attrs.size}px`}}>{name}</i>);