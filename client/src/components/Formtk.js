import React from 'react'
import "../App.css"
import { MdClose } from 'react-icons/md'

const Formtk = ({handleSubmit,handleOnChange,handleclose,rest}) => {
  return (
    <div className="addContainer">
   
            <form onSubmit={handleSubmit}>
            <div className="close-btn" onClick={handleclose}><MdClose/></div>
              <label htmlFor="account">Tài Khoản : </label>
              <input type="text" id="account" name="account" onChange={handleOnChange} value={rest.account}/>

              <label htmlFor="tokenUser">Token : </label>
              <input type="text" id="tokenUser" name="tokenUser" onChange={handleOnChange} value={rest.tokenUser}/>

              <label htmlFor="password">Mật khẩu : </label>
              <input type="text" id="password" name="password" onChange={handleOnChange} value={rest.password}/>

              <label htmlFor="ten">Tên : </label>
              <input type="text" id="ten" name="ten" onChange={handleOnChange} value={rest.ten}/>

              <label htmlFor="email">gmail : </label>
              <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email}/>
             
             
              <label htmlFor="sdt">Số Điện Thoại : </label>
              <input type="text" id="sdt" name="sdt" onChange={handleOnChange} value={rest.sdt} />

              <label htmlFor="yt">Yêu thích : </label>
              <input type="text" id="yt" name="yt" onChange={handleOnChange} value={rest.yt} />
             
            
              
              

              <button className="btn">Submit</button>
            </form>
    </div>
  )
}

export default Formtk ;