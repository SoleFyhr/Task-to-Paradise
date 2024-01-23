import React, { useEffect, useState } from "react";
import { css, Global } from "@emotion/react";
import { Button } from "@chakra-ui/react";
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
                  <Button className="" onClick={handleLogout}>Logout</Button>

                </ul>
                
              </nav>
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

// Corriger bug du penalty qui doit doubler
//4 S'occuper du responsive

//5 Deploy
//6 S'occuper des différents users, d'une page de connexion et d'un easy mode/hard mode et des tokens.

//Corriger bug de quand y'a trop de tasks c'est un enfer de scroll a cause du smooth scrolling et ca overflow cette merde
//Faire penalty induced
//Corriger problème d'alignement entre menu et titre
//rendre le details hoverable urgeamment
//Rendre la valeur des ppoints d'une task customizable, et si c'est le cas, dans app.js lors de la création de task regarder si on peut int() la valeur
//Mettre les disques pour les ppoints et rpoints et ce qu'on a debloqué dans le dashboard
//Add custom pointer comme le site trop beau. Pour moi si je met un disque qui suit la souris en mode un peu lent c'est banger
//Goumer le log out

//SideQuest :Faire le edit (voir en dessous) dans task, faire des hovers pour voir le content dans tasks, et meme dans le dashboard
//rendre plus joli tasks penlatys et rewards
//S'occuper du edit (faire apparaitre modal avec active item, mais surtout dans le back end)
//Mettre les popover dans settings
//Faire les projects
//Faire un beau dark mode.
