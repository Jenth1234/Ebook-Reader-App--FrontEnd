import "../App.css";
import { MdClose } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { imageDb } from "../utility/firebase/Config";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const Formtable = ({ handleSubmit, handleOnChange, handleclose, handleImage, rest }) => {
  const [pdf, setPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState([]);

  const handleUpload = async () => {
    if (pdf) {
      const storageRef = ref(imageDb, `pdfs/${pdf.name}`);
      try {
        await uploadBytes(storageRef, pdf);
        console.log('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  useEffect(() => {
    listAll(ref(imageDb, "pdfs"))
      .then((result) => {
        result.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((url) => {
            setPdfUrl((prevUrls) => [...prevUrls, url]);
          });
        });
      })
      .catch((error) => {
        console.error("Error listing PDFs: ", error);
      });
  }, []);

  return (
    <div className="addContainer">
      <form onSubmit={handleSubmit}>
        <div className="close-btn" onClick={handleclose}>
          <MdClose />
        </div>
        <label htmlFor="title">Title : </label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={handleOnChange}
          value={rest.title}
        />

        <label htmlFor="author">Author : </label>
        <input
          type="text"
          id="author"
          name="author"
          onChange={handleOnChange}
          value={rest.author}
        />

        <label htmlFor="genre">Genre : </label>
        <input
          type="text"
          id="genre"
          name="genre"
          onChange={handleOnChange}
          value={rest.genre}
        />

        <label htmlFor="description">Description : </label>
        <input
          type="text"
          id="description"
          name="description"
          onChange={handleOnChange}
          value={rest.description}
        />
     
    

        <label htmlFor="image">Image : </label>
        <input type={"file"} id="image" name="image" onChange={handleImage} accept="image/*" />

        <label htmlFor="file">File : </label>
        <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
        <label htmlFor="genre">View : </label>
        <input
          type="text"
          id="view"
          name="view"
          onChange={handleOnChange}
          value={rest.view}
        />
        <button className="btn" onClick={handleUpload}>Upload </button>
      </form>
    </div>
  );
};

export default Formtable;
