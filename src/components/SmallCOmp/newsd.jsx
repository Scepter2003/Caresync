import React, { useState } from 'react';
import { db,storage } from '../firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import Navbard from './Navbard';


const NewsPaged = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const getNews = async () => {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const newsData = [];
    querySnapshot.forEach((doc) => {
      newsData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setNews(newsData);
  };

  const handleReadMore = async (news) => {
    const imageRef = ref(storage, news.imageUrl);
    const url = await getDownloadURL(imageRef);
    setSelectedNews({
      ...news,
      imageUrl: url,
    });
  };

  return (
    <div>
      <Navbard />
      <h2>All News</h2> <button onClick={getNews}>Refresh News</button>
      <ul>
        {news.map((newsItem) => (
          <li key={newsItem.id}>
            <h3>{newsItem.title}</h3>
            <p>{newsItem.content.split('\n')[0]}...</p>
            <button onClick={() => handleReadMore(newsItem)}>Read More</button>
          </li>
        ))}
      </ul>
      {selectedNews && (
        <div>
          <h2>{selectedNews.title}</h2>
          <img
            src={selectedNews.imageUrl}
            alt={selectedNews.title}
            width={300}
            height={200}
          />
          <p>{selectedNews.content}</p>
          <button onClick={() => setSelectedNews(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NewsPaged;
