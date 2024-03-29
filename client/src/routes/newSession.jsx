import React, { useState, useEffect } from "react";
import baseURL from "../../utils/urlPrefix";

function NewSession() {
  const [name, setName] = useState([]);
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        // maybe add this line to client package.json: "proxy": "http://localhost:3500"
        const response = await fetch(`${baseURL}/spotify/displayName`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const body = await response.json();
        setName(body);
      } catch (error) {
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);

  return (
    <>
      <h1>{name}</h1>
      <form action={`${baseURL}/spotify/auth`}>
        <button>Login</button>
      </form>
    </>
  );
}

export default NewSession;
