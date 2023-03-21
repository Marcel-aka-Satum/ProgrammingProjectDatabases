import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUCCESS = (message, timeout = 3000) => {
    toast.success(message, {
        autoClose: timeout,
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
    });
}

const INFO = (message, timeout = 3000) => {
    toast.info(message, {
        autoClose: timeout,
    });
}

const WARNING = (message, timeout = 3000) => {
    toast.warning(message, {
        autoClose: timeout,
    });
}

export {SUCCESS, ERROR, UNKNOWN_ERROR, INFO, WARNING, ToastContainer};