import React from 'react'
import Dashboard from '../../components/dashboard/Dashboard';
import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.dashboard}>
      <Dashboard/>
    </div>
  )
}

export default Home