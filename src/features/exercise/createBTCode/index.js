import React, { useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import styles from './CreateBTCode.module.css';
import Backdrop from '../../../components/Backdrop';
import BaiTapCodeAPI from '../../../apis/baiTapCodeAPI';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';

function CreateBTCode(props) {
    
    const navigate = useNavigate();
    const [nameExercise, setNameExercise] = useState("");
    const [openTestCase, setOpenTestCase] = useState(false);
    const [input, setInput] = useState();
    const [output, setOutput] = useState();
    const [testCases, setTestCases] = useState([]);
    const [language, setLanguage] = useState("c")

    const deBaiRef = useRef()
    const rangBuocRef = useRef()
    const dinhDangDauVaoRef = useRef()
    const dinhDangDauRaRef = useRef()
    const mauDauVaoRef = useRef()
    const mauDauRaRef = useRef()
    const uId = JSON.parse(localStorage.getItem('uId')); 
    
    const handleSaveExercise = () => {
        if(!!uId)
        {
            if(nameExercise === '' ||
                deBaiRef.current.value === '' ||
                rangBuocRef.current.value === ''||
                dinhDangDauVaoRef.current.value === '' ||
                dinhDangDauRaRef.current.value === '' ||
                mauDauVaoRef.current.value === '' ||
                mauDauRaRef.current.value === ''){
                alert("Vui lòng nhập đầy đủ thông tin")
                return;
            }
            if(testCases.length === 0){
                alert("Vui lòng thêm TESTCASE");
                return;
            }
            let ob = {
                tieuDe: nameExercise,
                deBai: deBaiRef.current.value,
                uIdNguoiTao: uId,
                ngonNgu: language,
                rangBuoc: rangBuocRef.current.value,
                dinhDangDauVao: dinhDangDauVaoRef.current.value,
                dinhDangDauRa: dinhDangDauRaRef.current.value,
                mauDauVao: mauDauVaoRef.current.value,
                mauDauRa: mauDauRaRef.current.value,
                testCases: testCases
            }
    
            const addBTCode = async () => {
                try {
                    const response = await BaiTapCodeAPI.postAddBaiTapCode(ob);
                    if(response.data){
                        alert("Thêm bài tập code thành công!")
                        navigate("/exercise");
                    }
                    console.log(response.data);
                } catch (error) {
                    console.log("Fetch data error: ", error);
                }
            }
            addBTCode();
        }
        
    }
    
    const handleAddTestCase = () => {
        setTestCases(
            [
                ...testCases,
                { Input: input, Output: output }
            ]
        )
        setOpenTestCase(false);
        setInput('')
        setOutput('')
    }

    const handleRemoveInput = (index) => {
        testCases.splice(index,1)
        setTestCases([...testCases])
    }

    return (
        <>
            <div className={styles.content} >

                <input className={styles.input_NameEx}
                    type='text' placeholder='Nhập tên bài tập' 
                    onChange={e => setNameExercise(e.target.value)}
                ></input>

                <div className={styles.exxercise_discription} >
                    Mô tả
                    <TextField inputRef={deBaiRef} sx={{marginTop:"20px"}} fullWidth label="Nhập đề bài" multiline />
                    <TextField inputRef={rangBuocRef} sx={{marginTop:"20px"}} fullWidth label="Nhập ràng buộc" multiline />
                    <TextField inputRef={dinhDangDauVaoRef} sx={{marginTop:"20px"}} fullWidth label="Nhập định dạng đầu vào" multiline />
                    <TextField inputRef={dinhDangDauRaRef} sx={{marginTop:"20px"}} fullWidth label="Nhập định dạng đầu ra" multiline />
                    <TextField inputRef={mauDauVaoRef} sx={{marginTop:"20px"}} fullWidth label="Nhập mẫu đầu vào" multiline />
                    <TextField inputRef={mauDauRaRef} sx={{marginTop:"20px"}} fullWidth label="Nhập mẫu đầu ra" multiline />
                    <TextField 
                    // inputRef={} 
                    sx={{marginTop:"20px"}} fullWidth label="Thời gian" multiline />

                </div>
                

                <div className={styles.excercise_language}>
                    <FormControl fullWidth>
                        <InputLabel id="language-label">Ngôn ngữ</InputLabel>
                        <Select
                            labelId="language-label"
                            value={language}
                            label="Ngôn ngữ"
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <MenuItem value='c'>C</MenuItem>
                            <MenuItem value='cpp'>C++</MenuItem>
                            <MenuItem value='py'>Python</MenuItem>
                            <MenuItem value='cs'>C#</MenuItem>
                            <MenuItem value='java'>Java</MenuItem>
                            <MenuItem value='go'>GoLang</MenuItem>
                            <MenuItem value='js'>JavaScript</MenuItem>
                        </Select>
                    </FormControl>
                </div>
               

                <div className={styles.content_TestCase} >

                        <Button  variant="contained" className={styles.btnAddTestCase}
                            endIcon={<AddCircleOutlinedIcon />}
                            onClick={() => setOpenTestCase(true)}
                        >
                            Thêm TestCase
                        </Button>

                    {testCases.map((testcase, index) => (
                        <div className={styles.testcase} key={index} >
                            <div className={styles.name_input} >
                                TestCase #{index + 1}
                            </div>

                            <div className={styles.testcase_btn} >
                                <FontAwesomeIcon className={styles.btn_update} icon={faPen} />
                                <FontAwesomeIcon className={styles.btn_delete} icon={faTrashCan} onClick={() => handleRemoveInput(index)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.exercise_btn} >
                    <Button  variant="contained" style={{backgroundColor:"darkgray"}}
                        endIcon={<CancelIcon />}
                        onClick={() => {
                            navigate("/exercise")
                        }}
                    >
                        Hủy
                    </Button>

                    <Button  variant="contained" style={{marginLeft:"20px"}}
                        endIcon={<SaveIcon />}
                        onClick={handleSaveExercise}
                    >
                        Lưu
                    </Button>
                </div>
            </div>
            
            {/* Dialog Add TestCase */}
            {openTestCase && <Backdrop onClick={() => setOpenTestCase(false)} />}
            {openTestCase && <div className={styles.input_testcase} >
                <h2>NHẬP TESTCASE</h2>
                <div>
                    <TextField className={styles.input_output}  label="Đầu vào" 
                        placeholder="Nhập đầu vào (input)" value={input}
                        multiline onChange= {e => setInput(e.target.value)}/>
                    <div style={{width:"100%", height:"20px"}}></div>
                    <TextField className={styles.input_output} label="Đầu ra" 
                        placeholder="Nhập đầu ra (output)" value={output}
                        multiline onChange= {e => setOutput(e.target.value)}/>
                </div>
                <div className={styles.btn_intputTestCase} >
                    <Button  variant="contained" style={{backgroundColor:"darkgray"}}
                        endIcon={<CancelIcon />}
                        onClick={() => setOpenTestCase(false) }
                    >
                        Hủy
                    </Button>

                    <Button  variant="contained" style={{marginLeft:"20px"}}
                        endIcon={<SaveIcon />}
                        onClick={handleAddTestCase}
                    >
                        Lưu
                    </Button>
                </div>
            </div>}
        </>
    );
}

export default CreateBTCode;