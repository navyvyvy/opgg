import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ContentHeader from './Content-header';
import ContentBodyLeftTop from './Content-body-left-top';
import ContentBodyLeftBottom from './Content-body-left-bottom';
import ContentBodyRight from './Content-body-right';
import './Body.css';

const SUMMONER_INFO_URL = "https://codingtest.op.gg/api/summoner/";

const useContent = (query) => {
  const [summoner, setSummoner] = useState([]);
  const [games, setGames] = useState([]);
  const [positions, setPositions] = useState([]);
  const [champions, setChampions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [most, setMost] = useState([]);

  useEffect(() => {
    fetchData(query);
  }, [query]);

  const fetchData = async (query) => {
    let url = `${SUMMONER_INFO_URL}${query}`;
    try {
      const resInfo = await axios.get(url);
      const resMatch = await axios.get(`${url}/matches`);
      const resMost = await axios.get(`${url}/mostInfo`);

      setSummoner(resInfo.data.summoner);
      setChampions(resMatch.data.champions);
      setGames(resMatch.data.games);
      setPositions(resMatch.data.positions);
      setSummary(resMatch.data.summary);
      setMost(resMost.data);

    } catch(err) {
      console.error(err);
    }
  }
  return {summoner, games, positions, champions, summary, most}
}

export default function Body () {
  const { summonerName } = useParams();
  const {summoner, games, positions, champions, summary, most} = useContent(summonerName);

  console.log(summoner, games, positions, champions, summary, most);

  return (
    <>
      {summoner && (
        <ContentHeader data={summoner} />
      )}
      <div className="Rectangle-2"></div>
      <div className="content-body">
        <div className="content-body-left">
          <ContentBodyLeftTop data={summoner} />
          <ContentBodyLeftBottom data={most} />
        </div>
        <div className="content-body-right">
          <ContentBodyRight games={games} summary={summary} positions={positions} />
        </div>
      </div>

    </>
  )
}