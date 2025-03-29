import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';
import Header from "../Header";
import "../../homechat.css"; // Import the CSS file

const Home = () => {
  return (
    <div className='main'>
      <Header />
      <div className='chat-container'>
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
