import './Content-body-left-top.css';

export default function ContentBodyLeftTop(props) {
  const summoner = props.data;

  return (
    <>
      {summoner.leagues &&
        summoner.leagues.map((league, idx) => (
        <div className="tier" key={idx}>
          <div className="wrapper">
            <div className="media">
              <img src={league.tierRank.imageUrl} alt={summoner.leagues}/>
            </div>
            <div className="info">
              <div className="type">{league.tierRank.name}</div>
              <div className="tier-rank">{league.tierRank.tier}</div>
              <div className="tier-info">
                <span className="lp">{league.tierRank.lp} LP</span>&nbsp;/&nbsp;
                <span className="win-lose">
                  {league.wins}승 {league.losses}패<br/>
                  승률 {(league.wins / (league.wins+league.losses)* 100.0).toFixed
                  (0)} %
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}