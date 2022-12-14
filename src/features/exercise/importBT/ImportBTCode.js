import React from 'react';
import * as XLSX from 'xlsx';
import BaiTapCodeFile from '../../../files/BaiTapCode.xlsx';
import BTTracnghiem from '../../../files/CauHoiTracNghiem.xlsx';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import importDataSlice from '../../../redux/importDataSlice';

const Input = styled('input')({
    display: 'none',
});

function ImportBTCode({ style, type }) {

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };
    const handleFile = async (e) => {
        const file = e.target.files[0];
        const datafile = await file.arrayBuffer();
        const workBook = XLSX.read(datafile);

        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(workSheet, {
            header: 1,
            defval: ""
        });

        setOpen(false);
        

        if (type === "BaiTapTracNghiem") {
            
            dispatch(
                importDataSlice.actions.setCauHoiTracNghiem(jsonData.slice(1))
            );
        }
        if(type === "BaiTapCode"){
            dispatch(
                importDataSlice.actions.setCauHoiCode(jsonData.slice(1))
            );
        }


    }

    return (

        <div>
            <Button sx={style} variant="outlined" onClick={handleClickOpen}>
                {type === "BaiTapCode" ? "Import B??i t???p code" : "T???o nhi???u c??u h???i tr???c nghi???m"}
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: '600' }}>
                    {type === "BaiTapCode" ? "Import b??i t???p code t??? file excel" : "Import c??u h???i tr???c nhi???m t??? file excel"}
                </DialogTitle>
                <DialogContent  >
                    <DialogContentText sx={{ padding: '20px' }}>
                        <p>????? t???o nhi???u c??u h???i vui l??ng t???o theo file m???u</p>
                        <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: '6px', color: 'green', fontSize: '20px' }}></FontAwesomeIcon>
                        <a href={type === "BaiTapCode" ? BaiTapCodeFile : BTTracnghiem}
                        // download={BaiTapCode.xlsx}
                        >B???m v??o ????y ????? t???i file</a>
                        <br></br>
                        <p style={{ marginTop: '20px' }}>????? import c??u h???i vui l??ng t???i file Excel l??n website!</p>
                        <label htmlFor="contained-button-file">
                            <Input accept="xlsx" id="contained-button-file" multiple type="file" onChange={(e) => handleFile(e)} />
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ImportBTCode;
