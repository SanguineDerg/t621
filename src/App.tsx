import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Feed } from './features/feed/Feed';
// import { AccountList } from './features/accounts/AccountList';
// import { AccountAddForm } from './features/accounts/AccountAddForm';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/posts" />} />
          <Route path="posts">
            <Route index element={<Feed />} />
          </Route>
          {/* <Route path="accounts">
            <Route index element={<AccountList />} />
            <Route path="add" element={<AccountAddForm />} />
          </Route> */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
