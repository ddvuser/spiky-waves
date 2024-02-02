import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
          {user ? 
            (<li onClick={logoutUser}>Logout</li>)
            :
            (<li><Link to="/login">Login</Link></li>)
          }

          {user && <li>logged in as {user.email}</li>}
      </ul>
    </nav>
  )
}

export default Header;