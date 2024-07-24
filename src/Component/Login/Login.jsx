import React from 'react'
import './Login.scss'
import { IoCarSport } from 'react-icons/io5'
const Login = () => {
    return (
        <div className='content-login'>
            <div className="cont-log">
                <div className="logo">
                    <div className="cont-logo">
                        <IoCarSport className='icon_logo' />
                        <h1>Car</h1>
                    </div>
                    <h2>Sign in your account</h2>
                </div>

                <form action="">
                    <div className="inp-lab">
                        <label htmlFor="email">Email</label>
                        <input type="email" id='email'/>
                    </div>
                    <div className="inp-lab">
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password'/>
                    </div>
                    <div className="inp-rem">
                        <div className="chek-rem">
                            <input type="checkbox" />
                            <p>Remember my preference</p>
                        </div>
                        <div className="forgmy">
                            <a href="">Forgot Password?</a>
                        </div>
                    </div>
                    <div className="inp-lab">
                        <button type='submit'>Sign Me in</button>
                    </div>
                    <div className="signup">
                        <p>Don't have an account?   <a href="">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login