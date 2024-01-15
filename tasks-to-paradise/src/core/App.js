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

//Trouver bon équilibre couleurs taches et taille de texte
//Changer tout le systeme de tasks en rajoutant des sous categories dans tasks. Changer la classe Task ou la surcharger peut etre en mettant des trucs style date d'expiration etc
//Faire prohibited (onglet à soi dans dashboard)
//Faire penalty induced
//Rendre la valeur des ppoints d'une task customizable, et si c'est le cas, dans app.js lors de la création de task regarder si on peut int() la valeur
//Changer le format des taches dans tasks pour faire comme dans dashboard.
//S'occuper de clean l'historique tous les jours, enelever les taches après x temps(si once ou alors), et remettre les daily habits (comment faire si qqn veut supprimer une daily et qu'elle est dans historique?), et de remettre les daily tous les jours et les habits a toutes les frequences
//Si prohibited degager le scaling de difficulty et la date d'expiration (mettre dans 10 ans), si habits rajouter une frequence dans modal et un nombre de jour avant que ca expire, pour daily dégager la date d'expiration dans le modal et juste mettre le jour meme quand j'envoie..

//Mettre les disques pour les ppoints et rpoints et ce qu'on a debloqué dans le dashboard



//Deploy
//S'occuper des différents users
//S'occuper du repsonsive




//SideQuest :Faire le edit (voir en dessous) dans task, faire des hovers pour voir le content dans tasks, et meme dans le dashboard  
//S'occuper du edit (faire apparaitre modal avec active item, mais surtout dans le back end)
//Mettre les popover dans settings
//Mettre un générateur de id et donner un id unique pour chaque task penalties et reward. mettre un counter dans json et donner counter +1 tout simplement
//régler bug keys pour les penalties (soit donné content unique, soit donné un id)
//Faire les projects
//Faire un beau dark mode.