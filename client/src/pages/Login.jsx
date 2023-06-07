import React, { useState } from 'react';
import '../styles/LoginRegister.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Login = () => {
  document.title = "Login";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useContext(AuthContext);

  const handleSubmit = async (e) =>{

    e.preventDefault();
    const inputs = {email, password};

    await login(inputs);

  }

  return (
    <div className='AuthenticationPage'>
        <div className="authenticationContainer">
          <h1>Login Page</h1>
          <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1"  onChange={(e)=>setPassword(e.target.value)} />
              </div>
              
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </form>
          <p>Not registered? <Link to={'/register'}>Register now!</Link></p>
        </div>
    </div>
  )
}

export default Login