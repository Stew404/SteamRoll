import React from 'react'

import styles from './Game.module.scss'

const Game = React.forwardRef((props, ref)=>{
    let classes = `${styles.game}`;
    classes += props.isActive ? ` ${styles.game_active}` : ``; 

    let imgSrc = props.imgSrc ? props.imgSrc : `https://placehold.jp/3d4070/ffffff/600x900.png?text=${props.name}`;
    
    return (
        <div ref={ref} className={classes}>
            <img className={styles.game__img} src={imgSrc} width='6' height='9' />
        </div>
    )
})

Game.displayName = "Game";

export default Game;