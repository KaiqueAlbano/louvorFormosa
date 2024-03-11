import React, { useContext, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import './ListPage.scss';
import GlobalContext from '../../context/GlobalContext';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from '../services/DataBaseServices';
import SubListPage from '../louvorPage/subListPage';

function ListPage() {
    const [input, setInput] = useState({ idLouvor: 0, Descricao: '', Data: '', Tom: '', pdf: '' });
    const [edit, setEdit] = useState(false);
    const [list, setList] = useState([]);
    const [listFilter, setListFilter] = useState([]);
    const [dataSelection, setDataSelection] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);
    const options = [
        { value: 'Dez', label: 'Dez' },
        { value: 'Harpa', label: 'Harpa' },
        { value: 'Outros', label: 'Outros' },
    ];
    const [state, dispatch] = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [controle, setControle] = useState(true);
    const [del, setDel] = useState({ id: 0, show: false, senha: '' });
    const [pdfUrl, setPdfUrl] = useState(null);
    const [openPdf, setOpenPdf] = useState(false);
    const [orderData, setOrderData] = useState(true);
    const fileARef = useRef(null);

    const db = getFirestore(app);
    const [useCollectionRef, setUseCollectionRef] = useState(collection(db, 'louvorTen'));
    const [tbl, setTbl] = useState('louvorTen');

    useEffect(() => {
        dispatch({
            type: 'SET_UTIL',
            payload: 'TESTE1',
        });

        if (controle === true) {
            const getUsers = async () => {
                setLoading(true);
                const data = await getDocs(useCollectionRef);
                setLoading(false);
                const orderList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setList(orderList.sort((a, b) => a.idLouvor - b.idLouvor));
                setListFilter(orderList.sort((a, b) => a.idLouvor - b.idLouvor));
                setControle(false);
            };

            getUsers();
        }
    }, [controle]);

    const handleLogin = (e) => {
        if (edit) {
            const { name, value } = e.target;
            setInput({
                ...input,
                [name]: value,
            });
            return;
        }

        const maiorIdLouvor = list.reduce((maxId, louvor) => {
            return Math.max(maxId, louvor.idLouvor);
        }, 0);
        const proximoId = isNaN(maiorIdLouvor) ? 1 : maiorIdLouvor + 1;

        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
            idLouvor: proximoId,
        });

        if (e.target.name === 'Tom') {
            setListFilter(list.filter((item) => item.Tom.toLowerCase().includes(e.target.value.toLowerCase())));
        } else {
            setListFilter(list.filter((item) => item.Descricao.toLowerCase().includes(e.target.value.toLowerCase())));
        }
    };
    const handleData = (e) => {
        const dataOriginal = new Date(e);

        const maiorIdLouvor = list.reduce((maxId, louvor) => {
            return Math.max(maxId, louvor.idLouvor);
        }, 0);

        const proximoId = maiorIdLouvor + 1;

        // Obtenha o dia, mês e ano em UTC
        const dia = dataOriginal.getUTCDate().toString().padStart(2, '0');
        const mes = (dataOriginal.getUTCMonth() + 1).toString().padStart(2, '0'); // Adicione 1 ao mês, pois janeiro é 0.
        const ano = dataOriginal.getUTCFullYear();

        // Formate a data no formato "dd/MM/yyyy"
        const dataFormatada = `${dia}/${mes}/${ano}`;

        setDataSelection(dataFormatada);

        if (edit) {
            setInput({
                ...input,
                Data: dataFormatada,
            });
            return;
        }

        setInput({
            ...input,
            Data: dataFormatada,
            idLouvor: proximoId,
        });

        setListFilter(list.filter((item) => item.Data?.toLowerCase().includes(dataFormatada.toLowerCase())));
    };
    const handleChange = (selectedOption) => {
        const maiorIdLouvor = list.reduce((maxId, louvor) => {
            return Math.max(maxId, louvor.idLouvor);
        }, 0);
        const proximoId = isNaN(maiorIdLouvor) ? 1 : maiorIdLouvor + 1;

        setSelectedOption(selectedOption);

        if (edit) {
            setInput({
                ...input,
                Tipo: selectedOption.value,
            });
            return;
        }

        setInput({
            ...input,
            Tipo: selectedOption.value,
            idLouvor: proximoId,
        });

        setListFilter(list.filter((item) => item.Tipo?.toLowerCase().includes(selectedOption?.value.toLowerCase())));
    };
    const handleOrderBy = () => {
        // Classificar a lista com base na data
        let order;
        setOrderData(!orderData);
        if (orderData) {
            order = listFilter.sort((a, b) => handleParseData(a.Data).getTime() - handleParseData(b.Data).getTime());
        } else {
            order = listFilter.sort((a, b) => handleParseData(b.Data).getTime() - handleParseData(a.Data).getTime());
        }
        setListFilter(order);
    };
    function handleParseData(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    }
    const handleLimpar = () => {
        setDataSelection('');
        setInput({
            idLouvor: 0,
            Descricao: '',
            Data: '',
            Tom: '',
        });
        setListFilter(list);
        setSelectedOption([]);
    };

    return (
        <div className="ListPage container-fluid">
            <div className="row justify-content-center mt-4">
                <input
                    className="input-listPage col-12 col-xl-3"
                    name="Descricao"
                    placeholder="Descricao"
                    value={input.Descricao}
                    onChange={handleLogin}
                />
                <div className="input-flex col-12 col-xl-3">
                    <DatePicker
                        className="input-listPage"
                        value={dataSelection}
                        startDate={Date()}
                        placeholderText="   Data"
                        onChange={handleData}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <input
                    className="input-listPage col-12 col-xl-3"
                    name="Tom"
                    type="text"
                    placeholder="Tom"
                    // maxLength={4}
                    onChange={handleLogin}
                    value={input.Tom}
                />
                <div className="input-flex col-12 col-xl-3">
                    <Select
                        className="input-select"
                        classNamePrefix="react-select"
                        onChange={handleChange}
                        options={options}
                        placeholder="Selecione"
                    />
                </div>
                <div className="col-12 mt-1 row">
                    <div className="col-12 row justify-content-center justify-content-xl-end">
                        <div className="btn-listPage d-flex flex-row justify-content-end pe-xl-5 justify-content-xxl-start ps-xxl-5">
                            <div className="btn-limpar" onClick={handleLimpar}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="16"
                                    viewBox="0 0 15 13"
                                    fill="none"
                                >
                                    <path
                                        d="M7.57032 1.45743L1.4948 7.38106C0.843755 8.01583 0.843755 9.04415 1.4948 9.67891L3.57813 11.7102C3.89063 12.0149 4.31511 12.185 4.75782 12.185H7.50001H7.7448H13.3333C13.7943 12.185 14.1667 11.8219 14.1667 11.3725C14.1667 10.9231 13.7943 10.56 13.3333 10.56H10.1016L13.5052 7.24395C14.1563 6.60919 14.1563 5.58087 13.5052 4.9461L9.92969 1.45743C9.27865 0.822662 8.22396 0.822662 7.57292 1.45743H7.57032ZM7.7448 10.5625H7.50001H4.75521L2.67188 8.53126L5.91928 5.36505L9.4974 8.85372L7.7448 10.5625Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mx-4">
                <div className="col-12 coluna row">
                    <li className="col-2">ID</li>
                    <li className="col-6">Descricao</li>
                    <li className="col-4 d-flex flex-row justify-content-end align-items-center">
                        <span className="me-1">Data</span>
                        <svg
                            className="coluna-orderby"
                            onClick={handleOrderBy}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="19"
                            viewBox="0 0 12 19"
                            fill="none"
                        >
                            <g clip-path="url(#clip0_3_220)">
                                <path
                                    d="M4.93781 16.9122C5.38703 17.3614 6.11656 17.3614 6.56578 16.9122L11.1658 12.3122C11.4964 11.9815 11.5934 11.4892 11.4138 11.058C11.2341 10.6267 10.8172 10.3464 10.35 10.3464H1.15C0.686408 10.3464 0.265939 10.6267 0.0862517 11.058C-0.0934358 11.4892 0.00718922 11.9815 0.33422 12.3122L4.93422 16.9122H4.93781ZM4.93781 1.4842L0.337814 6.0842C0.00718922 6.41483 -0.089842 6.90717 0.0898455 7.33842C0.269533 7.76967 0.686408 8.04998 1.1536 8.04998H10.35C10.8136 8.04998 11.2341 7.76967 11.4138 7.33842C11.5934 6.90717 11.4928 6.41483 11.1658 6.0842L6.56578 1.4842C6.11656 1.03498 5.38703 1.03498 4.93781 1.4842Z"
                                    fill="#8A8D8E"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_3_220">
                                    <rect width="11.5" height="18.4" fill="white" transform="matrix(1 0 0 -1 0 18.4)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </li>
                </div>
                <div className="sub-list-page row justify-content-center">
                    {listFilter.map((item, index) => (
                        <SubListPage
                            item={item}
                            db={db}
                            tbl={tbl}
                            setControle={setControle}
                            setDel={setDel}
                            setLoading={setLoading}
                            setPdfUrl={setPdfUrl}
                            fileARef={fileARef}
                            setSelectedOption={setSelectedOption}
                            setInput={setInput}
                            setDataSelection={setDataSelection}
                            setEdit={setEdit}
                            setOpenPdf={setOpenPdf}
                        />
                    ))}
                </div>
            </div>
            <div className="rodape w-100"></div>
        </div>
    );
}

export default ListPage;
