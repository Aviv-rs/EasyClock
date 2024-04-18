import { useEffect, useState } from 'react';
import { utilService } from '../services/utilService';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";


const LoginSignupForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated && !isLoading) navigate('/clock');

  }, [isAuthenticated]);
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (ev) => {
    const data = new FormData(ev.currentTarget)

    const credentials = {
      username: data.get('username'),
      password: data.get('password'),
      name: data.get('name'),
    }

    const endpoint = isLogin ? 'login' : 'signup';

    try {
      const res = await utilService.ajax('auth/' + endpoint, 'POST', credentials);
      if(res.err) return alert(res.err);
      navigate('clock');
    } catch (err){
      console.error(err);
    }

  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="login_signup_form" className="container">
      <div className="form_container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={(ev)=>{ev.preventDefault();handleSubmit(ev);}}>
          {!isLogin && <p className="required_text">*All fields are required</p>}
          {!isLogin && <input required type="text" name="name" placeholder="Name" />}
          <input id="username" required type="text" placeholder="Username" name="username" />
          <input id="password" required type="password" placeholder="Password" name="password" />
          <button className="btn" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="toggle_signup" onClick={toggleForm}>{isLogin ? 'Create an account' : 'Already have an account? Login'}</p>
      </div>
    </div>
  );
};

export default LoginSignupForm;
