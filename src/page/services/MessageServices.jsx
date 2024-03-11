import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowSucess = (msg) => {
    return toast.success(msg, {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};
const ShowError = (msg) => {
    return toast.error(msg, {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};

export default {
    ShowSucess(msg) {
        return ShowSucess(msg);
    },
    ShowError(msg) {
        return ShowError(msg);
    },

    // ShowWarning(msg) {
    //     toastr.warning(msg, 'Alerta');
    // },

    // ShowSuccess(msg) {
    //     toastr.success(msg);
    // }
};
