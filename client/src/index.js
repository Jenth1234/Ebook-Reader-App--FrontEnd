import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Account from "./routes/Account";
import NotFound from "./routes/NotFound";
import ListBooks from "./routes/ListBooks";
import Login from "./components/login/Login";
import Test from "./routes/Test";


import "./index.css";

// const firebaseConfig ={};
// firebase.initializeApp(firebaseConfig)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<App />}>
          {/* <Route path="loginadmin" element={<Loginadmin />} /> */}

          <Route path="test" element={<Test />} />
          <Route path="account" element={<Account />} />
          <Route path="ListBooks" element={<ListBooks />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
