import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from"react-chartjs-2"


const [all, tilSoftCap, tilHardCap] = [10000, 3800, 1000];
const boughtDep = 500 ;
      
const data = {
  labels: ['Bought', 'Left until SoftCap', 'Left Until Hard Cap', 'Left Until Fill'],
  datasets: [
    {
      label: '# of Votes',
      data: [
        boughtDep, 
        all - tilSoftCap - tilHardCap-boughtDep, 
        tilSoftCap, 
        tilHardCap],
      backgroundColor: [
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 99, 132, 0.1)',
        'rgba(255, 206, 86, 0.1)',
        'rgba(75, 192, 192, 0.1)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const Circle = () => {
  return (
    
    <div className="flex flex-col">
      {/* <div className="circle border-green-400"
      >
        <div className="text-center" >3.0 Ether</div>
      </div>
      <div className="circle-text mt-3">Max</div> */}
      <Pie data={data} />
      <div className="circle-text mt-3">Total: {all}</div>
      <div className="circle-text mt-3">Bought: {boughtDep}</div>
      
      
      {/* <div className="circle-text">Investment</div> */}

      {/* <div className="pie" style="--p:60;--b:10px;--c:purple;">60%</div> */}
    
    </div>
         
  );
};

export default Circle;