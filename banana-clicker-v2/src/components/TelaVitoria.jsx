import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

// Tela de vitória — aparece sobre tudo quando o jogador atinge a meta
export default function TelaVitoria() {
  const { bananas, porSegundo, reiniciar } = useGame();
  const navigate = useNavigate();

  function handleReiniciar() {
    reiniciar();
    navigate("/");
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.caixa}>
        <p style={styles.emoji}>🎉🐵🎉</p>
        <h1 style={styles.titulo}>VOCE VENCEU!</h1>
        <p style={styles.sub}>Você juntou 50.000 bananas!</p>

        <div style={styles.stats}>
          <p>🍌 Bananas totais: <strong>{Math.floor(bananas).toLocaleString()}</strong></p>
          <p>⏱ Produção final: <strong>{porSegundo}/s</strong></p>
        </div>

        <button style={styles.btn} onClick={handleReiniciar}>
          ↺ Jogar de novo
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  caixa: {
    background: "#fff",
    border: "3px solid #222",
    padding: "40px 60px",
    textAlign: "center",
    maxWidth: 400,
  },
  emoji:  { fontSize: 48, margin: "0 0 8px" },
  titulo: { fontSize: 32, margin: "0 0 8px" },
  sub:    { fontSize: 16, color: "#555", margin: "0 0 20px" },
  stats: {
    background: "#f5f5f5",
    border: "1px solid #ddd",
    padding: "12px 20px",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 2,
  },
  btn: {
    padding: "10px 32px",
    fontSize: 16,
    fontFamily: "monospace",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
