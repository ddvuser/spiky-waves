import React from 'react'

const LoginPage = () => {
  return (
    <div>
        <form>
            <input type='text' name='email' placeholder='Enter an e-mail' />
            <input type='text' name='password' placeholder='Enter a password' />
            <input type='submit' />
        </form>
    </div>
  )
}

export default LoginPage