import { useLocation, useNavigate } from "react-router-dom";
import { utilService } from "../services/utilService";

let user = sessionStorage.getItem('loggedInUser');
if(user) {
    try {
      user = JSON.parse(user);
    } catch {
      user = {}
    }
}


const Header = ({ routeList }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoute = routeList.find(route => location.pathname === route.path);
    const shouldShowHeader = currentRoute && currentRoute.showHeader;

    const logout = async () =>{
        try {
            await utilService.ajax('auth/logout', 'DELETE');
            navigate('/');
        } catch (err) {
            alert('Logout failed, please contact the web master')
        }
    }

    return shouldShowHeader && user ? 
    (<header id="main_header">
    <div className="header_inner centered">
        <div className="logo align_center">
            EasyClock
            <div className="logo_pic"></div>
        </div>
        <div className="flex align_center" id="user_area">
            <div className="user_actions">
                <span>Welcome, {user.name}</span>
                <div className="seperator"></div>
                <button className="btn" onClick={logout}>Logout</button>
            </div>
        </div>
    </div>
    </header>)
    : <></>;
}

export default Header;