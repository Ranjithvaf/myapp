import React from 'react'

const Footer = () => {
  const today = new Date
  return (
    <footer className='Footer'>
      <p>Copyright &copy; {today.getFullYear()} Social Media App</p>
    </footer>
  )
}

export default Footer