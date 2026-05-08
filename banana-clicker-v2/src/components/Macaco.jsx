import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";

// Componente do macaco clicável com números flutuantes
export default function Macaco() {
  const { clicarMacaco, porClique } = useGame();
  const [flutuantes, setFlutuantes] = useState([]);

  // Remove números flutuantes após a animação terminar
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
      <button
        style={styles.btn}
        onClick={handleClick}
        className="clicker-container"
      >
        <img
          src="public/images/macaco-clicker.png"
          alt="Macaco Clicker"
          className="macaco-clicker"
        />
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
    margin: "24px 0",
  },
  btn: {
    fontSize: 90,
    background: "none",
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    lineHeight: 1,
  },
  flutuante: {
    position: "absolute",
    top: -10,
    left: "50%",
    fontSize: 16,
    fontWeight: "bold",
    pointerEvents: "none",
    animation: "subir 0.9s ease-out forwards",
  },
};
