import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard'
import BranchManage from './pages/BranchManage'
import CommitHistory from './pages/CommitHistory'
import Repository from './pages/Repository'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='branchManage' element={<BranchManage/>}/>
          <Route path='commitHistory' element={<CommitHistory/>}/>
          <Route path='repository' element={<Repository/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
