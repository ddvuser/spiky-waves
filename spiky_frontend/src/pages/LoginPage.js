import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);

    return (
        <div className='row'>
            <div className='col'></div>
            <div className='col-6'>
                <form onSubmit={loginUser}>
                    <div className='form-group mt-2 mb-2'>
                        <label className='mb-1' htmlFor='login-email'>Email address:</label>
                        <input className='form-control' type='text' name='email' id='login-email' placeholder='name@example.com' />
                    </div> 
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='login-password'>Password:</label>
                        <input className='form-control' type='password' name='password' id='login-password' placeholder='...' />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Login</button>
                </form>
            </div>
            <div className='col'></div>
        </div>
    )
}

export default LoginPage