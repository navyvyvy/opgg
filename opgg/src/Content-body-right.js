import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import './Content-body-right.css';

export default function ContentBodyRight(props) {
  const data = props.games;
  const summary = props.summary;
  const positions = props.positions;

  const [games, setGames] = useState([]);

  useEffect(() => {
    let g = _.groupBy(data, 'gameType');
    g['전체'] = data;
    setGames(g);
  }, [data]);

  return (
    <>
      <div>
        <ul>
        {games.length > 0 && Object.keys(games).map(key => (
          <li>key</li>
        ))}
        </ul>
      </div>
    </>
  );
}