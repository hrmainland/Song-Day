import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";

export default function Test() {
  const [tracks, setTracks] = useState([]);
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        // maybe add this line to client package.json: "proxy": "http://localhost:3500"
        const response = await fetch(`${baseUrl}/dev/tracks`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const body = await response.json();
        setTracks(body);
      } catch (error) {
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);

  return (
    <div>
      <h1>Tracks:</h1>
      {tracks.map((track, i) => (
        <h2 key={i}>{track}</h2>
      ))}
    </div>
  );
}
