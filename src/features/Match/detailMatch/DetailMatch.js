import React, { useState } from "react";
import styles from "./DetailMatch.module.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import DeCauHoiGiaiDauAPI from "../../../apis/deCauHoiGiaiDauAPI";
import { useStateIfMounted } from "use-state-if-mounted";
import { Button } from '@mui/material';
import {createDeThi} from '../../../components/content/export';
import { useNavigate } from "react-router-dom";
import ItemDeThiMatch from "./ItemDeThiMatch";

function DetailMatch(){
    const navigate = useNavigate();
    const params = useParams();
    let idDeCauHoiGiaiDau = params.idDeCauHoiGiaiDau;
    let nameMatch = params.nameMatch;
    let idMatch = params.idMatch;
    const [test, setTest] = useStateIfMounted({});
    const [questions, setQuestions] = useStateIfMounted([]);
    const [date, setDate] = useState({
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        second: "",
    });

    useEffect(() => {
        const data = async () => {
            try {
                const response = await DeCauHoiGiaiDauAPI.getDeCauHoiGiaiDauByID(idDeCauHoiGiaiDau);
                setTest(response.data);
                setQuestions(response.data.listCauHoi);
                setDate({
                    year: response.data.ngayTao.split('-')[0],
                    month: response.data.ngayTao.split('-')[1],
                    day: response.data.ngayTao.split('-')[2].split('T')[0],
                    hour: response.data.ngayTao.split('-')[2].split('T')[1].split(':')[0],
                    minute: response.data.ngayTao.split('-')[2].split('T')[1].split(':')[1],
                    second: response.data.ngayTao.split('-')[2].split('T')[1].split(':')[2].split('.')[0],
                });
            } catch (error) {
                console.log("Error...", error);
            } 
        }
        data();
    }, [idDeCauHoiGiaiDau]);

    console.log("test...", test);
    console.log("date", date);

    return (
        <div>
            {idDeCauHoiGiaiDau !== '0' ? 
                <div className={styles.body_detailMatch}>
                    <Button
                        sx={{ marginBottom: "20px", marginRight: "20px", float: "right" }}
                        variant="contained"
                        onClick={() => navigate(`/match`)}
                    >Xem danh s??ch</Button>
                    <h1>Gi???i ?????u {params.nameMatch}</h1>
                    <h3>Ng??y t???o ?????: {date.day}/{date.month}/{date.year} {date.hour}:{date.minute}:{date.second}</h3>
                    <h3>T???ng ??i???m gi???i ?????u: {test.tongDiem}</h3>
                    {questions?.map((data, index) => (
                        <ItemDeThiMatch key={index} data={data} index={index} />
                    ))}
                </div>
                : <div className={styles.nullAbleTest}>
                    <div>
                        <img src={createDeThi} className={styles.imgCreateDeThi}/>
                        <h1>Gi???i ?????u ch??a ???????c t???o ????? thi</h1>
                        <Button variant="contained" onClick={() => navigate(`/match/createMatch/${nameMatch}/${idMatch}`)}>T???o ????? thi</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailMatch;
