export const Image = (data={
    src:String,
    alt:String,
    width:Number,
    classes:String
}) => {
    return (<img src={data.src} alt={data.alt} width={data.width} className={data.classes}/>)
}