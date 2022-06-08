import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import ReactTooltip from 'react-tooltip';
import './Content-body-right.css';

export default function ContentBodyRight(props) {
  const data = props.games;
  const summary = props.summary;
  const positions = props.positions;
  const champions = props.champions;
  const items = props.items;

  const [games, setGames] = useState([]);
  const [menu, setMenu] = useState(0);

  useEffect(() => {
    setMenu('전체');
    setGames({
    '전체': data,
    ..._.groupBy(data, 'gameType')});

    _.forEach(champions, (ch) => {
      makeData(ch);
    });

    makeData(summary);

    function makeData(target) {
      target.kda = (target.kills + target.assists) / target.deaths;
      target.kdaString = `${(target.kda).toFixed(2)}:1`;
      target.kdaStyle = {color: getStatColor(target.kda)};
      target.winRate = target.wins / target.games * 100;
      target.winRateString = `${(target.winRate).toFixed(0)}%`;
      target.winStyle = {color: `${(target.winRate >= 60.0) ? '#c6443e' : '#5e5e5e'}`};
    }

  }, [data, champions]);

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
  function getItemInfo(value) {
    let id = value.split('/')[6].split('.')[0];

    return `<b>${items[id].name}</b><br/><br/>${items[id].description}`;
  }
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
              <td className="most-champion" rowSpan="2">
                <ul>
                  {champions && champions.map((champion, idx) => (
                  <li key={idx}>
                    <div className="icon">
                      <img src={champion.imageUrl} alt={champion.name}/>
                    </div>
                    <div className="name">{champion.name}</div>
                    <div className="win-lose">
                      <div className="" style={{position: 'relative', display: 'inline'}}>
                        <b className="win-rate" style={champion.winStyle}>{(champion.winRateString)}</b>
                      </div> ({champion.wins}승 {champion.losses} 패)&nbsp;
                    </div>
                    <div className="win-score" style={champion.kdaStyle}>{(champion.kdaString)} 평점</div>
                  </li>
                  ))}
                </ul>
              </td>
              <td className="title">선호 포지션 (랭크)</td>
            </tr>
            <tr>
              <td className="kda">
                <div className="k-d-a">
                  <span>{summary.kills}</span> / <span className="death">{summary.deaths}</span> / <span>{summary.assists}</span>
                </div>
                <div className="ratio">
                  <span className="kda-ratio" style={summary.kdaStyle}>{summary.kdaString}</span>
                    <div className="" style={{position: 'relative'}}>
                  </div>
                </div>
              </td>
              <td className="position-stats">
                <ul>
                  {positions && positions.map((pos, idx) => (
                  <li key={idx}>
                    <div className="icon">
                    </div>
                    <div className="content">
                      <div className="name">{pos.position}</div>
                      <div>
                        <span className="role-ratio"><b>{(pos.games/(positions[0].games + positions[1].games)*100).toFixed(0)}</b>%</span>
                        <span className="win-ratio">승률 <b>{(pos.wins/pos.games*100).toFixed(0)}</b>%</span>
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="game-list">
        {games[menu] && games[menu].map((game, idx) => (
          <li className="game" key={idx}>
            <div className={game.isWin === true ? "game-info win" :"game-info lose"}>
              <div className="info">
                <div className="type">{game.gameType}</div>
                <div className="" style={{position: 'relative'}}>
                  <div className="time-stamp">2시간 전</div>
                </div>
                <div className="bar"></div>
                <div className="game-result">{game.isWin ? '승리' : '패배'}</div>
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
                  <span>{game.stats.general.kill}</span> / <span className="d">{game.stats.general.death}</span> / <span>{game.stats.general.assist}</span>
                </div>
                <div className="ratio">
                  <span>{game.stats.general.kdaString}</span> 평점
                </div>
                {game.stats.general.largestMultiKillString !== "" && (
                <div className="multi-kill">
                  <span>{game.stats.general.largestMultiKillString}</span>
                </div>
                )}
                {game.stats.general.opScoreBadge !== "" && (
                <div className={game.stats.general.opScoreBadge === "ACE" ? 'badge ace' : 'badge mvp'}> {game.stats.general.opScoreBadge}
                </div>
                )}
              </div>

              <div className="stats">
                <div className="level">레벨 {game.champion.level}</div>
                <div className="cs">
                  <div className="" style={{position: 'relative'}}>{game.stats.general.cs} ({game.stats.general.csPerMin})</div>CS
                </div>
                <div className="kill-participantion">
                  <div className="" style={{position: 'relative'}}>킬관여 {game.stats.general.contributionForKillRate}</div>
                </div>
                <div className="mmr"><span>매치 평균</span><br/><b>{game.tierRankShort}</b></div>
              </div>

              <div className="items">
                <div>
                  <div className="item">
                    <ul>
                      {game.items && game.items.slice(0, game.items.length-1).map((item, idx) => (
                      <li key={idx}>
                        <div className="" style={{position: 'relative'}}>
                          <div data-tip={getItemInfo(item.imageUrl)} data-html={true} data-for={`toolTip_${game.gameId}_${idx}`} data-place='top'>
                            <img src={item.imageUrl} alt={"item" + idx}/>
                          </div>
                          <ReactTooltip id={`toolTip_${game.gameId}_${idx}`} />
                        </div>
                      </li>
                      ))}
                    </ul>
                    <div>
                      <div className="ward">
                        <div className="" style={{position: 'relative'}}>
                          <div data-tip={getItemInfo(game.items[game.items.length-1].imageUrl)} data-html={true} data-for={`toolTip_${game.gameId}_${game.items.length-1}`} data-place='top'>
                            <img src={game.items[game.items.length-1].imageUrl} alt="ward"/>
                          </div>
                          <ReactTooltip id={`toolTip_${game.gameId}_${game.items.length-1}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="control">제어와드 {game.stats.ward.visionWardsBought}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}