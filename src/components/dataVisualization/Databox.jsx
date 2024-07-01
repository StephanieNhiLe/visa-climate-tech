import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mockweek from '../mockdata_weekly.json';
import mockmonth from '../mockdata_monthly.json';
import { Flex } from '@tremor/react';

function Databox() {
  const [weeklySpending, setWeeklySpending] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState({ total_spending: 0 });

  useEffect(() => {
    // Set the initial state using mock data
    setWeeklySpending(mockweek.weekly_spending);
    setMonthlySpending(mockmonth.monthly_spending);
  }, []);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 550,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="relative flex flex-col py-12 px-14">
        <h2>Weekly Spending</h2>
        <Slider {...settings}>
          {weeklySpending.map((week, index) => (
            <div key={index} className="h-[300px] p-4 mt-5">
              <div className="border border-transparent rounded flex flex-col justify-center p-4 font-semibold text-tremor-content items-center shadow h-full">
                <span className="font-extrabold">Date: {week.date}</span>
                <span>Food: {week.Food}</span>
                <span>Entertainment: {week.Entertainment}</span>
                <span>Transportation: {week.Transportation}</span>
                <span>Wellness: {week.wellness}</span>
                <span>Shopping: {week.shopping}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className=" flex flex-col py-12 px-14">
        <h2>Carbon Footprint Analysis</h2>
          <div className=" h-[150px] p-4 m-5">
          <Slider {...settings}>
            <div className="border border-black rounded flexflex-col justify-center p-4 text-tremor-content items-center h-full">
              <span className ="flex-col">Carbon Footprint: {monthlySpending.carbon_footprint}</span>
              <span className ="flex-col">Total Spending: {monthlySpending.total_spending}</span>
            </div>
          </Slider>
          </div>
      </div>
    </>
  );
}

export default Databox;
