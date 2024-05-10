// import { useState, useEffect } from 'react';
// import axios from "axios";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { imageDb } from "../utility/firebase/Config";
// import Formtable from '../components/Formtable';
// import { ImagetoBase64 } from "../utility/ImagetoBase64";
// axios.defaults.baseURL = "http://localhost:8080/";

// export default function ListBooks() {
//   const [addSection, setAddSection] = useState(false);
//   const [editSection, setEditSection] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     author: "",
//     genre: "",
//     description: "",
//     image: "",
//     file: "",
//   });

//   const [formDataEdit, setFormDataEdit] = useState({
//     title: "",
//     author: "",
//     genre: "",
//     description: "",
//     image: "",
//     file: "",
//     _id: ""
//   });

//   const [dataList, setDataList] = useState([]);

//   const handleOnChange = (e) => {
//     const { value, name } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const uploadImage = async (e) => {
//     const data = await ImagetoBase64(e.target.files[0]);
//     setFormData((prev) => ({
//       ...prev,
//       image: data,
//     }));
//   };

//   const uploadFileToFirebase = async (file) => {
//     const fileRef = ref(imageDb, `pdfs/${file.name}`);
//     try {
//       const snapshot = await uploadBytes(fileRef, file);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       console.log(downloadURL);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file to Firebase:", error);
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fileURL = await uploadFileToFirebase(formData.file);
//     if (fileURL) {
//       const dataToSend = { ...formData, file: fileURL };
//       const data = await axios.post("/books", dataToSend);
//       if (data.data.success) {
//         setAddSection(false);
//         alert(data.data.message);
//         getFetchData();
//         setFormData({
//           title: "",
//           author: "",
//           genre: "",
//           description: "",
//           image: "",
//           file: "",
//         });
//       }
//     } else {
//       alert("Error uploading file to Firebase");
//     }
//   };

//   const getFetchData = async () => {
//     const data = await axios.get("/books");
//     if (data.data.success) {
//       setDataList(data.data.data);
//     }
//   };

//   useEffect(() => {
//     getFetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     const data = await axios.delete("/books/" + id);
//     if (data.data.success) {
//       getFetchData();
//       alert(data.data.message);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const data = await axios.put("/books", formDataEdit);
//     if (data.data.success) {
//       getFetchData();
//       alert(data.data.message);
//       setEditSection(false);
//     }
//   };

//   const handleEditOnChange = async (e) => {
//     const { value, name } = e.target;
//     setFormDataEdit((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleEdit = (el) => {
//     setFormDataEdit(el);
//     setEditSection(true);
//   };


//   //thanh tìm kiếm
  
  

//   return (
//     <div className="container">
     
//       <button className="btn btn-add" onClick={() => setAddSection(true)}>
//         Add
//       </button>
//       {addSection && (
//         <Formtable
//           handleSubmit={handleSubmit}
//           handleOnChange={handleOnChange}
//           handleclose={() => setAddSection(false)}
//           handleImage={uploadImage}
//           rest={formData}
//         />
//       )}
//       {editSection && (
//         <Formtable
//           handleSubmit={handleUpdate}
//           handleOnChange={handleEditOnChange}
//           handleclose={() => setEditSection(false)}
//           rest={formDataEdit}
//         />
//       )}
//       <div className="tableContainer">
//         <table>
//           <thead>
//             <tr>
//               <th>Title:</th>
//               <th>Author:</th>
//               <th>Genre:</th>
//               <th>Description:</th>
//               <th>Image:</th>
//               <th>File:</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dataList[0] ? (
//               dataList.map((el) => (
//                 <tr key={el._id}>
//                   <td>{el.title}</td>
//                   <td>{el.author}</td>
//                   <td>{el.genre}</td>
//                   <td>{el.description}</td>
//                   <td>
//                     <img src={el.image} style={{ width: "100%" }} alt="book" />
//                   </td>
//                   <td>{el.file}</td>
//                   <td>
//                     <button
//                       className="btn btn-edit"
//                       onClick={() => handleEdit(el)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-delete"
//                       onClick={() => handleDelete(el._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center" }}>
//                   No data
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../utility/firebase/Config";
import Formtable from '../components/Formtable';
import { ImagetoBase64 } from "../utility/ImagetoBase64";
axios.defaults.baseURL = "http://localhost:8080/";

export default function ListBooks() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    image: "",
    file: "",
    view: ""
  });

  const [formDataEdit, setFormDataEdit] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    image: "",
    file: "",
    view:"",
    _id: ""
  });
 
  const [dataList, setDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    setFormData((prev) => ({
      ...prev,
      image: data,
    }));
  };

  const uploadFileToFirebase = async (file) => {
    const fileRef = ref(imageDb, `pdfs/${file.name}`);
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file to Firebase:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileURL = await uploadFileToFirebase(formData.file);
    if (fileURL) {
      const dataToSend = { ...formData, file: fileURL };
      const data = await axios.post("/books", dataToSend);
      if (data.data.success) {
        setAddSection(false);
        alert(data.data.message);
        getFetchData();
        setFormData({
          title: "",
          author: "",
          genre: "",
          description: "",
          image: "",
          file: "",
          view:""
        });
      }
    } else {
      alert("Error uploading file to Firebase");
    }
  };

  const getFetchData = async () => {
    const data = await axios.get("/books");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/books/" + id);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/books", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  const handleEditOnChange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  //giới hạn 30 kí tự
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };
  //mở rộng khi click vào
  const [expandedRowId, setExpandedRowId] = useState(null);
  const handleRowClick = (id) => {
    if (expandedRowId === id) {
      // Nếu đã mở rộng hàng này, đóng nó lại
      setExpandedRowId(null);
    } else {
      // Nếu chưa mở rộng hàng này, mở rộng nó
      setExpandedRowId(id);
    }
  };
  
  // tìm kiếm trên product
  const filteredDataList = dataList.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  return (
    <div className="container">
       <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <button className="btn btn-add" onClick={() => setAddSection(true)}>
        Add
      </button>
      {addSection && (
        <Formtable
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          handleclose={() => setAddSection(false)}
          handleImage={uploadImage}
          rest={formData}
        />
      )}
      {editSection && (
        <Formtable
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          handleclose={() => setEditSection(false)}
          rest={formDataEdit}
        />
      )}
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Title:</th>
              <th>Author:</th>
              <th>Genre:</th>
              <th>Description:</th>
              <th>Image:</th>
              <th>File:</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataList.length > 0 ? (
              filteredDataList.map((el) => (
                <React.Fragment key={el._id}>
                  <tr onClick={() => handleRowClick(el._id)}>
                    <td>{el.title}</td>
                    <td>{el.author}</td>
                    <td>{el.genre}</td>
                    <td>
  {expandedRowId === el._id ? el.description : (el.description && truncateText(el.description, 30))}
</td>
                    <td>
                      <img src={el.image} style={{ width: "100%" }} alt="book" />
                    </td>
                    <td>
                      {expandedRowId === el._id ? el.file : (el.file && truncateText(el.file, 30))}
                    </td>
                    <td>
                    <td>{el.view}</td>
                    </td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(el)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(el._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}
