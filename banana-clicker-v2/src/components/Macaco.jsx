import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";

export default function Macaco() {
  const { clicarMacaco, porClique } = useGame();
  const [flutuantes, setFlutuantes] = useState([]);

  useEffect(() => {
    if (flutuantes.length === 0) return;
    const t = setTimeout(() => setFlutuantes((f) => f.slice(1)), 900);
    return () => clearTimeout(t);
  }, [flutuantes]);

  function handleClick() {
    clicarMacaco();
    setFlutuantes((f) => [...f, Date.now()]);
  }

  return (
    <div style={styles.area}>
      <button style={styles.btn} onClick={handleClick}>
        <img src="/images/macaco-clicker.png" style={styles.imagem} />
      </button>

      {flutuantes.map((id) => (
        <span key={id} style={styles.flutuante}>
          +{porClique} 🍌
        </span>
      ))}
    </div>
  );
}

const styles = {
  area: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    margin: "clamp(8px, 2vh, 24px) 0",
  },
  btn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    lineHeight: 1,
    padding: 0,
  },
  imagem: {
    width: "clamp(80px, 18vw, 160px)",
    height: "auto",
    display: "block",
  },
  flutuante: {
    position: "absolute",
    top: -10,
    left: "50%",
    fontSize: "clamp(12px, 2.5vw, 16px)",
    fontWeight: "bold",
    pointerEvents: "none",
    animation: "subir 0.9s ease-out forwards",
    whiteSpace: "nowrap",
  },
};
