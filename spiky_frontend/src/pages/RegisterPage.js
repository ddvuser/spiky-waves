import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

function RegisterPage() {
    let {registerUser} = useContext(AuthContext);

    return (
        <div className='row'>
            <div className='col'></div>
            <div className='col-6'>
                <form onSubmit={registerUser}>
                    <div className='form-group mt-2 mb-2'>
                        <label className='mb-1' htmlFor='register-'>Email address:</label>
                        <input className='form-control' type='text' name='email' id='register-email' placeholder='name@example.com' />
                    </div>
                    <div className='form-group mt-2 mb-2'>
                        <label className='mb-1' htmlFor='register-username'>Username:</label>
                        <input className='form-control' type='text' name='username' id='register-email' placeholder='...' />
                    </div>
                    {/* Name, Surname, Phone */}
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='register-name'>Name:
                            <small className='form-text text-muted'>(optional)</small>
                        </label>
                        <input className='form-control' type='text' name='name' id='register-name' placeholder='...' />
                    </div>
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='register-surname'>Surname:
                            <small className='form-text text-muted'>(optional)</small>
                        </label>
                        <input className='form-control' type='text' name='surname' id='register-surname' placeholder='...' />
                    </div>
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='register-phone'>Phone:
                            <small className='form-text text-muted'>(optional)</small>
                        </label>
                        <input className='form-control' type='text' name='phone' id='register-phone' placeholder='(415) 555‑0132' />
                    </div>
                    {/* Password */}
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='register-password1'>Password:</label>
                        <input className='form-control' type='password' name='password' id='register-password1' placeholder='...' />
                    </div>
                    <div className='form-group'>
                        <label className='mb-1' htmlFor='register-password2'>Password confirmation:</label>
                        <input className='form-control' type='password' name='password2' id='register-password2' placeholder='...' />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Register</button>
                </form>
            </div>
            <div className='col'></div>
        </div>
    )
}

export default RegisterPage;