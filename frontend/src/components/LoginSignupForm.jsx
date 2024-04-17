import { useEffect, useState } from 'react';
import { utilService } from '../services/utilService';
import { useNavigate } from 'react-router-dom';


const LoginSignupForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth(){

      const loginToken = utilService.getCookie('loginToken');
      if(loginToken){
        try {
          const result = await utilService.ajax('auth/check', 'GET');
          if(result && result.id && !result.err) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(result)) ;
            navigate('/clock');
          }
          
        } catch (err) {
          
        }
      }
    }

    checkAuth();

  }, []);
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget)

    const credentials = {
      username: data.get('username'),
      password: data.get('password'),
      name: data.get('name'),
    }

    const endpoint = isLogin ? 'login' : 'signup';

    try {
      await utilService.ajax('auth/' + endpoint, 'POST', credentials);

      navigate('clock');
    } catch (err){
      console.error(err);
    }

  };

  return (
    <div id="login_signup_form" className="container">
      <div className="form_container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && <p className="required_text">*All fields are required</p>}
          {!isLogin && <input required type="text" name="name" placeholder="Name" />}
          <input required type="text" placeholder="Username" name="username" />
          <input required type="password" placeholder="Password" name="password" />
          <button className="btn" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="toggle_signup" onClick={toggleForm}>{isLogin ? 'Create an account' : 'Already have an account? Login'}</p>
      </div>
    </div>
  );
};

export default LoginSignupForm;
