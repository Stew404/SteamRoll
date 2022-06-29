import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Game from '../components/Game';

import styles from './GamesContainer.module.scss';


export default function GamesContainer(props){

    const buildRoulette = (loops = 3)=>{
        return Array(loops).fill(props.selectedGames).flat();
    }

    const [rouletteOrder, setRouletteOrder] = useState(buildRoulette());
    const [containerStyle, setContainerStyle] = useState({
        transform: `translateX(100%)`,
        transition: `transform 2s ease-in-out`
    });

    const containerRef = useRef(null);
    const gameRef = useRef(null);

    const [gameWidth, setGameWidth] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(()=>{
        setGameWidth(gameRef.current.offsetWidth)
        setWindowWidth(window.innerWidth)
    }, [gameRef])

    const [centralPosition, setCentralPosition] = useState(0)

    useEffect(()=>{
        setCentralPosition(windowWidth / 2 - gameWidth / 2);
    }, [gameWidth, windowWidth])

    const rouletteLength = rouletteOrder.length;
    const targetElem = rouletteLength - 3;

    const roll = ()=>{  
        const rollOffset = centralPosition - (gameWidth * targetElem);

        setContainerStyle({
            transform: `translateX(${rollOffset}px)`,
            transition: `transform 3s ease-in-out`
        })
    }

    useEffect(()=>{
        roll();
    }, [centralPosition])

    

    const handleTransitionEnd = () => {
        setRouletteOrder(rouletteOrder.map((cur, index)=>{
            cur.isActive = targetElem == index;
            return cur
        }))
    }

    
    return(
        <>
        <div ref={containerRef} className={styles.roulette} style={containerStyle} onTransitionEnd={handleTransitionEnd}>
            {
                rouletteOrder.length > 0 &&
                rouletteOrder.map((currentGame, index)=>{
                    return <Game ref={gameRef} name={currentGame.name} imgSrc={currentGame.boxArtUrl} key={index} isActive={currentGame.isActive}/>

                })
            }
        </div>
        </>
    )
}