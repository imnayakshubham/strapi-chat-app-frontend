import './App.css'
import { Route, Routes } from 'react-router-dom';
import { NoMatch } from './components/NoMatch/NoMatch';
import { ChatContainer } from './components/ChatContainer/ChatContainer';
import { Login } from './components/login/Login';
import { Signup } from './components/signup/Signup';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatContainer />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  )
}

export default App
