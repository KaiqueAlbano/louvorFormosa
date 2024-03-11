import React, { useContext, useEffect, useRef, useState } from 'react';
import Input from '../../components/input/Input';
import InputDate from '../../components/inputDate/InputDate';
import './ListLouvorPage.scss';
import DropDownList from '../../components/dropDownList/DropDownList';
import SubList from './inc/SubList';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app, storage } from '../services/DataBaseServices';
import RodapeApp from './inc/RodapeApp';
import MessageServices from '../services/MessageServices';
import Loading from '../services/loading';
import { ToastContainer } from 'react-toastify';
import GlobalContext from '../../context/GlobalContext';

const ListLouvor = () => {
    //utill
    const [loading, setLoading] = useState(false);
    const [state] = useContext(GlobalContext);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [openPdf, setOpenPdf] = useState(false);
    const [orderData, setOrderData] = useState(true);
    const [orderID, setOrderID] = useState(true);
    const fileARef = useRef(null);
    const fileInputRef = useRef(null);

    //Conexão banco de firebase
    const db = getFirestore(app);
    const [useCollectionRef, setUseCollectionRef] = useState(collection(db, 'louvorTen'));
    const [listFireBase, setListFireBase] = useState([]);
    const [listFilterFireBase, setListFilterFireBase] = useState([]);
    const [tbl, setTbl] = useState('louvorTen');

    //Inputs
    const [inputDescricao, setInputDescricao] = useState('');
    const [inputDate, setInputDate] = useState('');
    const [inputTom, setInputTom] = useState('');
    const [inputSelect, setInputSelect] = useState('');
    const [listLouvor, setListLouvor] = useState([
        { value: 'Dez', label: 'Dez' },
        { value: 'Harpa', label: 'Harpa' },
        { value: 'Outros', label: 'Outros' },
        { value: 'Quarta', label: 'Quarta' },
    ]);

    const handleInputData = (e) => {
        const dataOriginal = new Date(e);
        // Obtenha o dia, mês e ano em UTC
        const dia = dataOriginal.getUTCDate().toString().padStart(2, '0');
        const mes = (dataOriginal.getUTCMonth() + 1).toString().padStart(2, '0'); // Adicione 1 ao mês, pois janeiro é 0.
        const ano = dataOriginal.getUTCFullYear();

        // Formate a data no formato "dd/MM/yyyy"
        const dataFormatada = `${dia}/${mes}/${ano}`;

        setInputDate(dataFormatada);

        setListFilterFireBase(
            listFireBase.filter((item) => item.Data?.toLowerCase().includes(dataFormatada.toLowerCase())),
        );
    };

    const handleInputDescricao = (value) => {
        setInputDescricao(value);

        setListFilterFireBase(
            listFireBase.filter((item) => item.Descricao?.toLowerCase().includes(value.toLowerCase())),
        );
    };

    const handleInputTom = (value) => {
        setInputTom(value);

        setListFilterFireBase(listFireBase.filter((item) => item.Tom?.toLowerCase().includes(value.toLowerCase())));
    };

    const handleInputSelect = (e) => {
        setInputSelect(e.value);
        setListFilterFireBase(listFireBase.filter((item) => item.Tipo?.toLowerCase().includes(e.value.toLowerCase())));
    };

    //Rodapé
    const [showModal, setShowModal] = useState(false);
    const [senhaDel, setSenhaDel] = useState('');

    const handleLimpar = () => {
        setInputDescricao('');
        setInputDate('');
        setInputTom('');
        setInputSelect('');
        setListLouvor('');
        setListFilterFireBase(
            listFireBase.sort((a, b) => handleParseData(b.Data).getTime() - handleParseData(a.Data).getTime()),
        );
    };

    const handleEditar = () => {
        if (!state.itemSelecionado?.id) {
            MessageServices.ShowError('Selecione um item para edição!');
            return;
        }
        setInputDescricao(state.itemSelecionado.Descricao);
        setInputDate(state.itemSelecionado.Data);
        setInputTom(state.itemSelecionado.Tom);
        setInputSelect(state.itemSelecionado.Tipo);
        setListLouvor('');
    };

    async function handleAddFireBase() {
        setLoading(true);

        if (!inputDescricao || !inputDate || !inputTom || !inputSelect) {
            MessageServices.ShowError('Valores não podem ser nulos.');
            setLoading(false);
            return;
        }

        const idLouvor = listFireBase.reduce((maxId, louvor) => {
            return Math.max(maxId, louvor.idLouvor);
        }, 0);

        let request = {
            idLouvor: idLouvor + 1,
            Descricao: inputDescricao,
            Data: inputDate,
            Tom: inputTom,
            Tipo: inputSelect,
        };

        await addDoc(useCollectionRef, { ...request });
        MessageServices.ShowSucess('Novo Registros Adicionado!');

        handleLimpar();
        getUsers();
        setLoading(false);
    }

    async function handleDeleteFireBase() {
        if (senhaDel?.senha === 'louvor321') {
            if (!state.itemSelecionado?.id) {
                MessageServices.ShowError('Selecione um item para exclusão!');
                setShowModal(false);
                return;
            }
            const userDocRef = doc(db, tbl, state.itemSelecionado?.id);
            await deleteDoc(userDocRef);
            MessageServices.ShowSucess('Registro deletado');
            setShowModal(false);
            getUsers();
        } else {
            MessageServices.ShowError('Senha Inválida!');
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleSenhaDelete = (e) => {
        setSenhaDel({ ...senhaDel, senha: e.target.value });
    };

    async function handleUpdateFireBase() {
        try {
            setLoading(true);
            const userDocRef = doc(db, tbl, state.itemSelecionado?.id);

            if (!inputDescricao || !inputDate || !inputTom || !inputSelect) {
                MessageServices.ShowError('Valores não podem ser nulos.');
                setLoading(false);
                return;
            }

            let request = {
                Descricao: inputDescricao,
                Data: inputDate,
                Tom: inputTom,
                Tipo: inputSelect,
            };

            await updateDoc(userDocRef, {
                ...request,
            });

            setLoading(false);
            handleLimpar();
            getUsers();

            MessageServices.ShowSucess('Registro Atualizado!');
        } catch (error) {
            setLoading(false);
            MessageServices.ShowError(`Error ${error}`);
        }
    }

    // List
    async function handleFileView(userPdf) {
        setLoading(true);

        const storageRef = await ref(storage, `pdfs/${userPdf.list.id}/${userPdf?.list?.pdf}`);

        try {
            const pdfUrl = await getDownloadURL(storageRef);
            setLoading(false);
            setPdfUrl(pdfUrl);
            setOpenPdf(true);
        } catch (error) {
            setLoading(false);
            MessageServices.ShowError('Não existe nenhum PDF, Por favor faço o upload...');
            console.log(error);
        }
    }

    async function handleFileChange(e) {
        setLoading(true);

        const file = e.target.files[0];

        if (file) {
            const storageRef = ref(storage, `pdfs/${state.itemSelecionado?.id}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // setProgress(progress);
                },
                (error) => {
                    setLoading(false);
                    MessageServices.ShowError(`Falha no upload! ${error}`);
                    return;
                },
                () => {
                    // getDownloadURL(uploadTask.snapshot.ref).the(url => {
                    //      setPdfUrl(url)
                    //  })
                },
            );

            const userDocRef = doc(db, tbl, state.itemSelecionado?.id);

            await updateDoc(userDocRef, {
                pdf: file.name,
            });
            setLoading(false);
            MessageServices.ShowSucess('Upload Feito com Sucesso!');
            getUsers();
        } else {
            setLoading(false);
            MessageServices.ShowError('Selecione um file existente!');
            return;
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Clique no input de arquivo oculto
    };

    function handleParseData(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    const handleOrderBy = () => {
        let order;
        setOrderData(!orderData);
        if (orderData) {
            order = listFilterFireBase.sort(
                (a, b) => handleParseData(a.Data).getTime() - handleParseData(b.Data).getTime(),
            );
        } else {
            order = listFilterFireBase.sort(
                (a, b) => handleParseData(b.Data).getTime() - handleParseData(a.Data).getTime(),
            );
        }
        setListFilterFireBase(order);
    };

    const handleOrderByID = () => {
        let order;
        setOrderID(!orderID);
        if (orderID) {
            order = listFilterFireBase.sort((a, b) => a.idLouvor - b.idLouvor);
        } else {
            order = listFilterFireBase.sort((a, b) => b.idLouvor - a.idLouvor);
        }

        setListFilterFireBase(order);
    };

    // Inicio
    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (listLouvor === '') {
            setListLouvor([
                { value: 'Dez', label: 'Dez' },
                { value: 'Harpa', label: 'Harpa' },
                { value: 'Outros', label: 'Outros' },
                { value: 'Quarta', label: 'Quarta' },
            ]);
        }
    }, [listLouvor]);

    const getUsers = async () => {
        setLoading(true);
        const data = await getDocs(useCollectionRef);
        setLoading(false);
        const orderList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setListFireBase(orderList.sort((a, b) => a.idLouvor - b.idLouvor));
        setListFilterFireBase(
            orderList.sort((a, b) => handleParseData(b.Data).getTime() - handleParseData(a.Data).getTime()),
        );
    };

    return (
        <>
            <div className="ListLouvor container">
                <div className="louvor-page-header">
                    {openPdf && (
                        <div className="visualizarPDF">
                            <i
                                className="bi bi-x-circle"
                                onClick={() => {
                                    setOpenPdf(false);
                                }}
                            >
                                {' Fechar PDF'}
                            </i>
                            <a ref={fileARef} href={pdfUrl} target="_blank">
                                Vizualizar/Baixar
                            </a>
                        </div>
                    )}
                </div>
                <div className="input row mb-lg-3 mt-lg-3">
                    <div className="row col-12 col-xl-3 mt-3 mt-xl-2 mb-2 justify-content-center">
                        <Input placeholder="Descricao" value={inputDescricao} onChange={handleInputDescricao} />
                    </div>
                    <div className="row col-12 col-xl-3 mt-2 mb-2 justify-content-center text-center me-xl-3">
                        <InputDate value={inputDate} onChange={handleInputData} />
                    </div>
                    <div className="row col-12 col-xl-3 mt-2 mb-2 ms-xl-1 justify-content-center">
                        <Input placeholder="Tom" value={inputTom} onChange={handleInputTom} />
                    </div>
                    <div className="row col-12 col-xl-3 mt-2 mb-3 mb-xl-2 justify-content-center">
                        {listLouvor.length > 0 && (
                            <DropDownList
                                list={listLouvor}
                                displayExpr={'label'}
                                valueExpr={'value'}
                                onChange={handleInputSelect}
                                value={inputSelect}
                            />
                        )}
                    </div>
                </div>
                <SubList
                    list={listFilterFireBase}
                    handleFileView={handleFileView}
                    handleButtonClick={handleButtonClick}
                    handleOrderBy={handleOrderBy}
                    handleOrderByID={handleOrderByID}
                />
                <div className="total">Total: {listFilterFireBase.length}</div>
            </div>
            <RodapeApp
                onClickLimpar={handleLimpar}
                onClickAdd={handleAddFireBase}
                onClickExcluir={handleShowModal}
                onClickEditar={handleEditar}
                onClickSalvar={handleUpdateFireBase}
            />
            {showModal === true && (
                <div className="senhaDelete">
                    <div>
                        Digite a Senha para deletar:
                        <input
                            className="input"
                            name="Tom"
                            type="password"
                            // maxLength={6}
                            onChange={handleSenhaDelete}
                        ></input>
                        <button
                            onClick={() => {
                                handleDeleteFireBase();
                            }}
                        >
                            Deletar
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(false);
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            {/* Loading */}
            {loading === true && <Loading type="spokes" />}
            <ToastContainer /> {/* Alerta de Mensagem */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </>
    );
};

export default ListLouvor;
