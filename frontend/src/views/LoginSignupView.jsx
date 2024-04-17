import LoginSignupForm from "../components/LoginSignupForm";
import '../styles/views/login_signup.scss'


const LoginSignupView = () => {        
        return (
            <div id="login_signup_page" className="page flex align_center justify_center">
                <div className="site_bg"></div>
                <div className="content centered flex align_center justify_center">
                    <LoginSignupForm/>
                </div>
            </div>
        );
}

export default LoginSignupView;