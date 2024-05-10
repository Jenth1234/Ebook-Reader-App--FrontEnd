
import { useState, useEffect } from 'react';
import axios from "axios";

import Formtk from '../components/Formtk'; 
import { BrowserRouter as Router } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:8080/";

export default function Account() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    account : "",
    tokenUser: "",
    password : "",
     ten: "",
    email : "",
    sdt: "",
  });

  const [formDataEdit, setFormDataEdit] = useState({
    account : "",
    tokenUser:"",
    password : "",
     ten: "",
    email : "",
    sdt: "",
    _id: ""
  });
  
  const [dataList, setDataList] = useState([]);

  // const uploadImage = async (e) => {
  //   const data = await ImagetoBase64(e.target.files[0]);
  //   setFormData((prev) => ({
  //     ...prev,
  //     image: data,
  //   }));
  // };

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("/accounts", formData);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
      setFormData({
        account : "",
        password : "",
        tokenUser:"",
        ten: "",
        email : "",
        sdt: "",
      });
    }
  };

  const getFetchData = async () => {
    const data = await axios.get("/accounts");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/accounts/" + id);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/accounts", formDataEdit);
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

  return (

    
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        {addSection && (
          <Formtk
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)}
           
            rest={formData}
          />
        )}
        {editSection && (
          <Formtk
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />  
        )}
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Tài khoản:</th>
                <th>Token:</th>
                <th>Mật Khẩu:</th>
                <th>Tên:</th>
                <th>Email:</th>
                <th>Số Điện Thoại</th>
                <th>Yêu thích</th>
              
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el) => (
                  <tr key={el._id}>
                    <td>{el.account}</td>
                    <td>{el.tokenUser}</td>
                    <td>{el.password}</td>
                    <td>{el.ten}</td>
                    <td>{el.email}</td>
                    <td>{el.sdt}</td>
                    <td></td>
                  
                    <td>
                      <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                      <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: "center"}}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
  );
}

// export default ListBooks;
