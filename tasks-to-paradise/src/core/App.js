import React, { useEffect } from "react";
import { css, Global } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tasks from "../script/Tasks"; // Adjust the path according to your project structure
import Dashboard from "../script/Dashboard"; // Adjust the path according to your project structure
import Penalty from "../script/Penalty";
import Reward from "../script/Reward";
import Settings from "../script/Settings";
import backgroundImage from "../imgs/dark.jpg"; // Adjust the path according to your project structure

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);
  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
            height: 100%;
            
            
          }

          #root {
            min-height: 100%;
            display: flex;
            flex-direction: column;
            background-image: url(${backgroundImage}); /* Replace with your image path */
            background-color : var(--second-bg-color);
            background-blend-mode: overlay; /* Blend the background color with the image */
            background-attachment: fixed;
            background-repeat: no-repeat;
            background-size: cover;
            
          }
        `}
      />

      <header>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <Link to="/penalty">Penalty</Link>
              </li>
              <li>
                <Link to="/reward">Reward</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
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
    </>
  );
}
export default App;


//Corriger bug des prohibited dont la checkbox est pas remise à defaut.
//Rendre la valeur des ppoints d'une task customizable, et si c'est le cas, dans app.js lors de la création de task regarder si on peut int() la valeur
//Changer le format des taches dans tasks pour faire comme dans dashboard.
//Rendre les textes des autres sections un minmum beau.

//S'occuper de clean l'historique tous les jours, enelever les taches après x temps(si once ou alors), et remettre les daily habits (comment faire si qqn veut supprimer une daily et qu'elle est dans historique?), et de remettre les daily tous les jours et les habits a toutes les frequences, et remettre à jour leur date d'expiration à ajd quand on les remet et flean les date of completion a 0 de habits
//Mettre les disques pour les ppoints et rpoints et ce qu'on a debloqué dans le dashboard
//S'occuper du responsive et améliorer le thème un minimum.

//Deploy
//S'occuper des différents users
//Faire penalty induced

//SideQuest :Faire le edit (voir en dessous) dans task, faire des hovers pour voir le content dans tasks, et meme dans le dashboard
//S'occuper du edit (faire apparaitre modal avec active item, mais surtout dans le back end)
//Mettre les popover dans settings
//Faire les projects
//Faire un beau dark mode.
