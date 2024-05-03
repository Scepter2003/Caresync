import React, { useState } from 'react';
import { db, storage } from '../components/firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import  { collection, query, where, getDocs , doc, setDoc} from 'firebase/firestore';

import { auth } from '../components/firebase/firebase';

const logout = () => auth.signOut();
const Addnews = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!title || !content || !image) {
          setError('All fields are required');
          return;
        }
      
        setUploading(true);
        setError(null);
      
        try {
          const imageRef = ref(storage, `images/${image.name + uuidv4()}`);
          const uploadTask = uploadBytesResumable(imageRef, image);
      
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          }, (error) => {
            setError(error);
            setUploading(false);
          }, async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
      
            // Use setDoc to add a new document to the 'news' collection
            await setDoc(doc(db, 'news', uuidv4()), {
              title,
              content,
              imageUrl: url,
              timestamp: new Date(),
            });
      
            setUploading(false);
            setTitle('');
            setContent('');
            setImage(null);
          });
        } catch (err) {
          setError(err.message);
          setUploading(false);
        }
      };
  
    return (
      <div>
        <h2>Add News</h2> <button onClick={logout}> Logout</button>
        <form onSubmit={handleSubmit} style={{margin:"10% 10%", border:"1px solid", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Content:
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          <label>
            Image:
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </label>
          <button type="submit" disabled={uploading} style={{width:"15%", alignItems:"center"}}>Add News</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    );
  };

  export default Addnews;