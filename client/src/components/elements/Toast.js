import { toast } from 'react-toastify';
import { Color } from '../../Colors';
import { Key } from '../../utils/keys';

export const Toast = {
    show:(msg) => toast(msg, {
        position: "top-left",
        autoClose: Math.max(Math.min((msg.length*2/3),10),5)*1000,
        hideProgressBar: true,
        progress: undefined,
        style:{
            color:Color[Key.light].secondaryText,
            background:Color[Key.light].secondary,
            fontFamily:'Questrial'
        }
    }),
    persist:(msg) => toast(msg, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: true,
        progress: undefined,
        style:{
            color:Color[Key.light].secondaryText,
            background:Color[Key.light].secondary,
            fontFamily:'Questrial',
        }
    }),
    action:(msg,onclick)=>toast(msg, {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        onClick:onclick,
        progress: undefined,
        style:{
            color:Color[Key.light].secondaryText,
            background:Color[Key.light].secondary,
            fontFamily:'Questrial',
        }
    }),
    error:(msg)=>toast(msg,{
        position:"bottom-center",
        autoClose:Math.max(Math.min((msg.length*2/3),10),5)*1000,
        hideProgressBar:true,
        style:{
            color:Color[Key.light].negativeText,
            background:Color[Key.light].negative,
            fontFamily:'Questrial',
        }
    }),
    errorAction:(msg,onClick)=>toast(msg,{
        position:"bottom-center",
        autoClose:false,
        hideProgressBar:true,
        onClick,
        style:{
            color:Color[Key.light].negativeText,
            background:Color[Key.light].negative,
            fontFamily:'Questrial',
        }
    })
}