import Head from 'next/head'
import { useRouter } from 'next/router' 
import React, { useEffect, useState } from 'react';

import GamesContainer from '../components/GamesContainer';
import RequestForm from '../components/RequestForm';

const STEAM_API_KEY = '849C8E1481E57D3FB5D2F6E1DBAEC6DB';
const SGDB_API_KEY = 'fbbb5b7395fa5c37482f5cffafe51226';

export const EventsContext = React.createContext(null)

export default function Home(props) {
  const router = useRouter();
  const [login, setLogin] = useState(router.query.login)
  const getLogin = (login)=>{
    setLogin(login);
    router.push(`?login=${login}`)
  }

  const [isReady, setIsReady] = useState(false);
  const [isRolled, setIsRolled] = useState(false);
  const [isRerollStarted, setIsRerollStarted] = useState(false)

  useEffect(()=>{
    if(!router.query.login){
      setIsReady(false)
      setIsRolled(false)
    }
  }, [router.query.login])

  useEffect(()=>{
    if(props.selectedGames.length > 0){
      setIsReady(true)
    }
  }, [props.selectedGames])

  console.log(isReady, props.selectedGames)

  return (
    <div>
      <Head>
        <title>SteamRoll</title>
        <meta name="description" content="Steam Library Randomizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <EventsContext.Provider value={{isReady, isRolled, isRerollStarted, setIsReady, setIsRolled, setIsRerollStarted}}>
          <div className="wrapper">
          {
          isReady &&
          <GamesContainer selectedGames={props.selectedGames}/>    
          }
          </div>
          <RequestForm getLogin={getLogin} isLoaded={props.isLoaded} login={login}/>
        </EventsContext.Provider>
      </main>
    </div>
  )
}

export async function getServerSideProps(context){
  if(!context.query.login){
    return {
      props: {
        selectedGames: [],
        isLoaded: false
      }
    }
  }

  const getSteamId = async (login)=>{

    if(!login){
      return false
    }

    const res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${login}`)
    const json = await res.json()
    const successCode = json.response.success;
    
    if(!successCode) {
      return false
    }

    return json.response.steamid
  }

  const getGamesData = async (steamId)=>{
    const res = await fetch(` http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&&include_appinfo=1`);
    const gamesData = await res.json();
    return gamesData;
  }

  const getSelectedIds = async (gamesCount, elemsCount = 10)=>{
    const res = await fetch(`https://www.random.org/integers/?num=${elemsCount}&min=0&max=${gamesCount}&col=1&base=10&format=plain&rnd=new`)
    const data = await res.text()
    let numbers = data.split('\n', elemsCount);  
    return numbers.map(num => parseInt(num))
  }

  const convertAppIdtoGameId = async (appId) =>{
    let res = await fetch(`https://www.steamgriddb.com/api/v2/games/steam/${appId}`,{
      headers: {
        'Authorization': `Bearer ${SGDB_API_KEY}`
      }
    });
    let json = await res.json();
    return json.data.id;
  }

  const getAlternateUrl = async (appId)=>{
    const gameId = await convertAppIdtoGameId(appId);

    let res = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900`,{
      headers: {
        'Authorization': `Bearer ${SGDB_API_KEY}`
      }
    });
    let json = await res.json();

    if(!json.success || !json.data.length > 0){
      return null
    }
    return json.data[0].url
  }

  const getBoxArtUrl = async (appId)=>{
    let url = `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900_2x.jpg`;

    let res = await fetch(url);

    if(!res.ok){
      url = getAlternateUrl(appId);
    }

    return url
  }

  const getGames = async (gamesList, selectedIds)=>{

    let selectedGames = await Promise.all(
      selectedIds.map(async (currentId)=>{
        const currentGame = gamesList[currentId];
        let boxArtUrl = '';

        try {
          boxArtUrl = await getBoxArtUrl(currentGame.appid);
        } catch (err){
          console.log("curGame: ")
          console.log(currentGame)
          console.log(currentId);
          console.log(gamesList[currentId-1], gamesList[currentId], gamesList[currentId+1]);
        }

        let currentGameData = {
          name: currentGame.name,
          boxArtUrl: boxArtUrl,
          active: false
        }

        return currentGameData
      })
    )
    return selectedGames
  }

  

  const steamId = await getSteamId(context.query.login)
  const gamesData = await getGamesData(steamId);
  const gamesCount = gamesData.response.games.length-1;
  const selectedIds = await getSelectedIds(gamesCount);
  const selectedGames = await getGames(gamesData.response.games, selectedIds);

  return {
    props: {
      selectedGames: selectedGames,
      isLoaded: true
    }
  }
}
