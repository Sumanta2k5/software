import { Navigate,Route, Routes} from 'react-router-dom';
import Home from './pages/Home';  
import Login from './pages/Login';
import Signup from './pages/Signup';
import Internships from './pages/Internships';
import Hackathons from './pages/Hackathons';  
import Jobs from './pages/Jobs';
import Register from './pages/Register';
import ViewProfile from './pages/viewProfile';
import EditProfile from './pages/editProfile';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to ='/login'/>} />
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />   
    <Route path="/internships" element={<Internships />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        
      </Routes>
    </div>
  );
}

export default App;
