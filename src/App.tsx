import React from 'react';
import './App.css';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <h1>AI 聊天助手</h1>
        <p>与 AI 进行智能对话</p>
      </div>
      <ChatBox />
    </div>
  );
}

export default App;