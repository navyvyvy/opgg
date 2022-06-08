import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import './Content-body-left-bottom.css';

export default function ContentBodyLeftBottom(props) {
  const most = props.data;
  const [champions, setChampions] = useState([]);
  const [recentWinRate, setRecentWinRate] = useState([]);

  useEffect(() => {
    if (most != null) {
      let champ = [];

      _.forEach(_.sortBy(most.champions, 'games').reverse(), (ch) => {

        let kill = ch.kills / ch.games;
        let assists = ch.assists / ch.games;
        let deaths = ch.deaths / ch.games;

        let kda = (ch.kills + ch.assists) / ch.deaths;
        let winRate = ch.wins / ch.games * 100;

        champ.push({
          cs: `CS ${ch.cs}`,
          name: ch.name,
          imageUrl: ch.imageUrl,
          kda: `${kda.toFixed(2)}:1 평점`,
          kdaStyle: {color: `${getStatColor(kda)}`},
          kills: `${kill.toFixed(1)}`,
          deaths: `${deaths.toFixed(1)}`,
          assists: `${assists.toFixed(1)}`,
          games: `${ch.games} 게임`,
          winRate: `${winRate.toFixed(0)} %`,
          winStyle: {color: `${(winRate >= 60.0) ? '#c6443e' : '#5e5e5e'}`}
        });

        function getStatColor(value) {
          if (value >= 3.00 && value < 4.00)
           return '#2daf7f';
          else if (value >= 4.00 && value < 5.00)
             return '#1f8ecd';
          else if (value >= 5.00)
             return '#e19205';
          else
            return '#5e5e5e';
        }
      });

      setChampions(champ);

      let recent = [];

      _.forEach(most.recentWinRate, (re) => {
        let winRate = re.wins / (re.wins + re.losses) * 100;
        recent.push({
          name: re.name,
          imageUrl: re.imageUrl,
          wins: `${re.wins} 승`,
          losses: `${re.losses} 패`,
          winRate: `${winRate.toFixed(0)}%`,
        });
      });

      setRecentWinRate(recent);

    }
  }, [most]);

  const [isActive, setIsActive] = useState(0);
  const menuHandler = idx => {
    setIsActive(idx);
  }

  const menu = ['프리시즌', '7일간 랭크 승률'];

  return (
    <>
      <div className="most">
        <ul>
          {menu.map((m, idx) => (
            <li className={isActive === idx ? 'most-menu active': 'most-menu'} key={idx}>
              <button onClick={menuHandler.bind(this, idx)}>{m}</button>
            </li>
          ))}
        </ul>
        <div className={isActive === 0 ? 'active' : 'hide'}>
          {champions.length > 0 && champions.map((ch, idx) => (
            <div className="champion-box" key={idx}>
              <div className="face">
                <img src={ch.imageUrl} alt={ch.name}/>
              </div>
              <div className="info">
                <div className="name">
                  {ch.name}
                </div>
                <div className="cs">{ch.cs}</div>
              </div>
              <div className="kda">
                <div>
                  <div className="kda-data" style={ch.kdaStyle}>{ch.kda}</div>
                </div>
                <div className="detail">
                  {ch.kills}&nbsp;/&nbsp;{ch.deaths}&nbsp;/&nbsp;{ch.assists}
                </div>
              </div>
              <div className="played">
                <div>
                  <div className="win" style={ch.winStyle}>{ch.winRate}</div>
                </div>
                <div className="count">{ch.games}</div>
              </div>
            </div>
          ))}

        </div>
        <div className={isActive === 1 ? 'active' : 'hide'}>
          <ul>
            {recentWinRate.length > 0 && recentWinRate.map((re, idx) => (
              <li key={idx}>
                <div className="face">
                  <img src={re.imageUrl} alt={re.name}/>
                </div>
                <div className="info">
                  <div className="name">{re.name}</div>
                </div>
                <div className="winRatio">{re.winRate}</div>
                <div className="graph">
                  <div className="graph-bar">
                    <div className="fill left"></div>
                    <div className="text left">{re.wins}</div>
                    <div className="fill right"></div>
                    <div className="text right">{re.losses}</div>
                    <div className="bar"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}