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
    fetch("http://127.0.0.1:5000/logout")
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
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            color: white;
          }

          #root {
            min-height: 100%;
            display: flex;
            flex-direction: column;
            background-image: url(${backgroundImage}); /* Replace with your image path */
            background-color: var(--second-bg-color);
            background-blend-mode: overlay; /* Blend the background color with the image */
            background-attachment: fixed;
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}
      />

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

//4 Deploy sur heroku
//5 Ajouter add on pour scheduler la daily routine tous les jours.


//S'occuper du scaling des weekly et company
//Faire penalty induced
//Corriger problème d'alignement entre menu et titre
//rendre le details hoverable urgeamment
//Rendre la valeur des ppoints d'une task customizable, et si c'est le cas, dans app.js lors de la création de task regarder si on peut int() la valeur
//Mettre les disques pour les ppoints et rpoints et ce qu'on a debloqué dans le dashboard
//Add custom pointer comme le site trop beau. Pour moi si je met un disque qui suit la souris en mode un peu lent c'est banger
//Goumer le log out
//Corriger bug de quand y'a trop de tasks c'est un enfer de scroll a cause du smooth scrolling et ca overflow cette merde
//Rendre le responsive plus beau ? (settings...)
//Special Bonuses: Introduce surprise bonuses for extraordinary achievements, like completing all tasks in a month or hitting the highest threshold multiple times in a row.

//SideQuest :Faire le edit (voir en dessous) dans task, faire des hovers pour voir le content dans tasks, et meme dans le dashboard
//rendre plus joli tasks penlatys et rewards
//S'occuper du edit (faire apparaitre modal avec active item, mais surtout dans le back end)
//Mettre les popover dans settings
//Faire les projects
//Faire un beau dark mode.
//Prohibited : The deduction could be a fixed amount or vary based on the severity or frequency of the violation.

//Comprehensive Scoring System: Develop a scoring system that integrates completion levels, task importance, and prohibitions. This system should be transparent and easily understandable to the users.
//Dynamic Thresholds for Rewards/Penalties: Adjust weekly and monthly reward/penalty thresholds based on average task difficulty, completion levels, and prohibitions. This makes the system more adaptive and personalized.

//Performance Analysis: Provide users with insights into their performance, like trends in task completion, to help them understand and improve their habits.
//Feedback Loop: Use these insights to adjust the point system dynamically, encouraging improvement in weaker areas.
//2. Performance-based Multipliers Good Week/Month Bonus: If a user has an exceptionally good week or month (e.g., completing a high percentage of tasks), apply a multiplier to their reward points. This emphasizes the quality of performance over the period.
//Consecutive Achievements: If users hit their targets consecutively (like achieving the weekly reward several weeks in a row), provide a bonus multiplier to reward consistency.