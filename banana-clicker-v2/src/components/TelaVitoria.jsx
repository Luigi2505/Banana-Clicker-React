import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

export default function TelaVitoria() {
  const { bananas, porSegundo, reiniciar } = useGame();
  const navigate = useNavigate();

  function handleReiniciar() {
    // Passamos 'true' para indicar que essa reinicialização foi uma vitória legítima
    reiniciar(true);
    navigate("/");
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.caixa}>
        <p style={styles.emoji}>🎉🐵🎉</p>
        <h1 style={styles.titulo}>VOCE VENCEU!</h1>
        <p style={styles.sub}>Você atingiu a meta do Bananal!</p>

        <div style={styles.stats}>
          <p>
            🍌 Bananas totais:{" "}
            <strong>{Math.floor(bananas).toLocaleString()}</strong>
          </p>
          <p>
            ⏱ Produção final: <strong>{porSegundo}/s</strong>
          </p>
        </div>

        <button style={styles.btn} onClick={handleReiniciar}>
          ↺ Guardar Recorde e Jogar de Novo
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
  emoji: { fontSize: 48, margin: "0 0 8px" },
  titulo: { fontSize: 32, margin: "0 0 8px" },
  sub: { fontSize: 16, color: "#555", margin: "0 0 20px" },
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
    fontSize: 14,
    fontFamily: "monospace",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
