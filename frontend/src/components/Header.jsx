import { useLocation, useNavigate } from "react-router-dom";
import { utilService } from "../services/utilService";
import { useEffect, useState } from "react";


const Header = ({ routeList }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(sessionStorage.getItem('loggedInUser'));
    const currentRoute = routeList.find(route => location.pathname === route.path);
    const shouldShowHeader = currentRoute && currentRoute.showHeader;

    useEffect(() => {
        let localUser = sessionStorage.getItem('loggedInUser');
        if(localUser) {
            try {
                setUser(()=>JSON.parse(localUser));
            } catch {
                setUser(()=>{});
            }
        }
    }, [shouldShowHeader])
    


    const logout = async () =>{
        try {
            await utilService.ajax('auth/logout', 'DELETE');
            sessionStorage.removeItem('loggedInUser');
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