import React, { useState } from 'react';
import { db, storage } from '../components/firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import Navbar from './Navbar';

const Khabar = () => {
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
      <Navbar />
      <h2>All News</h2> <button onClick={getNews}>Refresh News</button>
      {selectedNews && (
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '40%', alignItems: 'left' }}>{selectedNews.title}</th>
              <th style={{ alignItems: 'right' }}><button onClick={() => setSelectedNews(null)}>Close</button></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ alignItems: 'left' }}>
                {selectedNews.content}
              </td>
              <td style={{ alignItems: 'right' }}><img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                width={"100dvw"}
                height={"100dvh"}
              /></td>
            </tr>
          </tbody>
        </table>
      )}
      <ul>
        {news.map((newsItem) => (
          <li key={newsItem.id}>
            <h3>{newsItem.title}</h3>
            <p>{newsItem.content.split('\n')[0]}...</p>
            <button onClick={() => handleReadMore(newsItem)}>Read More</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Khabar;