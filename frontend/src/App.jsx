import ReactDOM from "react-dom/client";
import LoginSignupView from "./views/LoginSignupView";
import './styles/main.scss'
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClockView from "./views/ClockView";
import useAuth from "./hooks/useAuth";

export const routeList = [
    {
        path: '/', element: <LoginSignupView/>, showHeader: false
    },
    {
        path: '/clock', element: <ClockView/>, showHeader: true
    },
    
];

const App = () =>{

    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    
  
    return (
        <BrowserRouter>
            {!isAuthenticated && <Navigate to="/"/>}
            <div id="app">
                <Header routeList={routeList}/>
                <main className="relative" id="main_content">
                    <div className="centered">
                        <Routes>
                            {routeList.map((route)=>{
                                return (
                                
                                <Route 
                                    key={route.path}
                                    {...route}/>
                                
                                );
                            })}


                        </Routes>
                    </div>
                </main>
                
            </div>
        </BrowserRouter>
    );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(<App/>);