import { useRouter } from 'next/router';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {EventsContext} from '../pages/index'
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
    const [rollOffset, setRollOffset] = useState(0)

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
        setContainerStyle({
            transform: `translateX(${rollOffset}px)`,
            transition: `transform 3s ease-in-out`
        })
    }

    const hideContainer = ()=>{
        setContainerStyle({
            transform: `translateX(${rollOffset - gameWidth * 4}px)`,
            transition: `transform .5s ease-in-out`
        })
    }

    
    useEffect(()=>{
        setRollOffset(centralPosition - (gameWidth * targetElem))
    }, [centralPosition])

    useEffect(()=>{
        roll();
    }, [rollOffset])

    const {isRerollStarted, setIsRolled, setIsReady, setIsRerollStarted} = useContext(EventsContext);    

    const handleTransitionEnd = () => {
        setRouletteOrder(rouletteOrder.map((cur, index)=>{
            cur.isActive = targetElem == index;
            return cur
        }))
        
        setIsRolled(true)

        if(isRerollStarted){
            setIsReady(false)

            setIsRerollStarted(false)
        }
    }

    useEffect(()=>{
        if(isRerollStarted){
            hideContainer();
            
        }
    }, [isRerollStarted])

    
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