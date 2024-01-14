import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tasks from '../script/Tasks'; // Adjust the path according to your project structure
import Dashboard from '../script/Dashboard'; // Adjust the path according to your project structure
import Penalty from "../script/Penalty";
import Reward from "../script/Reward";
import Settings from "../script/Settings";

function App() {
  
  useEffect(() => {
    // Set the data-theme attribute to "dark" on the html element
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);
    return (
      
      <header>
      <Router>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/penalty">Penalty</Link></li>
            <li><Link to="/reward">Reward</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            {/* more links */}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/penalty" element={<Penalty />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/settings" element={<Settings />} />

          
          {/* more routes */}
        </Routes>
      </Router>
    </header>
  
  );
  
}
export default App;
//S'occuper d'une disposition ok des tasks (pour importance et difficulty) et couleurs avec prohibited etc..
//Faire prohibited (onglet à soi dans dashboard)
//Si prohibited degager le scaling de difficulty et la date d'expiration (mettre dans 10 ans), si habits rajouter une frequence dans modal

//Deploy
//S'occuper des différents users
//S'occuper du repsonsive

//SideQuest :Faire le edit dans task, faire des hovers pour voir le content dans tasks, et meme dans le dashboard  
//S'occuper du edit (faire apparaitre modal avec active item, mais surtout dans le back end)
