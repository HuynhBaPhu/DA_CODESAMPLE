import React from 'react';
import { NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { theoryRemainingSelector } from '../../redux/selectors';
import styles from './styles/Theory.module.css';
import image from '../../images/C-programming 1.png'


function Course() {

    const listTheory = useSelector(theoryRemainingSelector);

    return (
        <div className={styles.listCourse}>
            {listTheory.map( monHoc => (
                <NavLink to= {`/theory/coureDetail/${monHoc.id}`} key={monHoc.id} className={styles.course}>
                    <img src={monHoc.hinhAnh === null ? image : window.atob(monHoc.hinhAnh)} alt='imageCourse' />
                    <div>
                        <h3 className={styles.title}>{monHoc.tenMonHoc}</h3>
                        <p className={styles.discription}>{monHoc.moTa}</p>
                        <div className={styles.line}></div>
                        <p className={styles.kind}>Miễn phí</p>
                    </div>
                </NavLink>)
            )}
        </div>
    );
}

export default Course;