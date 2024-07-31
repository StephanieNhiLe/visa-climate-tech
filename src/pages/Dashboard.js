import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MonthlySpendChart from '../components/dataVisualization/MonthlySpendChart'   
import SpendCategoryChart from '../components/dataVisualization/SpendCategoryChart'
import ChatBox from '../components/chatbox'
import Databox from '../components/dataVisualization/Databox'
import DataList from '../components/recombox'

function Dashboard() {
  return (
    <div>
      <h1 className='flex font-bold text-3xl text-teal-950 mt-5 ml-60 pl-6 space-y-6 md:space-y-0 md:space-x-6'>Dashboard</h1>
      <div className="flex flex-row justify-around ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex flex-col space-between ml-150% w-50 md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md gap-5">
          <h1 className="text-2xl font-semibold mb-4">Spending Planner</h1>
          <MonthlySpendChart accountId = '5a73582adf954cf6b3db6cc97bedccd9'/> 
          <SpendCategoryChart accountId = '5a73582adf954cf6b3db6cc97bedccd9'/>
          <div className="flex-grow text-wrap flex items-center justify-center">
            <p></p>
          </div>
        </div>

        <div className="flex flex-col space-between w-50 ml-120% md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Carbon Footprint AI Prompt Facts</h1>
          <ChatBox />
          <Databox />
          <div className="flex-grow text-wrap flex items-center justify-center">
            <p>Content for Carbon Footprint AI Prompt Facts</p>
          </div>
        </div>

        <div className="flex flex-col space-between items-center w-50 md:w-1/3 h-200 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recommerce Business Suggestions</h2>
            <DataList />
          <div className="flex-grow text-wrap flex items-center justify-center">
            <p>Content for Recommerce Business Suggestions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
