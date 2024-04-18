import ReactDOM from "react-dom/client";
import LoginSignupView from "./views/LoginSignupView";
import './styles/main.scss'
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClockView from "./views/ClockView";

export const routeList = [
    {
        path: '/', element: <LoginSignupView/>, showHeader: false
    },
    {
        path: '/clock', element: <ClockView/>, showHeader: true
    },
    
];

const App = () =>{

    return (
        <BrowserRouter>
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