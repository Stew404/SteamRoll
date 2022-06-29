import React, { useState } from 'react';

import styles from './RequestForm.module.scss';



export default function RequestForm(props){
    const [login, setLogin] = useState(props.login);

    const handleSubmit = (e)=>{
        e.preventDefault();
        props.getLogin(login);
    }

    const handleTransitionEnd = (e)=>{
        props.setIsReady(true);
    }

    let formClasses = `${styles.form} ${props.isLoaded ? styles.form_sent : ''}`;
    //TODO:: create component with error messages
    return(
        <form onSubmit={handleSubmit} className={formClasses} onTransitionEnd={handleTransitionEnd}>
            <label htmlFor="login" className={styles.label}>Enter your profile URL</label>
            <input type="text" className={styles.input} id="login" autoComplete="off" onChange={(e) => {setLogin(e.target.value)}} value={login ? login : ''}/>
            <input type="submit" className={styles.submit} disabled={!login} value="Roll"/>
        </form>
    )
}