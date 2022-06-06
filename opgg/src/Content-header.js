import React from 'react';
import './Content-header.css'

export default function ContentHeader(props) {
  const summoner = props.data;

  const borderStyle = {
    backgroundImage: `url(${summoner.profileBorderImageUrl})`
  }
  const backImage = {
    backgroundImage: `url(${summoner.profileBackgroundImageUrl})`
  }

  return (
    <div className="content-header">
      <ul>
        {summoner.previousTiers &&
          summoner.previousTiers.reverse().map((prev, idx) => (
          <li key={idx}>
            <div>
              <b>S{prev.season}</b>{prev.tier}
            </div>
          </li>
        ))}
      </ul>
      <div className="face">
        <div className="profile-icon">
          <div className="border-image" style={borderStyle}>
            <img src={summoner.profileImageUrl} alt={summoner.name} />
            <span className="level" style={backImage}>{summoner.level}</span>
          </div>
        </div>
      </div>
      <div className="profile">
        <div className="info">
          <span>{summoner.name}</span>
        </div>
        <div className="rank">
          <span>
            레더 랭킹<b>{summoner.ladderRank && summoner.ladderRank.rank}</b>위 (상위<span>{summoner.ladderRank && summoner.ladderRank.rankPercentOfTop}%</span>)
          </span>
        </div>
      </div>
    </div>
  );
}