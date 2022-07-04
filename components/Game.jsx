import React from 'react'

import styles from './Game.module.scss'

const Game = React.forwardRef((props, ref)=>{
    let classes = `${styles.game}`;
    classes += props.isActive ? ` ${styles.game_active}` : ``; 
    return (
        <div ref={ref} className={classes}>
            <img className={styles.gameImg} src={props.imgSrc} width='6' height='9' />
        </div>
    )
})

Game.displayName = "Game";

export default Game;