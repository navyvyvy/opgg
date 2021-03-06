import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const DEBOUNCE_TIME = 500;
const MAX_USED_LENGTH = 4;
const SUMMONER_INFO_URL = "https://codingtest.op.gg/api/summoner/";

const fetchData = async (query) => {
  let url = `${SUMMONER_INFO_URL}${query}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch(err) {
    console.error(err);
  }
}

export default function Header() {
  const [used, setUsed] = useState([]);
  const [isUsed, setIsUsed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [summoner, setSummoner] = useState([]);

  const { summonerName } = useParams();

  const formRef = useRef();

  useEffect(() => {
    //document.addEventListener('mousedown', clickOutSide);
    fetchData(summonerName).then(res => {
      setSummoner(res.summoner);
    });

    return () => {
      //document.removeEventListener('mousedown', clickOutSide);
    }
  }, [summonerName])

  const clickOutSide = e => {
    if (!formRef.current.contains(e.target)) {
      setIsUsed(false);
      setSuggestions([]);
    }
  }

  let timer = null;
  const handleSearch = e => {
    const { value } = e.target;

    clearTimeout(timer);

    setIsUsed(false);
    setIsLoading(true);
    setSuggestions([]);

    if (value !== null && value !== "") {
      timer = setTimeout(() => {
        fetchData(value).then(res => {
          setSuggestions(res.summoner);
          setIsLoading(false);
        })
      }, DEBOUNCE_TIME);
    }
    else {
      setIsLoading(false);
      setIsUsed(true);
    }
  }

  let navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (e.target.summonerName.value !== "") {
      let arr = [...(used.length > MAX_USED_LENGTH ? used.slice(0, -1) : used)];

      arr.unshift(e.target.summonerName.value);
      setUsed(arr);

      navigate(`/${e.target.summonerName.value}`);
    }
  }

  const delUsed = (idx) => {
    let arr = [...used];

    arr.splice(idx, 1);
    setUsed(arr);
  }

  return (
    <div className="Rectangle-4">
      <nav className="nav-container">
        <form autoComplete="off"
              className="Rectangle-5"
              onSubmit={handleSubmit}
              ref={formRef}
        >
          <input
            type="text"
            id="summonerName"
            name="summonerName"
            placeholder="????????????, ?????????..."
            autoComplete="off"
            className="search-input"
            onChange={handleSearch}
            onClick={handleSearch}
          />
          <button
            type="submit"
            className="search-btn">
            <img src="https://s-lol-web.op.gg/images/icon/icon-gg.svg?v=1654157118862" alt="search" height="14"></img>
            {isLoading &&(
              <span>...</span>
            )}
          </button>

          {used.length > 0 && isUsed && (
            <div className="ac-container">
              <div className="ac-list">
                <div>
                  <button className="ac-btn">????????????</button>
                  <button className="ac-btn ac-btn-disabled">????????????</button>
                </div>
                <ul>
                  {used.map((i, idx) => (
                    <li className="ac-row" key={idx}>
                      <button className="ac-name" type="submit">{i}</button>
                      <button
                        type="button"
                        className="ac-btn-del"
                        data-target={idx}
                        onClick={delUsed.bind(this, idx)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {suggestions.name != null && summoner.name !== suggestions.name && !isUsed && (
            <div className="ac-container">
              <div className="ac-list">
                <ul className="ac-row">
                  <li className="sg-link">
                    <div className="sg-icon">
                      <img src={suggestions.profileImageUrl} alt={suggestions.name}/>
                    </div>
                    <div className="sg-info">
                      <div className="sg-name">
                        <button type="submit">{suggestions.name}</button>
                      </div>
                      <div className="sg-desc">{suggestions.leagues[0].tierRank.string}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </form>
      </nav>
    </div>
  );
}