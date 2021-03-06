import { toast } from 'react-toastify';
import { Color } from '../../Colors';
import { Key } from '../../keys';

export const Toast = {
    show:(msg) => toast(msg, {
        position: "top-left",
        autoClose: (msg.length*3/2)*1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style:{
            color:Color[Key.light].secondaryText,
            background:Color[Key.light].secondary,
            fontFamily:'Questrial',
        }
    }),
}