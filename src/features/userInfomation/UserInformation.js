import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import styles from './styles/UserInformation.module.scss';
import TaiKhoanAPI from '../../apis/taiKhoanAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fireStorage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { faUser, faInfoCircle, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

function UserIformation(props) {

    const navigate = useNavigate();
    const [contentMenu, setContentMenu] = useState("basicInfo");
    const [edit, setEdit] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileRef = useRef();
    const [infoUser, setInfoUser] = useState({
        uIdTaiKhoan: "",
        hoTen: "",
        email: "",
        ngaySinh: "",
        gioiTinh: "",
        linkAvatar: "",
        tenHienThi: "",
        truong: "",

    });
    const [formError, setformError] = useState("");
    const uId = JSON.parse(localStorage.getItem('uId'));


    useEffect(() => {
        try {
            const data = async () => {

                const response = await TaiKhoanAPI.getOne(uId);
                let date_res = "";
                if (response.data.ngaySinh !== undefined) {
                    let curr = response.data.ngaySinh;
                    let split_curr = curr.split('T');
                    date_res = split_curr[0];
                }
                else {
                    date_res = response.data.ngaySinh;
                }
                setInfoUser(
                    infoUser => ({
                        ...infoUser,
                        email: response.data.email,
                        uIdTaiKhoan: response.data.uidTaiKhoan,
                        hoTen: response.data.hoTen,
                        ngaySinh: date_res,
                        gioiTinh: response.data.gioiTinh,
                        linkAvatar: window.atob(JSON.parse(localStorage.getItem('linkAvatar'))),
                        tenHienThi: response.data.tenHienThi,
                        truong: response.data.truong,
                    })
                );
            }
            data();
        } catch (error) {
            console.log("Fetch data false: ", error);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAvatarPreview = (e) => {

        const file = e.target.files[0];
        fileRef.current = file;
        setAvatarPreview(URL.createObjectURL(file));
    }

    const handleSave = async () => {

        if ((infoUser.hoTen === "") || (infoUser.tenHienThi === "") || (infoUser.linkAvatar === "") || (infoUser.email === "") || (infoUser.ngaySinh === "") || (infoUser.truong === "")) {
            alert("Vui l??ng nh???p ?????y ????? th??ng tin")
            return;
        }

        const errors = {};
        let countNumberInValueHoTen = 0;
        for (let i = 0; i < infoUser.hoTen.length; i++) {
            if (isNaN(parseInt(infoUser.hoTen.charAt(i))) === false) {
                countNumberInValueHoTen++;
            }
        }

        if (countNumberInValueHoTen > 0) {
            errors.hoTen = "H??? t??n kh??ng h???p l???";
        }

        if ((infoUser.gioiTinh !== "Nam") && (infoUser.gioiTinh !== "N???")) {
            errors.gioiTinh = "Gi???i t??nh kh??ng h???p l???";
        }

        if (isNaN(infoUser.truong) === false) {
            errors.truong = "T??n tr?????ng kh??ng h???p l???";
        }

        if (isNaN(infoUser.tenHienThi) === false) {
            errors.tenHienThi = "T??n hi???n th??? kh??ng h???p l???";
        }

        if (infoUser.email.includes('@') === false) {
            errors.email = "Email kh??ng h???p l???";
        }


        if (Object.keys(errors).length !== 0) {
            setformError(errors);
            return;
        }
        setformError("")

        if (avatarPreview !== "") {
            try {
                const storageRef = ref(fireStorage, `images/${fileRef.current.name}`);
                await uploadBytes(storageRef, fileRef.current).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((url) => {
                        saveToDataBase(uId, infoUser.hoTen, infoUser.tenHienThi, url.toString(), infoUser.email, infoUser.ngaySinh, infoUser.truong, infoUser.gioiTinh);
                    })
                })

            } catch (error) {
                console.log("Error: ", error);
            }
        }
        else {
            saveToDataBase(uId, infoUser.hoTen, infoUser.tenHienThi, infoUser.linkAvatar, infoUser.email, infoUser.ngaySinh, infoUser.truong, infoUser.gioiTinh);
        }

    }

    const saveToDataBase = async (uId, userName, displayName, linkAvatar, email, date, truong, gender) => {
        let info = { UidTaiKhoan: uId, HoTen: userName, TenHienThi: displayName, Email: email, NgaySinh: date, LinkAvatar: window.btoa(linkAvatar), Truong: truong, GioiTinh: gender };
        const response = await TaiKhoanAPI.updateInfo(info);

        if (response.data === true) {
            localStorage.setItem('linkAvatar', JSON.stringify(window.btoa(linkAvatar)));
            alert("L??u th??nh c??ng");
            setEdit(false);
        }
    }

    return (
        <div className={styles.container} >
            <div className={styles.head} >
                <div className={styles.user_Avatar} >
                    <Avatar
                        src={avatarPreview !== "" ? avatarPreview : infoUser.linkAvatar}
                        sx={{
                            cursor: "pointer",
                            width: "100px",
                            height: "100px",
                            border: "solid 0.1px rgb(190 169 169)",
                        }}
                    >

                    </Avatar>

                    <label htmlFor="icon-button-file"  >
                        <Input onChange={(e) => handleAvatarPreview(e)} accept="image/*" id="icon-button-file" type="file" />
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>


                </div>

                <div className={styles.display_Name} >
                    <p>{infoUser.tenHienThi}</p>
                    <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        onClick={() => navigate('/over')}
                    />
                </div>

            </div>

            <div className={styles.content} >
                <div className={styles.content_menu} >
                    <div className={contentMenu === 'basicInfo' ? styles.menuAcive : ''}
                        onClick={() => setContentMenu("basicInfo")} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <span>Th??ng tin c?? b???n</span>
                    </div>

                    <div className={contentMenu === 'account' ? styles.menuAcive : ''}
                        onClick={() => setContentMenu("account")}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>T??i kho???n</span>
                    </div>
                </div>

                <div className={styles.content_input} >
                    {contentMenu === "basicInfo" && <div>
                        <p>Th??ng tin c?? b???n</p>
                        <div>
                            <label>H??? v?? t??n</label>

                            <div>
                                <input type='text'
                                    className={edit === true ? styles.input_active : ""}
                                    value={infoUser.hoTen || ""}
                                    readOnly={edit === false ? true : false}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            hoTen: e.target.value
                                        }))
                                    }
                                    placeholder='H??? v?? t??n' />
                                {formError !== "" && <p>{formError.hoTen}</p>}
                            </div>
                        </div>

                        <div>
                            <label>Ng??y th??ng n??m sinh</label>
                            <div>
                                <input className={edit === true ? styles.input_active : ""} readOnly={edit === false ? true : false}
                                    value={infoUser.ngaySinh || ""}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            ngaySinh: e.target.value
                                        }))
                                    }
                                    type='date' placeholder='Ng??y th??ng n??m sinh' />
                            </div>
                        </div>

                        <div>
                            <label>Gi???i t??nh</label>

                            <div>
                                <input type='text'
                                    className={edit === true ? styles.input_active : ""}
                                    value={infoUser.gioiTinh || ""}
                                    readOnly={edit === false ? true : false}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            gioiTinh: e.target.value
                                        }))
                                    }
                                    placeholder='Gi???i t??nh' />
                                {formError !== "" && <p>{formError.gioiTinh}</p>}
                            </div>
                        </div>

                        <div>
                            <label>Tr?????ng</label>

                            <div>
                                <input type='text'
                                    className={edit === true ? styles.input_active : ""}
                                    value={infoUser.truong || ""}
                                    readOnly={edit === false ? true : false}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            truong: e.target.value
                                        }))
                                    }
                                    placeholder='Tr?????ng' />
                                {formError !== "" && <p>{formError.truong}</p>}
                            </div>
                        </div>

                    </div>}

                    {contentMenu === "account" && <div>
                        <p>Th??ng tin t??i kho???n</p>
                        <div>
                            <label>T??n hi???n th???</label>
                            <div>
                                <input type='text'
                                    className={edit === true ? styles.input_active : ""}
                                    value={infoUser.tenHienThi || ""}
                                    readOnly={edit === false ? true : false}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            tenHienThi: e.target.value
                                        }))
                                    }
                                    placeholder='T??n t??i kho???n' />
                                {formError !== "" && <p>{formError.tenHienThi}</p>}
                            </div>

                        </div>

                        <div>
                            <label>Email</label>
                            <div>
                                <input className={edit === true ? styles.input_active : ''}
                                    value={infoUser.email || ""}
                                    onChange={(e) =>
                                        setInfoUser(infoUser => ({
                                            ...infoUser,
                                            email: e.target.value
                                        }))
                                    }
                                    readOnly={edit === false ? true : false} type='email' placeholder='Email' />
                                {formError !== "" && <p>{formError.email}</p>}
                            </div>
                        </div>
                    </div>}

                    <div className={styles.button_edit} >

                        {edit === true ? <button
                            onClick={() => setEdit(false)}
                        >
                            H???y
                        </button> : <button
                            onClick={() => setEdit(true)}
                        >
                            Ch???nh s???a
                        </button>}

                        <button onClick={() => handleSave()}>
                            L??u
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserIformation;