import React, { useContext, useEffect, useState } from 'react';

import {EventsContext} from '../pages/index'

import styles from './RequestForm.module.scss';



export default function RequestForm(props){
    const [login, setLogin] = useState(props.login);

    const handleSubmit = (e)=>{
        e.preventDefault();
        props.getLogin(login);
    }

    const {isReady, isRolled, setIsReady, setIsRerollStarted} = useContext(EventsContext);

    const handleTransitionEnd = (e)=>{
        if(e.target.tagName == "FORM"){
            setIsReady(true);
        }
    }

    const handleRerollClick = () => {
        setIsRerollStarted(true)
    }

    useEffect(()=>{
        if(!isReady){
            setIsReady(true)
        }
    },[isReady])

    let submitRerollClasses = `${styles.submit__reroll}`;
    submitRerollClasses += isRolled ? ` ${styles.submit__reroll_active}` : '';

    let formClasses = `${styles.form} ${props.isLoaded ? styles.form_sent : ''}`;
    //TODO:: create component with error messages
    return(
        <form onSubmit={handleSubmit} className={formClasses} onTransitionEnd={handleTransitionEnd}>
            <label htmlFor="login" className={styles.label}>Enter your profile URL</label>
            <input type="text" className={styles.input} id="login" autoComplete="off" onChange={(e) => {setLogin(e.target.value)}} value={login ? login : ''}/>
            <input type="submit" className={styles.submit} disabled={!login} value="Roll"/>
            <button className={submitRerollClasses} onClick={handleRerollClick}>
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                </svg>
            </button>
        </form>
    )
}