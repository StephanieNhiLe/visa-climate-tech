import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MonthlySpendChart from '../components/dataVisualization/MonthlySpendChart'   
import ChatBox from '../components/chatbox'
import Databox from '../components/dataVisualization/Databox'
import DataList from '../components/recombox'

function Dashboard() {
  return (
    <div>
      <h1 className='flex font-bold text-3xl text-teal-950 mt-5 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'>Dashboard</h1>
      <div className="flex flex-row justify-around ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6">

        {/* Financial Trend Section */}
        <div className="flex flex-col space-between ml-150% w-50 md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-semibold mb-4">Spending Planner</h1>
          <h2 className='text-slate-400 font-semibold'>Spending Summary</h2>
          <MonthlySpendChart /> 
          <div className="flex-grow text-wrap flex items-center justify-center">
            <p>Content for Financial Trend</p>
          </div>
        </div>

        {/* Carbon Footprint AI Prompt Facts Section */}
        <div className="flex flex-col space-between w-50 ml-120% md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-semibold mb-4">Carbon Footprint AI Prompt Facts</h1>
          <ChatBox />
          <Databox />
          <div className="flex-grow text-wrap flex items-center justify-center">
            {/* Insert your Carbon Footprint AI Prompt Facts content here */}
            <p>Content for Carbon Footprint AI Prompt Facts</p>
          </div>
        </div>

        {/* Recommerce Business Suggestions Section */}
        <div className="flex flex-col space-between items-center w-50 md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recommerce Business Suggestions</h2>
            <DataList />
          <div className="flex-grow text-wrap flex items-center justify-center">
            {/* Insert your Recommerce Business Suggestions content here */}
            <p>Content for Recommerce Business Suggestions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard