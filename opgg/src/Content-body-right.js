import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import './Content-body-right.css';

export default function ContentBodyRight(props) {
  const data = props.games;
  const summary = props.summary;
  const positions = props.positions;

  const [games, setGames] = useState([]);
  const [menu, setMenu] = useState(0);

  useEffect(() => {
    let g = _.groupBy(data, 'gameType');

    Object.assign(g, {'전체': data});
    setMenu('전체');
    setGames(g);
    console.log(g);
  }, [data]);

  const typeMenuHandler = (key) => {
    setMenu(key);
  };

  return (
    <>
      <div className="game-type">
        <ul>
        {games && Object.keys(games).map((key, idx) => (
          <li className={"game-type-menu" + ((key === menu) ? ' active': '')} key={idx}>
            <button onClick={() => {typeMenuHandler(key)}}>{key}</button>
          </li>
        ))}
        </ul>
      </div>
      <div className="game-summary">
        <table>
          <tbody>
            <tr>
              <td className="title">
                {summary.wins + summary.losses}전 {summary.wins}승 {summary.losses}패
              </td>
              <td className="most-champion" rowSpan="2"></td>
              <td className="title">선호 포지션 (랭크)</td>
            </tr>
            <tr>

            </tr>
          </tbody>
        </table>
      </div>
      <ul className="game-list">
        {games[menu] && games[menu].map((game, idx) => (
          <li className="game" key={idx}>
            <div className="game-info">
              <div className="info">
                <div className="type">{game.gameType}</div>
                <div className="" style={{position: 'relative'}}>
                  <div className="time-stamp">2시간 전</div>
                </div>
                <div className="bar"></div>
                <div className="game-result">{games.isWin ? '승리' : '패배'}</div>
                <div className="game-length">{(game.gameLength / 60).toFixed(0)}분 초</div>
              </div>
              <div className="champion">
                <div className="icon">
                  <img src={game.champion.imageUrl} alt="champ"/>
                </div>
                <div className="spells">
                  {game.spells.map((spell, idx) => (
                  <div className="spell" key={idx}>
                    <div className="" style={{position: 'relative'}}>
                      <img src={spell.imageUrl} alt="spell"/>
                    </div>
                  </div>
                  ))}
                </div>
                <div className="runes">
                  {game.peak.map((p, idx) => (
                  <div className="rune" key={idx}>
                    <div className="" style={{position: 'relative'}}>
                      <img src={p} alt="rune"/>
                    </div>
                  </div>
                  ))}
                </div>
              </div>

              <div className="kda">
                <div className="k-d-a">
                  <span>7</span> / <span className="d">2</span> / <span>9</span>
                </div>
                <div className="ratio">
                  <span>8.00:1</span> 평점
                </div>
              </div>

              <div className="stats">
                <div className="level">레벨 {game.champion.level}</div>
                <div className="cs">
                  <div className="" style={{position: 'relative'}}>{game.stats.general.cs} ({game.stats.general.csPerMin})</div>CS
                </div>
                <div className="kill-participantion">
                  <div className="" style={{position: 'relative'}}>킬관여 {game.stats.general.contributionForKillRate}</div>
                </div>
                <div className="mmr"><span>매치 평균</span><br/><b>{game.stats.tierRankShort}</b></div>
              </div>

            </div>
          </li>
        ))}
      </ul>
    </>
  );
}