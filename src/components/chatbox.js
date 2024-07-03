import React, { useState } from "react";
import axios from "axios";

function ChatBox() {
  const [messages, setMessages] = useState(["Loading.................."]);

  const fetchPrompt = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/promptAI");
      console.log(response.data.message);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="chat-container flex flex-col h-100 border border-gray-300 rounded-lg">
      <div className="chat-header p-4 border-b border-gray-300 bg-gray-100">
        <h2 className="text-slate-400 font-semibold">AI Assistant</h2>
      </div>
      <div className="chat-messages flex-1 text-wrap overflow-auto p-4 font-mono">
        {messages.map((message, index) => (
          <div key={index} className="chat-message mb-2">
            {
              "Here are some insights and recommendations for a frugal family who recently made purchases including an Iced Coffee, Air Conditioner, gas, and a book, with a carbon footprint of 124.5, a household size of 3, and using the train for transportation:\n\nEnvironmental Fact:\nDid you know that air conditioning can significantly contribute to your carbon footprint? In the UK, AC units release a substantial amount of carbon emissions, particularly if they run on fossil fuels. Being mindful of your AC usage and seeking alternative ways to stay cool can greatly reduce your environmental impact.\n\nRecommendations to Reduce Your Carbon Footprint:\n\n1. Energy-Efficient Cooling Alternatives:\nConsider using fans instead of the air conditioner to reduce energy consumption. Ceiling fans and portable fans are more energy-efficient and can help keep your home cool without a high carbon footprint.\n\n2. Sustainable Coffee Choices:\nWhen purchasing beverages like Iced Coffee, opt for reusable cups or bottles instead of single-use plastic ones. This simple switch can significantly reduce plastic waste and contribute to a greener environment.\n\n3. Public Transport Benefits:\nUsing the train for your commute is an excellent eco-friendly choice. Trains produce significantly lower carbon emissions per passenger compared to cars, making them an environmentally friendly mode of transportation.\n\n4. Efficient Reading Practices:\nFor book purchases, consider borrowing books from the library or buying second-hand books instead of new ones. This can reduce the demand for paper production and lower carbon emissions associated with book manufacturing.\n\n5. Low-Impact Transportation: \n Continue using public transport like the train as your primary mode of travel. Trains are one of the most sustainable forms of transportation, emitting fewer greenhouse gases per passenger mile traveled compared to cars.\n\nBy being conscious of your energy consumption, transportation choices, and purchasing habits, you can reduce your carbon footprint and contribute to a more sustainable lifestyle for your frugal family. Every small change adds up to a significant impact on the environment."
            }
          </div>
        ))}
      </div>
      <div className="chat-footer p-4 border-t border-gray-300 bg-gray-100 flex"></div>
    </div>
  );
}

export default ChatBox;
