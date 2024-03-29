import React, { useEffect, useState } from "react";
import { css, Global } from "@emotion/react";
import {
  Button,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tasks from "../script/Tasks"; // Adjust the path according to your project structure
import Dashboard from "../script/Dashboard"; // Adjust the path according to your project structure
import Penalty from "../script/Penalty";
import Reward from "../script/Reward";
import Settings from "../script/Settings";
import Login from "../script/Login";
import backgroundImage from "../imgs/dark.jpg"; // Adjust the path according to your project structure

const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const isIOSDevice = isIOS(); // Call the utility function
const apiUrl = process.env.API_URL || "";

const globalStyle = css`
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    color: white;
  }

  #background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: url(${backgroundImage});
    background-color: var(
      --second-bg-color
    ); 
    background-blend-mode: overlay;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #root {
    min-height: 100vh; /* Ensure content can scroll */
    position: relative;
    z-index: 1; /* Ensures content is above the background */
  }
`;


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("dark");
  }, [setColorMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    localStorage.setItem("loggedInUser", username); // Optionally store in local storage
    // Redirect to the dashboard or another page
    window.location.href = "/dashboard"; // Replace '/dashboard' with your desired route
  };

  const handleLogout = () => {
    fetch(`${apiUrl}/logout`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Logout failed");
        }
      })
      .then((data) => {
        console.log(data.message);
        setLoggedInUser(null); // Update state to reflect that user is logged out
        localStorage.removeItem("loggedInUser"); // Clear stored user info if you're using local storage
        window.location.href = "/login"; // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Global styles={globalStyle} />
      <div id="background-container"></div>

      <header>
        <Router>
          {loggedInUser ? (
            <>
              <nav>
                {/* Hamburger Menu for smaller screens */}
                <Box display={{ base: "block", md: "none" }}>
                  <Menu className="title">
                    <MenuButton
                      as={IconButton}
                      icon={<HamburgerIcon />}
                      variant="outline"
                      aria-label="Options"
                    />
                    <MenuList
                      sx={{
                        bg: "black", // Your desired background color
                        borderColor: "black", // Optional: if you want to change border color
                        // Add any other styles here
                      }}
                    >
                      <MenuItem as={Link} to="/dashboard">
                        Dashboard
                      </MenuItem>
                      <MenuItem as={Link} to="/tasks">
                        Tasks
                      </MenuItem>
                      <MenuItem as={Link} to="/penalty">
                        Penalty
                      </MenuItem>
                      <MenuItem as={Link} to="/reward">
                        Reward
                      </MenuItem>
                      <MenuItem as={Link} to="/settings">
                        Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>

                {/* Regular Menu for larger screens */}
                <Box display={{ base: "none", md: "block" }}>
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
                    <li>
                      <Button onClick={handleLogout}>Logout</Button>
                    </li>
                  </ul>
                </Box>
              </nav>

              {/* Routes */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/penalty" element={<Penalty />} />
                <Route path="/reward" element={<Reward />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </>
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Router>
      </header>
    </>
  );
}

export default App;

//TODO Bug margin bottom, et rajouter un task-grid spécialement pour prhibited pour pas que la date prenne de l'espace alors qu'elle n'exsite pas.
//TODO faire le bon visuel dans tasks car ca va être réutiliser dans projet, surtout les 3 points, et l'edit.
//TODO Régler problème importance quand on souhaite edit une task + régler le bu de penalty induced similairement.
//?S'occuper du scaling des weekly et company
//?enlever les rewards daily?. Que weekly and monthly. //Si penality weekly alors pas de reward weekly. pour le monthly, mettre ses objectifs en début de mois. (avoir une alerte qui tous les jours pop et dit de le faire)

//Code project
//Test project

//Fonction extend de tache qui consomme la moitié des points d'importance le dernier jour, et qui prolonge d'un jour mais en faisant x1.5 les points d'importance. Edit possible d'une tache jusqu'à 2 jours avant la complétion de la tache.
//Pouvoir avoir plusieurs penalties sur de meme place, et en activer certaines (que une active possible)
//rendre le details hoverable urgeamment
//Rendre la penalty induced d'une task hoverable dans le dashboard avec un popover avec le content de la penalty induced et avec genre une étoile rouge en mode asterix.
//Rendre la valeur des ppoints d'une task customizable, et si c'est le cas, dans app.js lors de la création de task regarder si on peut int() la valeur
//bug du margin bottom ou y'en pas du tout sur toutes les pages
//Peut etre le bouton add task dans dashboard aussi ?
// mettre le menu en sticky ?

//faire que le pause mode empeche tout
//make an anti "I tap multiple times and i get 3* the planified rewards because it was sent 3 times by the js"
//Mettre les popover dans settings
//Rajouter dans le modal quand on veut un setting (soit complétion, soit importance etc), le nom des catégories (good, average...) en fonction de ce qu'on a décidé de changer (faire des listes contenants le nom des variables dans le modal, comme dans le modal pour task) et mettre l'ancienne valeur directement dans le modal comme j'ai pu faire dans le edit de penalties etc

//Mettre les disques pour les ppoints et rpoints et ce qu'on a debloqué dans le dashboard
//Corriger problème d'alignement entre menu et titre
//Add custom pointer comme le site trop beau. Pour moi si je met un disque qui suit la souris en mode un peu lent c'est banger
//Goumer le log out
//Do achievements
//Rajouter mode efficient vs mode aéré dans les settings. #FF
//Prohibited : The deduction could be a fixed amount or vary based on the severity or frequency of the violation.
//mot de passe  - Add authentification with google or smth not crackable

//Comprehensive Scoring System: Develop a scoring system that integrates completion levels, task importance, and prohibitions. This system should be transparent and easily understandable to the users.
//Dynamic Thresholds for Rewards/Penalties: Adjust weekly and monthly reward/penalty thresholds based on average task difficulty, completion levels, and prohibitions. This makes the system more adaptive and personalized.

//Performance Analysis: Provide users with insights into their performance, like trends in task completion, to help them understand and improve their habits.
//Feedback Loop: Use these insights to adjust the point system dynamically, encouraging improvement in weaker areas.
//2. Performance-based Multipliers Good Week/Month Bonus: If a user has an exceptionally good week or month (e.g., completing a high percentage of tasks), apply a multiplier to their reward points. This emphasizes the quality of performance over the period.
//Consecutive Achievements: If users hit their targets consecutively (like achieving the weekly reward several weeks in a row), provide a bonus multiplier to reward consistency.
//Special Bonuses: Introduce surprise bonuses for extraordinary achievements, like completing all tasks in a month or hitting the highest threshold multiple times in a row.

//ajouter une petite alerte/message ephémère pour dire quand c'est checké que c'est bien pris en compte.
//Rendre le responsive plus beau ? (settings...)
//rendre plus joli tasks penlatys et rewards
//Faire un beau dark mode.
