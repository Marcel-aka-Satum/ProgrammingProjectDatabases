import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUCCESS = (message, timeout = 3000) => {
    toast.success(message, {
        autoClose: timeout,
        position: "bottom-right",
    });
}

const ERROR = (message, timeout = 3000, background='red', color='black') => {
    toast.error(message, {
        autoClose: timeout,
        progressStyle: {
            background: background
        },
        bodyStyle: {
            color: color
        },
        position: "bottom-right",
    });
}

const UNKNOWN_ERROR = (message, timeout = 3000, background='red', color='black') => {
    toast.error(`[Unknown Error occured]\n${message}`, {
        autoClose: timeout,
        progressStyle: {
            background: 'red'
        },
        bodyStyle: {
            color: 'black'
        },
        position: "bottom-right",
    });
}

const INFO = (message, timeout = 3000) => {
    toast.info(message, {
        autoClose: timeout,
        position: "bottom-right",
    });
}

const WARNING = (message, timeout = 3000) => {
    toast.warning(message, {
        autoClose: timeout,
        position: "bottom-right",
    });
}

export {SUCCESS, ERROR, UNKNOWN_ERROR, INFO, WARNING, ToastContainer};