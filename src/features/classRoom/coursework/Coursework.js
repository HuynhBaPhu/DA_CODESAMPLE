import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import Backdrop from '../.././../components/Backdrop';
import { faChevronRight, faCirclePlus, faMagnifyingGlass, faTableList, faFilter, faVideo } from '@fortawesome/free-solid-svg-icons';
import styles from "./CourseWork.module.css"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import DeKiemTraAPI from '../../../apis/deKiemTraAPI';
import { useStateIfMounted } from "use-state-if-mounted";


function Coursework(props) {

    const params = useParams();
    const navigate = useNavigate();
    const idPhong = params.roomId;
    const [draft, setDarft] = useState(false);
    const [open, setOpen] = useState(true);
    const [close, setClose] = useState(true);
    const [test,setTest] = useStateIfMounted({
        testDraft:[],
        testOpen:[],
        testClose:[]
    });
    const [mobileOpen, setMobileOpen] = useState();
    const isTeacher = JSON.parse(localStorage.getItem('isTeacher')); 
    const [openDialogPublic, setOpenDialogPublic] = React.useState(false);
    const [testSelect,setTestSelect] = useState({});

    const handleClickOpen = (test) => {
        setOpenDialogPublic(true);
        setTestSelect(test);
    };

    const handleClose = () => {
        setOpenDialogPublic(false);
    };

    const getListDeKiemTra = async ()=>{
        try {
            const response = await DeKiemTraAPI.getByIDPhonng(idPhong);
            const date = new Date();
            console.log(date)
            setTest({
                testDraft:response.data.filter(item => item.trangThai ===0),
                testOpen:response.data.filter(item => date < (new Date(item.ngayHetHan)) && item.trangThai ===1),
                testClose:response.data.filter(item => item.trangThai ===2)
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        getListDeKiemTra();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const [filter, setFilter] = useState({
    //     draft: false,
    //     open: false,
    //     close: false,
    //     code: false,
    //     mutiple_question: false,
    // });
    // const handleFilterChange = (event) => {
    //     console.log("Runn")
    //     // setFilter({
    //     //     // copy filter
    //     //     ...filter,
    //     //     // thay ?????i gi?? tr???
    //     //     [event.target.name]: event.target.checked,
    //     // })
    //     // console.log(`${event.target.name}: ${event.target.checked}`)

    // }

   

    const handleAccept = (id) => {
        const publicBaiKiemTra = async () => {
            console.log(id);
            try {
                const response = await DeKiemTraAPI.publicDeKiemTra(id);
                if(response.data)
                {
                    getListDeKiemTra();
                    setOpenDialogPublic(false);
                }
            } catch (error) {
                console.log(error)
            }
        }
        publicBaiKiemTra();
    }

    const handleExerciseClose = (id) => {
        console.log(id);
        if( isTeacher === true ){
            navigate(`/test-overview/${idPhong}/${id}`)
        }
        if(isTeacher === false){
            alert("B??i t???p ???? k???t th??c")
        }
    }

    return (
        <div className={props.type === 'B??i t???p' ? styles.courseWork : styles.none} >
            {/*Start Mobile  */}
            <div className={styles.mobile_btn} >
               
                <NavLink to={`/room/${idPhong.roomId}/create`} className={styles.btn_mobile} >
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <span>T???o b??i t???p</span>
                </NavLink>

                <div className={styles.btn_mobile} onClick={() => setMobileOpen("find")} >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span>T??m ki???m</span>
                </div>

                <div className={styles.btn_mobile} onClick={() => setMobileOpen("filter")} >
                    <FontAwesomeIcon icon={faFilter} />
                    <span>L???c</span>
                </div>
            </div>

            {mobileOpen === "find" && <div className={styles.frame}  >
                <Backdrop className={styles.backdrop} onClick={() => setMobileOpen('')}
                />
                <div className={styles.mobile_find_content} >
                    <input type="text" placeholder='Nh???p t??n b??i c???n t??m' />
                </div>
            </div>}

            {mobileOpen === "filter" && <div className={styles.frame} >
                <Backdrop onClick={() => setMobileOpen('')} open={true} />
                <div className={styles.mobile_filter_content} >

                    <FormControl component="fieldset" >
                        <FormLabel>L???c theo tr???ng th??i:</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox  name="draft" checked={draft}
                                    />
                                }
                                onClick={() => setDarft(!draft)}
                                label="Nh??p"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox name="open" checked={open} />
                                }
                                onClick={() => setOpen(!open)}
                                label="M???"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox name="close" checked={close} />
                                }
                                onClick={() => setClose(!close)}
                                label="????ng"
                            />
                        </FormGroup>
                    </FormControl>

                    <FormControl component="fieldset" >
                        <FormLabel>L???c theo lo???i:</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox name="code" />
                                }
                                label="Code"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox name="mutiple_question" />
                                }
                                label="Tr???c nghi???m"
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>}

            {/*End:  Mobile */}
            <div className={styles.courseWork_left_content}>
                {
                    isTeacher &&
                    (
                    <>
                        <div className={styles.courseWork_item} onClick={() => setDarft(!draft)}>
                        <div className={styles.courseWork_item_content}>
                            <p>Nh??p</p>
                            <FontAwesomeIcon className={draft ? styles.icon_active : styles.icon} icon={faChevronRight}/>
                            <span>{test.testDraft.length}</span>
                        </div>
                        </div>
                        {draft && <div className={styles.coursework_content} >
                            {
                                test.testDraft.map((test,index) => (
                                    <div className={styles.coursework_content_item} key={index}>
                                        <div className={styles.item_info}>
                                            <FontAwesomeIcon icon={faTableList} />
                                            <NavLink className={styles.item_name} to={isTeacher ? `/test-overview/${idPhong}/${test.iddeKiemTra}`:`/test/${test.iddeKiemTra}`} >{test.moTa}</NavLink>
                                            {/* <div className={styles.item_name} onClick={() => handleClickOpen(test)}>{test.moTa}</div> */}
                                        </div>
                                        <p className={styles.item_draft}>Nh??p</p>
                                    </div>
                                ))
                            }</div>
                        }
                    </>
                    )
                }
                <div className={styles.courseWork_item} onClick={() => setOpen(!open)} >
                    <div className={styles.courseWork_item_content}>
                        <p>M???</p>
                        <FontAwesomeIcon className={open ? styles.icon_active : styles.icon} icon={faChevronRight} />
                        <span>{test.testOpen.length}</span>
                    </div>
                </div>
                {open && <div className={styles.coursework_content} >
                    {
                        test.testOpen.map((test,index) => (
                            <div className={styles.coursework_content_item} key={index}>
                                <div className={styles.item_info}>
                                    <FontAwesomeIcon icon={faTableList} />
                                    <NavLink className={styles.item_name} to={isTeacher ? `/test-overview/${idPhong}/${test.iddeKiemTra}`:`/test/${test.iddeKiemTra}`} >{test.moTa}</NavLink>
                                    <p className={styles.item_time}>B???t ?????u l??c {test.ngayBatDau} k???t th??c l??c {test.ngayKetThuc}</p>
                                </div>
                                <p className={styles.item_open}>M???</p>
                            </div>
                        ))
                    }
                </div>}

                <div className={styles.courseWork_item} onClick={() => setClose(!close)}>
                    <div className={styles.courseWork_item_content}>
                        <p>K???t th??c</p>
                        <FontAwesomeIcon className={close ? styles.icon_active : styles.icon} icon={faChevronRight}  />
                        <span>{test.testClose.length}</span>
                    </div>
                </div>
                {close && <div className={styles.coursework_content} >
                    {
                        test.testClose.map((test,index) => (
                            <div className={styles.coursework_content_item_close} key={index}>
                                <div className={styles.item_info}>
                                    <FontAwesomeIcon icon={faTableList} />
                                    <p className={styles.item_name_close}  onClick={() => handleExerciseClose(test.iddeKiemTra)} >{test.moTa}</p>
                                    <p className={styles.item_time}>???? k???t th??c v??o l??c {test.ngayKetThuc}</p>
                                </div>
                                <p className={styles.item_close}>K???t th??c</p>
                            </div>
                        ))
                    }
                    
                </div>}
            </div>

            <div className={styles.courseWork_right_content}>
                
                {localStorage.getItem("isTeacher") === 'true' && 
                <NavLink to={`/create-test/${idPhong}`} className={styles.btn_}>
                    <FontAwesomeIcon icon={faCirclePlus} fontSize='22px' />
                    <p>T???o b??i t???p</p>
                </NavLink>}

                <NavLink to={`/Meeting`} className={styles.btn_}>
                    <FontAwesomeIcon icon={faVideo} fontSize="22px"/>
                    <p>H???c tr???c tuy???n</p>
                </NavLink>

                <div className={styles.btn_fillter}>
                    <p>Tr???ng th??i</p>

                    {isTeacher === true &&
                    <div className={styles.status}>
                        <input id='Draft' onClick={() => setDarft(!draft)} checked={draft} type="checkbox" value="Nh??p" />
                        <label id={styles.draft} htmlFor="Draft">Nh??p</label>
                    </div>}

                    <div className={styles.status}>
                        <input id='Open' type="checkbox" onClick={() => setOpen(!open)} checked={open} value="M???" />
                        <label id={styles.open} htmlFor="Open">M???</label>
                    </div>

                    <div className={styles.status} >
                        <input id='Close' type="checkbox" onClick={() => setClose(!close)} checked={close} value="K???t th??c" />
                        <label id={styles.close} htmlFor="Close">K???t th??c</label>
                    </div>
                </div>
            </div>
            <Dialog
                open={openDialogPublic}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"B???n c?? mu???n c??ng khai b??i ki???m tra n??y?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                   {testSelect.moTa}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>H???y</Button>
                <Button onClick={() => handleAccept(testSelect.iddeKiemTra)} autoFocus>
                    ?????ng ??
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Coursework;