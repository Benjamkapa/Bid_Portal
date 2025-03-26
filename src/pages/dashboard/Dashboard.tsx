import { useEffect, useState } from 'react';

import { SiVirustotal } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";
import { FcCancel,FcApprove } from "react-icons/fc";


import axios from 'axios';
import { token } from '../../redux/authSlice';
import toast from 'react-hot-toast';




const AdminDashboard = () => {




interface Stat {
  total: number;
}

const [stats, setStats] = useState<Stat[]>([])
// fetch stats
const fetStats=async()=>{

try {
  const response=await axios.get("http://197.248.122.31:3000/api/stats/",token())
  const data=response.data
  setStats(data.stats)
  
} catch (error) {
  console.log(error)
  toast.error("Failed to fetch statistics")
}

}
useEffect(()=>{
fetStats()
},[])

const sum = stats?.reduce((acc, item) => acc + item.total, 0);


  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 bg-white rounded-md space-x-2 ">
        <div className="border-r border-r-[#ccc] p-4    flex justify-between items-center">
          <div>
            <h1>Total Tenders</h1>
            <p className="font-bold text-xl py-1 ">{sum}</p>
          </div>
          <div>
            <SiVirustotal size={45} className='text-blue-500'/>
          </div>
        </div>

        <div className="border-r border-r-[#ccc] p-4  flex justify-between items-center">
          <div>
            <h1>Pending Tenders</h1>
            <p className="font-bold text-xl py-1 ">
            {stats?.[2]?.total}
            </p>
          </div>
          <div>
          <MdOutlinePendingActions size={45} className='text-yellow-500'/>
          </div>
        </div>
        <div className=" border-r border-r-[#ccc] p-4   flex justify-between items-center">
          <div>
            <h1>Approved Tenders</h1>
            <p className="font-bold text-xl py-1 ">
          {stats?.[0]?.total}
            </p>
          </div>
          <div>
          <FcApprove  size={45} />
          </div>
        </div>
        <div className="border-r border-r-[#ccc] p-4  flex justify-between items-center">
          <div>
            <h1>Rejected Tenders</h1>
            <p className="font-bold text-xl py-1 ">
            {stats?.[1]?.total}
            </p>
          </div>
          <div>
          <FcCancel size={45} className='text-red-500'/>
          </div>
        </div>


        </div>
        <div>
        {/* <h1 className="text-xl ">Recent uploads.</h1> */}
        </div>
    </div>
  );
}

export default AdminDashboard;