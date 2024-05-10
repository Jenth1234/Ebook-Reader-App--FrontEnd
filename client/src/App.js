import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, Link } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080/';

function App() {

  return (
    <div>
      <h1>BookMW</h1>
      <nav className="main-nav">
        <Link to="/admin/Test">Yêu thích</Link>
        <Link to="/admin/ListBooks">Sách</Link>
        <Link to="/admin/account">Tài khoản</Link>
      </nav>
      <Outlet />
      {/*    */}
    </div>
    
  );
}

export default App;
