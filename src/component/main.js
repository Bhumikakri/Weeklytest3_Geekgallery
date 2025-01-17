import './main.css';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component' ;

const Main = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData();
  }, [query]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/?page=${page}&per_page=20&client_id=vIAl2xMMUNuviL04B0Apjzf5h31GCEvTFd9zn_Bi1Jg${
          query ? `&query=${query}` : ''
        }`
      );
      const data = await response.json();

      // Update items with new data
      setItems(prevItems => [...prevItems, ...data]);

      // Check if there is more data available
      if (data.length === 0) {
        setHasMore(false);
      }

      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setItems([]);
    fetchData();
  };

  const handleInputChange = event => {
    setQuery(event.target.value);
  };

  return (
    <div className="container">
      <div className="heading">
        <h1>GeekGallery</h1>
        <div className="inputs">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search images..."
          />
          <button onClick={handleSearch}>Click</button>
        </div>
      </div>
      <div className="main">
        <InfiniteScroll
          className="infinite"
          dataLength={items.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
        >
          {items.map((item, index) => (
            <div key={index} className="imagecontainer">
              <img src={item.urls.small} alt={item.alt_description} />
              <h2>{item.user.name}</h2>
              <p className="p1">{item.description}</p>
              <p className="p2">{item.created_at}</p>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Main;
