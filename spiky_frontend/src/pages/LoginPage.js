import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);

    return (
        <div>
            <form onSubmit={loginUser}>
                <input type='text' name='email' placeholder='Enter an e-mail' />
                <input type='text' name='password' placeholder='Enter a password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default LoginPage