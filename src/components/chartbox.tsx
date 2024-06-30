// import { Card, Metric, Text, Title, DonutChart, LineChart } from "@tremor/react";
// import weekly_spending from "./mockdata_weekly.json";
// import monthly_spending from "./mockdata_monthly.json";


// const weeklyData = weekly_spending.map(({ revenue, date }) => {
// const monthlyData = monthly_spending.find(opp => opp.date === date);
//   return {
//     date,
//     wee: revenue,
//     : oppenheimer?.revenue
//   }
// })
    
//     function addCommasToNumber(number: number) {
//       // Convert the number to a string
//       let numString = number.toString();
      
//       // Use regex to add commas to the string representation of the number
//       numString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
//       return numString;
//     }
    
//     function chartbox() {
//       return (
//         <div className="text-left">
//           <div className="grid grid-cols-2 gap-12">
//             <div>
//               <h2 className="text-2xl font-bold mb-6">jaime</h2>
//               <Card className="max-w-lg mb-6">
//                 <Title>Sales</Title>
//                 <DonutChart
//                   className="mt-6 mb-6"
//                   data={[
//                     {
//                       name: 'false',
//                       userScore: weekly_spending.vote_average,
//                     },
//                     {
//                       name: 'false',
//                       userScore: 10 - weekly_spending.vote_average,
//                     }
//                   ]}
//                   category="userScore"
//                   index="name"
//                   colors={["green", "slate"]}
//                   label={`${(weekly_spending.vote_average * 10).toFixed()}%`}
//                 />
//               </Card>
//               <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
//                 <Text>Revenue</Text>
//                 <Metric>${ addCommasToNumber(weekly_spending.global_revenue) }</Metric>
//               </Card>
//               <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
//                 <Text>Budget</Text>
//                 <Metric>${ addCommasToNumber(weekly_spending.budget) }</Metric>
//               </Card>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Oppenheimer</h2>
//               <Card className="max-w-lg mb-6">
//                 <Title>Sales</Title>
//                 <DonutChart
//                   className="mt-6 mb-6"
//                   data={[
//                     {
//                       name: 'false',
//                       userScore: monthly_spending.vote_average,
//                     },
//                     {
//                       name: 'false',
//                       userScore: 10 - monthly_spending.vote_average,
//                     }
//                   ]}
//                   category="userScore"
//                   index="name"
//                   colors={["green", "slate"]}
//                   label={`${(monthly_spending.vote_average * 10).toFixed()}%`}
//                 />
//               </Card>
//               <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
//                 <Text>Revenue</Text>
//                 <Metric>${ addCommasToNumber(monthly_spending.global_revenue) }</Metric>
//               </Card>
//               <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
//                 <Text>Budget</Text>
//                 <Metric>${ addCommasToNumber(monthly_spending.budget) }</Metric>
//               </Card>
//             </div>
//           </div>
//           <Card className="mt-8">
//             <Title>Domestic Daily</Title>
//             <LineChart
//               className="mt-6"
//               data={chartData}
//               index="year"
//               categories={["Jamie", "Spending"]}
//               colors={["pink", "gray"]}
//               yAxisWidth={120}
//               valueFormatter={addCommasToNumber}
//             />
//           </Card>
//         </div>
//       )
//     };
    
//     export default chartbox