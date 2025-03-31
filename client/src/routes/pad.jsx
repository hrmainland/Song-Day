import { useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

function useSize(ref) {
  const [width, setWidth] = useState(0);

  useResizeObserver(ref, (entry) => {
    setWidth(entry.contentRect.width);
  });

  return width;
}


function ResponsiveBox({ label }) {
  const ref = useRef(null);
  const width = useSize(ref);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        padding: "1rem",
        marginBottom: "1rem",
        border: "1px solid #ccc",
      }}
    >
      <strong>{label}</strong>: {width}px wide
    </div>
  );
}

export default function Pad() {
  return (
<div>
    <div style={{ width: "80%", margin: "0 auto" }}>
    <div style={{ width: "80%", margin: "0 auto" }}>
        <ResponsiveBox label="First Box" />
        </div>
        <ResponsiveBox label="Second Box" />
        <ResponsiveBox label="Third Box" />
    </div>
        <div style={{ width: "100%", margin: "0 auto" }}>
        <ResponsiveBox label="First Box" />
        <ResponsiveBox label="Second Box" />
        <ResponsiveBox label="Third Box" />
        </div>
</div>
  );
}
