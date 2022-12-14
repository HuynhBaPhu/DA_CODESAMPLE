import React, { useState} from 'react';
import styles from './CreateTest.module.css';
import classNames from 'classnames/bind'
import { Button } from '@mui/material';
import 'antd/dist/antd.css';
import { DatePicker, } from 'antd';
import moment from 'moment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import createTestSlice from '../../../redux/createTestSlice';
import ItemQuestion from './ItemQuestion';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import DeKiemTraAPI from '../../../apis/deKiemTraAPI';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BaiTapCodeFile from '../../../files/BaiTapCode.xlsx';
import BTTracnghiem from '../../../files/CauHoiTracNghiem.xlsx';
import importDataSlice from '../../../redux/importDataSlice';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import BaiTapCodeAPI from "../../../apis/baiTapCodeAPI";
import BaiTapTN from "../../../apis/baiTapTN_API";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from "@mui/material/Backdrop";


const Input = styled('input')({
    display: 'none',
});

const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);


function getType(params) {
    return params.row.loaiBai === 0 ? "Tr???c nghi???m" :"Code";
}

const colums = [
    { field: 'idBt', headerName: 'ID', flex:0.3 },
    { field: 'tenBai', headerName: 'T??n b??i', flex:1 },
    { field: 'doKho', headerName: '????? kh??', flex:0.5 },
    { field: 'loaiBai', headerName: 'Lo???i', flex:0.5 ,valueGetter: getType},
]

const GridToolbarCustom = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    )
}

