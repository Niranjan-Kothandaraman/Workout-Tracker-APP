import React, { useEffect, useState } from "react";
import Keycloak from "keycloak-js";
import WorkoutTracker from "./WorkoutTracker";

function App() {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const kc = new Keycloak({
      url: "http://localhost:8080",
      realm: "workout-realm",
      clientId: "workout-frontend",
    });

    kc.init({ onLoad: "login-required" }).then((authenticated) => {
      setKeycloak(kc);
      setAuthenticated(authenticated);
    });
  }, []);

  if (!keycloak) {
    return <div>Initializing Keycloak...</div>;
  }

  if (!authenticated) {
    return <div>Unable to authenticate!</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1>Welcome {keycloak.tokenParsed?.preferred_username}</h1>
        <button
          onClick={() => keycloak.logout()}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* Show the tracker after login */}
      <WorkoutTracker />
    </div>
  );
}

export default App;
