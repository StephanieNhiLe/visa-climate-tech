import React, { useState } from 'react';
import axios from 'axios';


function ChatBox(){
  const [messages, setMessages] = useState(['Loading..................']);

  const fetchPrompt = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:5000/api/promptAI');
      console.log(response.data.message);
      setMessages(response.data.messages);
    }
    catch (error) {
      console.error('Error fetching data:',error);
    }
  };

  return (
    <div className="chat-container flex flex-col h-100 border border-gray-300 rounded-lg">
      <div className="chat-header p-4 border-b border-gray-300 bg-gray-100">
      <h2 className='text-slate-400 font-semibold'>AI Assistant</h2>
      </div>
      <div className="chat-messages flex-1 text-wrap overflow-auto p-4 font-mono">
        {messages.map((message, index) => (
          <div key={index} className="chat-message mb-2">
            {message}
          </div>
        ))}
      </div>
      <div className="chat-footer p-4 border-t border-gray-300 bg-gray-100 flex">
      </div>
    </div>
  );
};

export default ChatBox;
