import React, { useContext, useState } from 'react';
import '../styles/LoginRegister.css';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';

const Register = () => {
    document.title = "Register";

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {register} = useContext(AuthContext);

    const handleSubmit = async (e) =>{
      e.preventDefault();

      const inputs = {username, email, password};

      await register(inputs);


    }


  return (
    <div className='AuthenticationPage'>
        <div className="authenticationContainer">
          <h1>Register Page</h1>
          <form>
              <div className="mb-3">
                <label htmlFor="exampleInputName" className="form-label">Username</label>
                <input type="text" className="form-control" id="exampleInputName" onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e)=>setPassword(e.target.value)} />
              </div>
              
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </form>
          <p>Already registered? <Link to={'/login'}>Login</Link></p>
        </div>
    </div>
  )
}

export default Register