import React from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import Users from '../components/Users'

const Dashboard = () => {
  return (
    <div>
      <div className='px-2'>
        <Appbar/>
      </div>
      <div className='pt-4 mx-4'>
        <Balance value={"10,000"}/>
      </div>
      <div className='mx-4'>
        <Users/>
      </div>
    </div>
  )
}

export default Dashboard