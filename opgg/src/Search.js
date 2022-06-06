import React, { useCallback, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';

import 'react-bootstrap-typeahead/css/Typeahead.css';

const CACHE = {};
const PER_PAGE = 50;
const SEARCH_URI = 'https://codingtest.op.gg/api/summoner';

function makeAndHandleRequest(query, page = 1) {
  return axios.get(`${SEARCH_URI}/${query}`)
    .then((resp) => resp.json())
    .then(({ items, total_count }) => {
      const options = items.map((i) => ({
        avatar_url: i.avatar_url,
        id: i.id,
        login: i.login,
      }));
      return { options, total_count };
    });
}

export default function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');

  const handleInputChange = (q) => {
    setQuery(q);
  };

  const handlePagination = (e, shownResults) => {
    const cachedQuery = CACHE[query];

    // Don't make another request if:
    // - the cached results exceed the shown results
    // - we've already fetched all possible results
    if (
      cachedQuery.options.length > shownResults ||
      cachedQuery.options.length === cachedQuery.total_count
    ) {
      return;
    }

    setIsLoading(true);

    const page = cachedQuery.page + 1;

    makeAndHandleRequest(query, page).then((resp) => {
      const options = cachedQuery.options.concat(resp.options);
      CACHE[query] = { ...cachedQuery, options, page };

      setIsLoading(false);
      setOptions(options);
    });
  };

  // `handleInputChange` updates state and triggers a re-render, so
  // use `useCallback` to prevent the debounced search handler from
  // being cancelled.
  const handleSearch = useCallback((q) => {
    if (CACHE[q]) {
      setOptions(CACHE[q].options);
      return;
    }

    setIsLoading(true);
    makeAndHandleRequest(q).then((resp) => {
      CACHE[q] = { ...resp, page: 1 };

      setIsLoading(false);
      setOptions(resp.options);
    });
  }, []);

  return (
    <AsyncTypeahead
      id="async-pagination-example"
      isLoading={isLoading}
      labelKey="login"
      maxResults={PER_PAGE - 1}
      minLength={2}
      onInputChange={handleInputChange}
      onPaginate={handlePagination}
      onSearch={handleSearch}
      options={options}
      paginate
      placeholder="Search for a Github user..."
      renderMenuItemChildren={(option) => (
        <div key={option.id}>
          <img
            alt={option.login}
            src={option.avatar_url}
            style={{
              height: '24px',
              marginRight: '10px',
              width: '24px',
            }}
          />
          <span>{option.login}</span>
        </div>
      )}
      useCache={false}
    />
  );
}
