// import React from "react";
import { Card, Metric, Text, Title, DonutChart, LineChart } from "@tremor/react";
import mockweek from "../mockdata_weekly.json";
import mockmonth from "../mockdata_monthly.json";

const weeklyData = mockweek.weekly_spending.map(({ Food, Transportation, shopping, wellness, Entertainment, date }) => {
  const monthlyData = mockmonth.monthly_spending.find(month => month.date === date);
  return {
    date,
    weekly: { Food, Transportation, shopping, wellness, Entertainment }, 
    monthly: {
      Food: monthlyData?.Food ?? 0, 
      Transportation: monthlyData?.Transportation ?? 0, 
      shopping: monthlyData?.shopping ?? 0, 
      wellness: monthlyData?.wellness ?? 0, 
      Entertainment: monthlyData?.Entertainment ?? 0
    }
  }
});

function addCommasToNumber(number: number) {
  // Convert the number to a string
  let numString = number.toString();
  
  // Use regex to add commas to the string representation of the number
  numString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return numString;
}

function findLargestNumber(data: Record<string, number>) {
    let maxNumber = 0;

    for (const key in data) {
        if (typeof data[key] === 'number') {
            const numberValue = Number(data[key]); // Convert the value to a number
            if (numberValue > maxNumber) {
                maxNumber = numberValue;
            }
        }
    }

    return maxNumber;
}

function ChartBox() {
  const totalWeeklySpending = weeklyData.reduce((acc, curr) => acc + Object.values(curr.weekly).reduce((sum, val) => sum + val, 0), 0);
  const totalMonthlySpending = weeklyData.reduce((acc, curr) => acc + Object.values(curr.monthly).reduce((sum, val) => sum + val, 0), 0);

  const weeklySpending = weeklyData[0]?.weekly ?? {};
  const monthlySpending = weeklyData[0]?.monthly ?? {};

  const chartData = weeklyData.map(data => ({
    year: data.date,
    WeeklyData: Object.values(data.weekly).reduce((sum, val) => sum + val, 0),
    MonthlyData: Object.values(data.monthly).reduce((sum, val) => sum + val, 0),
  }));

  return (
    <div className="text-left">
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Weekly Spending</h2>
          <Card className="max-w-lg mb-6">
            <Title>Spending Summary</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                { name: 'Food', spendSum: weeklySpending.Food },
                { name: 'Other', spendSum: totalWeeklySpending - weeklySpending.Food }
              ]}
              category="spendSum"
              index="name"
              colors={["green", "slate"]}
              label={`${(weeklySpending.Food / totalWeeklySpending * 100).toFixed()}%`}
            />
          </Card>
          <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Spending Total (week) {new Date().toLocaleDateString()}</Text>
            <Metric>${addCommasToNumber(totalWeeklySpending)}</Metric>
          </Card>
          <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Category Spending</Text>
            <Metric>${addCommasToNumber(findLargestNumber(weeklySpending))}</Metric>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Monthly Spending</h2>
          <Card className="max-w-lg mb-6">
            <Title>Spending Summary</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                { name: 'Food', spendSum: monthlySpending.Food },
                { name: 'Other', spendSum: totalMonthlySpending - monthlySpending.Food }
              ]}
              category="spendSum"
              index="name"
              colors={["green", "slate"]}
              label={`${(monthlySpending.Food / totalMonthlySpending * 100).toFixed()}%`}
            />
          </Card>
          <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Spending Total (month) {new Date().toLocaleDateString()}</Text>
            <Metric>${addCommasToNumber(totalMonthlySpending)}</Metric>
          </Card>
          <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Category Spending</Text>
            <Metric>${addCommasToNumber(findLargestNumber(monthlySpending))}</Metric>
          </Card>
        </div>
      </div>
      <Card className="mt-8">
        <Title>Domestic Daily</Title>
        <LineChart
          className="mt-6"
          data={chartData}
          index="year"
          categories={["WeeklyData", "MonthlyData"]}
          colors={["pink", "gray"]}
          yAxisWidth={120}
          valueFormatter={addCommasToNumber}
        />
      </Card>
    </div>
  );
}

export default ChartBox
