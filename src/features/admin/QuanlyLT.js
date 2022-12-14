import React, { useEffect, useState } from 'react'
import MonHocAPI from '../../apis/monHocAPI'
import styles from "./QuanlyLT.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft, faPen, faAdd, faEye } from '@fortawesome/free-solid-svg-icons';
import Backdrop from '../../components/Backdrop';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import classNames from 'classnames/bind';
import { fireStorage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import LyThuyetAPI from '../../apis/lyThuyetAPI';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const cx = classNames.bind(styles);

function QuanlyLT() {
    const navigate = useNavigate();
    const [resetMH, setResetMH] = useState(false);
    const [openAddMH, setOpenAddMH] = useState(false);
    const [openEditMH, setOpenEditMH] = useState(false);
    const [openDeleteMH, setOpenDeleteMH] = useState(false);
    const [openEditLT, setOpenEditLT] = useState(false);
    const [openDeleteLT, setOpenDeleteLT] = useState(false);
    const [monHoc, setMonHoc] = useState([]);
    const [lyThuyet, setLyThuyet] = useState([]);
    const [monHoc_Custom, setMonHoc_Custom] = useState({
        id: 0,
        ten: "",
        moTa: "",
        hinh: "",
    });
    const [lyThuyet_Custom, setLyThuyet_Custom] = useState({
        id: 0,
        tieuDe: "",
        noiDung: "",
        idMonHoc: 0,
    })

    useEffect(() => {
        const data = async () => {
            try {
                const response = await MonHocAPI.getAllMH();
                setMonHoc(response.data);
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }, [resetMH])

    const handleAdd = () => {
        const data = async () => {
            try {
                if (monHoc_Custom.ten === "" || monHoc_Custom.moTa === "") {
                    alert("Vui l??ng nh???p ?????y ????? th??ng tin");
                }
                else {
                    if (monHoc_Custom.hinh !== '') {

                        const storageRef = ref(fireStorage, `images/${monHoc_Custom.hinh.name}`);
                        await uploadBytes(storageRef, monHoc_Custom.hinh).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((url) => {
                                saveDB(window.btoa(url),"add");
                            })
                        })
                    }

                    const add = async () => {
                        const response = await MonHocAPI.AddMonHoc(monHoc_Custom);
                        if (response.data) {
                            alert("Th??m m???i th??nh c??ng");
                            setOpenAddMH(false);
                            setMonHoc_Custom({ id: 0, ten: "", moTa: "", hinh: "" });
                            setResetMH(!resetMH);
                        }
                    }
                    add()
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    const handleEdit = () => {
        const data = async () => {
            try {
                console.log("Runn");
                if (monHoc_Custom.ten === "" || monHoc_Custom.moTa === "") {
                    alert("Vui l??ng nh???p ?????y ????? th??ng tin");
                }

                else {
                    if (monHoc_Custom.hinh !== '') {
                        const storageRef = ref(fireStorage, `images/${monHoc_Custom.hinh.name}`);
                        await uploadBytes(storageRef, monHoc_Custom.hinh).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((url) => {
                                saveDB(window.btoa(url), "update");
                            })
                        })
                    }
                    else{
                        const edit = async () => {
                            const response = await MonHocAPI.EditMonHoc(monHoc_Custom);
                            if (response.data) {
                                setMonHoc_Custom({ id: 0, ten: "", moTa: "", hinh: "" });
                                alert("S???a th??ng tin m??n h???c th??nh c??ng");
                                setOpenEditMH(false);
                                setResetMH(!resetMH);
                            }
                        }
                        edit();
                    }
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    const saveDB = async (img, type) => {
        
        const ob = {
            id: monHoc_Custom.id,
            ten: monHoc_Custom.ten,
            moTa: monHoc_Custom.moTa,
            hinh: img,
        }

        console.log(ob);

        const response = type === "add" ? await MonHocAPI.AddMonHoc(ob) : await MonHocAPI.EditMonHoc(ob);
        console.log(response.data);
        if (response.data) {
            if(type === "add"){
                alert("Th??m m???i th??nh c??ng");
                setOpenAddMH(false);
            }
            if(type === "update"){
                alert("S???a th??nh c??ng");
                setOpenEditMH(false);
            }
            setMonHoc_Custom({ id: 0, ten: "", moTa: "", hinh: "" });
            setResetMH(!resetMH);
        }
    }

    // const img = document.getElementById("upload").files[0].name;
    // console.log(img);
    // setHinh(img);
    // console.log(hinh)
    const handleEditMonHoc = (Id, tenMonHoc, moTa, hinhAnh) => {
        setMonHoc_Custom({
            id: Id,
            ten: tenMonHoc,
            moTa: moTa,
            hinh: hinhAnh,
        })
        setOpenEditMH(true);
    }

    
    const handOpenleDelete = (Id, tenMonHoc) => {
        setMonHoc_Custom({
            ...monHoc_Custom,
            id: Id,
            ten: tenMonHoc,
        })
        setOpenDeleteMH(true);
    }

    const handleDeleteMH = () => {
        const data = async () => {
            try {
                const response = await MonHocAPI.DeleteMonHoc(monHoc_Custom.id);
                if (response.data) {
                    setMonHoc_Custom({ id: 0, ten: "", moTa: "", hinh: "" });
                    setResetMH(!resetMH);
                    setOpenDeleteMH(false);
                }
                else {
                    alert("M??n h???c ??ang t???n t???i b??i h???c kh??ng th??? x??a");
                    setOpenDeleteMH(false);
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    const handGetAllById = (id) => {
        const data = async () => {
            try {
                const response = await LyThuyetAPI.getAll(id);
                if (response.data) {
                    setLyThuyet(response.data.lyThuyets);
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    const handleOpenEditLT = (Id, TieuDe, NoiDung) => {
        setLyThuyet_Custom({
            ...lyThuyet_Custom,
            id: Id,
            tieuDe: TieuDe,
            noiDung: NoiDung,
        })
        setOpenEditLT(true);
    }

    const handleEditLT = () => {
        const data = async () => {
            try {
                if (lyThuyet_Custom.tieuDe === "" || lyThuyet_Custom.noiDung === "") {
                    alert("Vui l??ng nh???p ?????y ????? th??ng tin");
                }
                else {
                    const response = await LyThuyetAPI.EditLT(lyThuyet_Custom);
                    if (response.data) {
                        setLyThuyet_Custom({ id: 0, tieuDe: "", noiDung: "", idMonHoc: 0 });
                        alert("S???a th??ng tin th??nh c??ng");
                        setOpenEditLT(false);
                        setLyThuyet([]);
                    }
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    const handleOpenDeleteLT = (Id, TieuDe) => {
        setLyThuyet_Custom({
            ...lyThuyet_Custom,
            id: Id,
            tieuDe: TieuDe,
        })
        setOpenDeleteLT(true);
    }

    const handleDeleteLT = () => {
        const data = async () => {
            try {
                const response = await LyThuyetAPI.DeleteLT(lyThuyet_Custom.id);
                if (response.data) {
                    alert("X??a b??i h???c th??nh c??ng");
                    setLyThuyet_Custom({ id: 0, tieuDe: "", noiDung: "", idMonHoc: 0 });
                    setOpenDeleteLT(false);
                    setLyThuyet([]);
                }
            } catch (error) {
                console.log("Error...", error);
            }
        }
        data();
    }

    console.log(monHoc_Custom);

    return (
        <div>
            <div>
                <table className={styles.custom_table}>
                    <thead>
                        <tr>
                            <th>
                                STT
                            </th>
                            <th>
                                ID b??i
                            </th>
                            <th>
                                Ti??u ????? b??i
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    {lyThuyet.map((item, index) => {
                        return (
                            <tbody key={item.id} >
                                <tr>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {item.id}
                                    </td>
                                    <td>
                                        {item.tieuDe}
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenEditLT(item.id, item.tieuDe, item.noiDung)}>
                                            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon> S???a
                                        </button>
                                        <span> | </span>
                                        <button onClick={() => handleOpenDeleteLT(item.id, item.tieuDe)}>
                                            <FontAwesomeIcon icon={faDeleteLeft}></FontAwesomeIcon> X??a
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            </div>
            <table className={styles.custom_table}>
                <thead>
                    <tr>
                        <th>
                            STT
                        </th>
                        <th>
                            ID m??n h???c
                        </th>
                        <th>
                            T??n m??n h???c
                        </th>
                        <th>
                            M?? t???
                        </th>
                        <th></th>
                    </tr>
                </thead>
                {monHoc.map((item, index) => {
                    return (
                        <tbody key={item.id} >
                            <tr>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    {item.id}
                                </td>
                                <td>
                                    {item.tenMonHoc}
                                </td>
                                <td>
                                    {item.moTa}
                                </td>
                                <td>
                                    <button onClick={() => handleEditMonHoc(item.id, item.tenMonHoc, item.moTa, item.hinhAnh)}>
                                        <FontAwesomeIcon icon={faPen}></FontAwesomeIcon> S???a
                                    </button>
                                    <span> | </span>
                                    <button onClick={() => handOpenleDelete(item.id, item.tenMonHoc)}>
                                        <FontAwesomeIcon icon={faDeleteLeft}></FontAwesomeIcon> X??a
                                    </button>
                                    <span> | </span>
                                    <button onClick={() => handGetAllById(item.id)}>
                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> Xem b??i
                                    </button>
                                    <span> | </span>
                                    <button onClick={() => navigate(`/QuanLyLT/createLyThuyet/${item.id}/${item.tenMonHoc}`)}>
                                        <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon> Th??m b??i
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    );
                })}
            </table>
            <div>
                <button className={styles.btnAdd} onClick={() => setOpenAddMH(true)}>
                    <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon> Th??m m???i m??n h???c
                </button>
                {/* m??n h??nh th??m m??n h???c */}
                {openAddMH && <Backdrop onClick={() => setOpenAddMH(false)} />}
                {openAddMH && <div className={cx('content')}>
                    <p style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>TH??M M???I M??N H???C</p>
                    <TextField sx={{ marginTop: "20px" }} fullWidth label="T??n m??n h???c" id="fullWidth" value={monHoc_Custom.ten} multiline onChange={e => setMonHoc_Custom({ ...monHoc_Custom, ten: e.target.value })} />
                    <TextField sx={{ marginTop: "30px" }} fullWidth label="M?? t???" id="fullWidth" value={monHoc_Custom.moTa} multiline onChange={e => setMonHoc_Custom({ ...monHoc_Custom, moTa: e.target.value })} />
                    <div className={cx('input-file')}>
                        <p>H??nh ???nh cho m??n h???c</p>
                        <input className={styles.upfile} id="upload" type="file" name='img' accept="image/*"
                            // value={monHoc_Custom.hinh}
                            onChange={(event) => { setMonHoc_Custom({ ...monHoc_Custom, hinh: event.target.files[0] }) }}
                        />
                    </div>

                    <Button variant="contained" style={{ backgroundColor: "darkgray" }}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenAddMH(false)}
                    >
                        Hu??y
                    </Button>
                    <Button variant="contained" style={{ marginLeft: "20px" }}
                        endIcon={<SaveIcon />}
                        onClick={() => handleAdd()}
                    >
                        L??u
                    </Button>
                </div>}
                {/* m??n h??nh s???a m??n h???c */}
                {openEditMH && <Backdrop onClick={() => setOpenEditMH(false)} />}
                {openEditMH && <div className={cx('content')}>
                    <p style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>S???A TH??NG TIN M??N H???C ({monHoc_Custom.id})</p>
                    <TextField sx={{ marginTop: "20px" }} fullWidth label="T??n m??n h???c" id="fullWidth" value={monHoc_Custom.ten} multiline onChange={e => setMonHoc_Custom({ ...monHoc_Custom, ten: e.target.value })} />
                    <TextField sx={{ marginTop: "30px" }} fullWidth label="M?? t???" id="fullWidth" value={monHoc_Custom.moTa} multiline onChange={e => setMonHoc_Custom({ ...monHoc_Custom, moTa: e.target.value })} />
                    <div className={cx('input-file')}>
                        <p>H??nh ???nh cho m??n h???c</p>
                        <input className={styles.upfile} id="upload" type="file" name='img' accept="image/*"
                            // value={monHoc_Custom.hinh}
                            onChange={(event) => { setMonHoc_Custom({ ...monHoc_Custom, hinh: event.target.files[0] }) }}
                        // onClick={(event)=> {setMonHoc_Custom({...monHoc_Custom, hinh: event.target.value = null})}}
                        />
                    </div>

                    <Button variant="contained" style={{ backgroundColor: "darkgray" }}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenEditMH(false)}
                    >
                        Hu??y
                    </Button>
                    <Button variant="contained" style={{ marginLeft: "20px" }}
                        endIcon={<SaveIcon />}
                        onClick={() => handleEdit()}
                    >
                        L??u
                    </Button>
                </div>}
                {/* m??n h??nh x??c nh???n x??a m??n h???c*/}
                {openDeleteMH && <Backdrop onClick={() => setOpenDeleteMH(false)} />}
                {openDeleteMH && <div className={cx('content')}>
                    <p style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>B???n c?? mu???n x??a m??n h???c
                        <span style={{ color: "red" }}> {monHoc_Custom.ten} ID: {monHoc_Custom.id}</span>
                    </p>
                    <Button variant="contained" style={{ backgroundColor: "darkgray" }}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenDeleteMH(false)}
                    >
                        Hu??y
                    </Button>
                    <Button variant="contained" style={{ marginLeft: "20px" }}
                        endIcon={<DeleteIcon />}
                        onClick={handleDeleteMH}
                    >
                        X??a
                    </Button>
                </div>}
                {/* m??n h??nh s???a th??ng tin b??i h???c */}
                {openEditLT && <Backdrop onClick={() => setOpenEditLT(false)} />}
                {openEditLT && <div className={cx('contentLT')}>
                    <p style={{ fontSize: "20px", fontWeight: "bold", margin: "auto" }}>S???a th??ng tin b??i h???c {lyThuyet_Custom.tieuDe}</p>
                    <TextField sx={{ marginTop: "50px" }} fullWidth label="Ti??u ?????" id="fullWidth" value={lyThuyet_Custom.tieuDe} onChange={e => setLyThuyet_Custom({ ...lyThuyet_Custom, tieuDe: e.target.value })} />
                    <div className={cx('noiDung')}>
                        <p>N???i dung</p>
                        <CKEditor
                            editor={ClassicEditor}
                            height="200px"
                            data={lyThuyet_Custom.noiDung}
                            onReady={(editor) => {
                                editor.editing.view.change((writer) => {
                                    writer.setStyle(
                                        "height",
                                        "200px",
                                        editor.editing.view.document.getRoot()
                                    );
                                });
                            }}
                            value={lyThuyet_Custom.noiDung}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setLyThuyet_Custom({ ...lyThuyet_Custom, noiDung: data });
                            }}

                        />
                    </div>
                    <Button variant="contained" style={{ backgroundColor: "darkgray" }}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenEditLT(false)}
                    >
                        Hu??y
                    </Button>
                    <Button variant="contained" style={{ marginLeft: "20px" }}
                        endIcon={<SaveIcon />}
                        onClick={handleEditLT}
                    >
                        L??u
                    </Button>
                </div>}
                {/* m??n h??nh x??c nh???n x??a b??i h???c*/}
                {openDeleteLT && <Backdrop onClick={() => setOpenDeleteLT(false)} />}
                {openDeleteLT && <div className={cx('content')}>
                    <p style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>B???n c?? mu???n x??a b??i h???c
                        <span style={{ color: "red" }}> {lyThuyet_Custom.tieuDe} ID: {lyThuyet_Custom.id}</span>
                    </p>
                    <Button variant="contained" style={{ backgroundColor: "darkgray" }}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenDeleteLT(false)}
                    >
                        Hu??y
                    </Button>
                    <Button variant="contained" style={{ marginLeft: "20px" }}
                        endIcon={<DeleteIcon />}
                        onClick={handleDeleteLT}
                    >
                        X??a
                    </Button>
                </div>}
            </div>
        </div>
    )
}

export default QuanlyLT