function CreateTest(props) {

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [nameTest, setNameTest] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [questionSelecteds,setQuestionSelecteds] = useState([]);
    const [openBackDrop, setopenBackDrop] = useState(false);
    const uId = JSON.parse(localStorage.getItem('uId')); 

    const questions = useSelector((state) => state.createTest.questions)
    const [rows, setRows] = useState([]);
    const [editQues, setEditQues] = useState(false);

    const [totalQues, setTotalQues] = useState('');
    const [importType, setImportType] = useState('');
    const [qTemp, setQTemp] = useState()

    const importCauHoiTracNghiem = useSelector((state) => state.importData.cauHoiTracNghiem);
    const importCauHoiCode = useSelector((state) => state.importData.cauHoiCode);

    const handleSave = () => {
        
        const lsCauHoi = questions.map((item, index) => ({
            id: parseInt(item.id),
            stt: index + 1,
            diem: parseFloat(item.diem),
            loaiCauHoi: item.loaiCauHoi
        }))
        const baiKiemTra = {
            ngayBatDau: startDate,
            ngayKetThuc: endDate,
            moTa: nameTest,
            idPhong: params.idPhong,
            trangThai: 0,
            listCauHoi: lsCauHoi
        }
        const addDeKiemTra = async () => {
            try {
                //truong hop khac rong
                if(nameTest !== '')
                {
                    const response = await DeKiemTraAPI.add(baiKiemTra);
                    console.log(response.data);
                    if (response.data) {
                        alert("Th??m b??i ki???m tra th??nh c??ng!");
                        dispatch(createTestSlice.actions.clearQuestion([]));
                        navigate(-1)
                    }
                }else{
                    alert("Vui l??ng nh???p t??n b??i t???p!");
                }

            } catch (error) {
                if("Error: Request failed with status code 400" === String(error)){
                    alert("Vui l??ng nh???p ?????y ????? th??ng tin");
                }
                console.log("Fetch data error: ", error);
            }
        }
        addDeKiemTra();

    }

    const handleCloseBdrop = () => {
        setopenBackDrop(false);
    };

    const handleClickAdd = () => {
        if (!!uId) {
            try {
                const data = async () => {
                    const response = await DeKiemTraAPI.getListCauHoi(uId);
                    const convert  = response.data.map((item,index)=> ({
                        id: index,
                        idBt:item.id,
                        loaiBai: item.loaiBai,
                        tenBai: item.tenBai,
                        doKho: item.doKho === 1 ? "D???" : (item.doKho === 2? "Trung B??nh": "Kh??"),

                    }))
                    const fillter  = convert.filter(item => {
                        return !(!!questions.find(({id,loaiCauHoi}) => {
                            return item.loaiBai === loaiCauHoi && item.idBt === id;
                        }));
                    }) 
                    setRows(fillter);
                }
                data();
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        setopenBackDrop(true)
    }

    const handleCalTotalGrade = (array) => {
        console.log(array)
        let total = 0;
        array.map(i => 
            total = total + i.diem
                // console.log(i.diem)
            );
        return setTotalQues(Math.round(total));
    }

    const handleAccept = () => {
        
        dispatch(createTestSlice.actions.addQuestion(
            questionSelecteds.map((item) => ({
                id: item.idBt,
                diem: 0,
                loaiCauHoi: item.loaiBai,
                doKho: item.doKho,
            }))
        ))

        setopenBackDrop(false);
    }

    const handleClear = () => {
        dispatch(createTestSlice.actions.clearQuestion([]))
        setEditQues(false)
    }

    const handleEditQues = (value,id) => {
        let arr = []
        questions.map( item => 
            {
                if (item.id !== id) return arr.push(item);
                const objC = {...item};
                objC.diem = value === '' ? 0 : parseFloat(value);
                return arr.push(objC)
            }
        );
        handleCalTotalGrade(arr)
        setQTemp(arr);
    }
   
    const handleSaveChange = () => {
        if(totalQues > 10){
            alert('T???ng ??i???m ???? l???n h??n 10 vui l??ng ??i???u ch???nh l???i ??i???m c??c c??u h???i')
            // set
            return
        }
        dispatch(createTestSlice.actions.updateQuestion(qTemp));
        setEditQues(false);
    }

    const handleCancel = () => {
        handleCalTotalGrade(questions)
        setEditQues(false);
    }

    const handleFile = async (e) => {
        const file = e.target.files[0];
        const datafile = await file.arrayBuffer();
        const workBook = XLSX.read(datafile);

        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(workSheet, {
            header: 1,
            defval: ""
        });

        if (importType === "BaiTapTracNghiem") {
            
            dispatch(
                importDataSlice.actions.setCauHoiTracNghiem(jsonData.slice(1))
            );
        }
        if(importType === "BaiTapCode"){
            dispatch(
                importDataSlice.actions.setCauHoiCode(jsonData.slice(1))
            );
        }
    }

    const handleDeleteImportQuestions = (value, type) => {
        const list = [];
    
        if (type === "tracnghiem") {
          importCauHoiTracNghiem.map((a, index) => {
            if (index !== value) {
              list.push(a);
            }
            return null;
          });
          dispatch(importDataSlice.actions.setCauHoiTracNghiem(list));
        }
    
        if (type === "cauhoicode") {
          importCauHoiCode.map((a, index) => {
            if (index !== value) {
              list.push(a);
            }
            return null;
          });
          dispatch(importDataSlice.actions.setCauHoiCode(list));
        }
      };

    const addBTCode = async (ob) => {
        try {
            setLoading(true);
            const response = await BaiTapCodeAPI.postAddBaiTapCode(ob);
          
            if (response.data === true) {
                alert(`Th??m b??i t???p c?? ti??u ????? : ${ob.tieuDe} th??nh c??ng!`);
            }

            const responseCauHoiCode = await DeKiemTraAPI.getListCauHoi(uId);
            const convert  = responseCauHoiCode.data.map((item,index)=> ({
                id: index,
                idBt:item.id,
                loaiBai: item.loaiBai,
                tenBai: item.tenBai,
                doKho: item.doKho === 1 ? "D???" : (item.doKho === 2? "Trung B??nh": "Kh??"),

            }))

            dispatch(createTestSlice.actions.addQuestion(
                convert.map((item) => ({
                    id: item.idBt,
                    diem: 0,
                    loaiCauHoi: item.loaiBai,
                    doKho: item.doKho,
                }))
            ))
            setImportType("");
            setLoading(false);
          
        } catch (error) {
          console.log("Fetch data error: ", error);
        }
      };
    
      const addBTTracNghiem = async (ob) => {
        try {
          const response = await BaiTapTN.postAddBaiTapTN(ob);
          console.log(response);
          if (response.data === true) {
            alert(`Th??m b??i t???p c?? ti??u ????? : ${ob.cauHoi} th??nh c??ng!`);
            // setReset(true);
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      };

    const handleCloseImport = () => {
        dispatch(importDataSlice.actions.setCauHoiCode([]));
        dispatch(importDataSlice.actions.setCauHoiTracNghiem([]));
      };
    
    const handleAddListImport = () => {
        if (importCauHoiCode.length > 0) {
          importCauHoiCode.forEach((data) => {
            let baiTapCode = {
              tieuDe: data[0],
              deBai: data[1],
              rangBuoc: data[2],
              dinhDangDauVao: data[3],
              dinhDangDauRa: data[4],
              mauDauVao: data[5],
              mauDauRa: data[6],
              ngonNgu: data[7],
              thoiGian: data[8].replaceAll(`"`, ""),
              congKhai: data[9],
              doKho: data[10],
              uIdNguoiTao: uId,
            };
    
            let testCase = [];
            let i = 11;
            while (data.length > 0) {
              if (i > data.length) {
                return;
              } else {
                // let temp = 0;
                if (data[i] !== "" ) {
                   
                      testCase.push({
                        Input: data[i],
                        Output: data[i + 1],
                      });
                    //   temp = data[i + 1];
                
                }
                else break;
              }
              i = i + 2;
            }
            baiTapCode = {
              ...baiTapCode,
              testCases: testCase,
            };
    
            addBTCode(baiTapCode);
          });
    
          dispatch(importDataSlice.actions.setCauHoiCode([]));
        }
    
        if (importCauHoiTracNghiem.length > 0) {
          importCauHoiTracNghiem.forEach((data) => {
            let cauHoiTracNghiem = {
              cauHoi: data[0],
              cauTraLoi1: data[1],
              cauTraLoi2: data[2],
              cauTraLoi3: data[3],
              cauTraLoi4: data[4],
              dapAn: data[5],
              uIdNguoiTao: uId,
            };
    
            addBTTracNghiem(cauHoiTracNghiem);
          });
    
          dispatch(importDataSlice.actions.setCauHoiTracNghiem([]));
        }
    };

    useEffect(() => {
        if(questions){
            handleCalTotalGrade(questions)
        }
    },[questions])

    return (
        <>
            <Backdrop
                style={{ color: "#fff",  zIndex: 5 }}
                open={loading}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" disableShrink />
            </Backdrop>
            <div className={cx('header')}>
                <h2 >{!!nameTest ? nameTest : "T??n ba??i ki????m tra..."}</h2>
                <Button variant="contained" onClick={handleSave}>
                    L??u ba??i
                </Button>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-center')}>
                    <input className={cx('input-nameTest')} value={nameTest}
                        type='text' placeholder='Nh????p t??n ba??i ki????m tra'
                        onChange={(e) => setNameTest(e.target.value)}
                    >
                    </input>
                    <div className={cx('content-describe')}>
                        <h3 className={cx('title-row')}>Nga??y b????t ??????u Nga??y k????t thu??c</h3>
                        <RangePicker
                            placeholder={["Nga??y b????t ??????u", "Nga??y k????t thu??c"]}
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(dates, dateStrings) => {
                                setStartDate(dateStrings[0]);
                                setEndDate(dateStrings[1]);
                            }}
                        />
                    </div>

                    <div className={cx('content-questions')}>
                        <h3 className={cx('title-row')}>Ca??c c??u ho??i trong ba??i ki????m tra</h3>
                        <div 
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                            // className={cx('header-ques')}
                        >
                            <h3 
                            // className={cx('header-ques-left')}
                                style={{
                                    width: "200px"
                                }}
                            >T???ng ??i???m <span>{totalQues}/10</span></h3>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "20px",
                                }}
                            >
                                {questions.length > 0 && 
                                <button 
                                    className={cx('btn-add-question')} 
                                    onClick={editQues === false ? () => setEditQues(!editQues) :
                                        () => handleSaveChange()
                                    }
                                >
                                    <AddCircleIcon sx={{ fontSize: "19px" }} />
                                    {editQues === false  ?
                                    "Ch???nh s???a ?????" : "L??u thay ?????i"}
                                </button>}

                                {editQues === true && 
                                <button 
                                    className={cx('btn-add-question')} 
                                    onClick={() => handleCancel()}
                                >
                                    {/* <AddCircleIcon sx={{ fontSize: "19px" }} /> */}
                                    H???y
                                </button>}

                                {questions.length > 0 && 
                                <button 
                                    className={cx('btn-add-question')}
                                    onClick={() =>handleClear()}
                                >
                                    X??a t???t c???
                                </button>}
                            </div>
                        </div>

                        {
                            questions.map((item, index) => (
                                <ItemQuestion key={index} data={item} index={index} edit={editQues} onChangeScore={handleEditQues} />
                            ))
                        }

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                        }}
                    >
                        <div className={cx('add-question')}>
                            <button className={cx('btn-add-question')} onClick={() => handleClickAdd()} >
                                <AddCircleIcon sx={{ fontSize: "19px" }} />
                                Th??m C??u Ho??i
                            </button>
                        </div>

                        <div className={cx('add-question')}>
                            <button 
                                className={cx('btn-add-questionOutSite')} 
                                onClick={() => setImportType("BaiTapCode")} 
                            >
                                <AddCircleIcon sx={{ fontSize: "19px" }} />
                                Th??m C??u Ho??i Ngo??i
                            </button>
                        </div>
                    </div>

                </div>

                <Dialog open={openBackDrop} onClose={handleCloseBdrop} fullWidth maxWidth='lg'
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description" >
                    <DialogTitle>Th??m ba??i t????p</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ch???n c??u ho??i ba??i t????p ba??n mu????n th??m.
                        </DialogContentText>

                        <DataGrid
                            rows={rows}
                            columns={colums}
                            autoHeight
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            components={{
                                Toolbar: GridToolbarCustom
                            }}
                            checkboxSelection
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRowData = rows.filter((row) =>
                                    selectedIDs.has(row.id) )
                                setQuestionSelecteds(selectedRowData);
                            }}

                            localeText={{
                                toolbarColumns: "C???t",
                                toolbarFilters: "T??m ki???m",
                                toolbarDensity: "????? cao",
                                toolbarExport: "Xu???t file",
                                filterPanelInputLabel: 'Gi?? tr???',
                                filterPanelColumns: 'C???t',
                                filterPanelOperators: 'So s??nh'
                            }}
                        />
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseBdrop}>Hu??y</Button>
                        <Button onClick={handleAccept}>??????ng y??</Button>
                    </DialogActions>
                </Dialog>
            </div>

            {importType !== '' &&  
                <Dialog
                    fullScreen={fullScreen}
                    open={importType !== ''}
                    onClose={() => setImportType("")}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: '600' }}>
                        {importType === "BaiTapCode" ? "Import b??i t???p code t??? file excel" : "Import c??u h???i tr???c nhi???m t??? file excel"}
                    </DialogTitle>
                    <DialogContent  >
                        <DialogContentText sx={{ padding: '20px' }}>
                            <p>????? t???o nhi???u c??u h???i vui l??ng t???o theo file m???u</p>
                            <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: '6px', color: 'green', fontSize: '20px' }}></FontAwesomeIcon>
                            <a href={importType === "BaiTapCode" ? BaiTapCodeFile : BTTracnghiem}
                            // download={BaiTapCode.xlsx}
                            >B???m v??o ????y ????? t???i file</a>
                            <br></br>
                            <p style={{ marginTop: '20px' }}>????? import c??u h???i vui l??ng t???i file Excel l??n website!</p>
                            <label htmlFor="contained-button-file">
                                <Input accept="xlsx" id="contained-button-file" multiple type="file" 
                                    onChange={(e) => handleFile(e)} 
                                />
                                <Button variant="contained" component="span">
                                    Upload
                                </Button>
                            </label>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            }

            <Dialog
                open={
                    importCauHoiTracNghiem.length > 0 || importCauHoiCode.length > 0
                }
                fullWidth
                maxWidth="xl"
                // onClose={() => setImportBTCode([])}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title" sx={{ color: "#6F767A" }}>
                    C??c c??u h???i ???? th??m
                </DialogTitle>
                <DialogContent dividers>
                    <TableContainer component={Paper} style={{ maxHeight: 350 }}>
                    <Table aria-label="simple table">
                        {/* <TableRow> */}
                        <TableHead>
                        {importCauHoiTracNghiem.length > 0 && (
                            <TableRow>
                            <TableCell sx={{ width: "5%", fontWeight: "700" }}>
                                STT
                            </TableCell>
                            <TableCell
                                sx={{ width: "20%", fontWeight: "700" }}
                                align="center"
                            >
                                C??u h???i
                            </TableCell>
                            <TableCell
                                sx={{ width: "20%", fontWeight: "700" }}
                                align="center"
                            >
                                ????p ??n 1
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ????p ??n 2
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ????p ??n 3
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ????p ??n 4
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ????p ??n ????ng
                            </TableCell>
                            </TableRow>
                        )}
                        {importCauHoiCode.length > 0 && (
                            <TableRow>
                            <TableCell sx={{ width: "5%", fontWeight: "700" }}>
                                STT
                            </TableCell>
                            <TableCell
                                sx={{ width: "20%", fontWeight: "700" }}
                                align="center"
                            >
                                T??n b??i
                            </TableCell>
                            <TableCell
                                sx={{ width: "20%", fontWeight: "700" }}
                                align="center"
                            >
                                ????? b??i
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                R??ng bu???c
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ?????nh d???ng ?????u v??o
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                ?????nh d???ng ?????u ra
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                M???u ?????u v??o
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                M???u ?????u ra
                            </TableCell>
                            <TableCell sx={{ width: "10%", fontWeight: "700" }}>
                                Th???i gian
                            </TableCell>
                            <TableCell
                                sx={{ width: "5%", fontWeight: "700" }}
                                align="center"
                            >
                                Xo??a
                            </TableCell>
                            </TableRow>
                        )}
                        </TableHead>
                        <TableBody>
                        {importCauHoiCode.map((row, index) => (
                            <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell
                                className={styles.conten_cell}
                                align="center"
                                style={{ minWidth: "200px" }}
                            >
                                {row[0]}
                            </TableCell>
                            <TableCell align="center">{row[1]}</TableCell>
                            <TableCell>{row[2]}</TableCell>
                            <TableCell>{row[3]}</TableCell>

                            <TableCell>{row[4]}</TableCell>

                            <TableCell>{row[5]}</TableCell>

                            <TableCell>{row[6]}</TableCell>
                            <TableCell>{row[8].replaceAll(`"`, "")}</TableCell>

                            <TableCell align="center">
                                <DeleteIcon
                                sx={{ cursor: "pointer", color: "#f04530" }}
                                onClick={() =>
                                    // console.log(index)
                                    handleDeleteImportQuestions(index, "cauhoicode")
                                }
                                />
                            </TableCell>
                            </TableRow>
                        ))}

                        {importCauHoiTracNghiem.map((row, index) => (
                            <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell
                                className={styles.conten_cell}
                                align="center"
                                style={{ minWidth: "200px" }}
                            >
                                {row[0]}
                            </TableCell>
                            <TableCell align="center">{row[1]}</TableCell>
                            <TableCell>{row[2]}</TableCell>
                            <TableCell>{row[3]}</TableCell>

                            <TableCell>{row[4]}</TableCell>

                            <TableCell>{row[5]}</TableCell>

                            <TableCell align="center">
                                <DeleteIcon
                                sx={{ cursor: "pointer", color: "#f04530" }}
                                onClick={() =>
                                    // console.log(index)
                                    handleDeleteImportQuestions(index, "tracnghiem")
                                }
                                />
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddListImport()}>L??U</Button>
                    <Button onClick={() => handleCloseImport()}>THO??T</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateTest;