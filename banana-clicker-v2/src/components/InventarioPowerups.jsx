import { useState } from "react";
import { ITENS_POWERUP, useGame } from "../context/GameContext";

export default function InventarioPowerups() {
  const { powerupsComprados } = useGame();
  const [hoverId, setHoverId] = useState(null);

  const powerupsAtivos = ITENS_POWERUP.filter((pu) => powerupsComprados[pu.id]);

  if (powerupsAtivos.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.barra}>
        <p style={styles.titulo}>Power-ups:</p>
        <div style={styles.lista}>
          {powerupsAtivos.map((pu) => (
            <ItemInventario
              key={pu.id}
              id={pu.id}
              emoji={pu.emoji}
              nome={pu.nome}
              descricao={pu.descricao}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemInventario({ id, emoji, nome, descricao, hoverId, setHoverId }) {
  return (
    <div
      style={styles.wrapper}
      onMouseEnter={() => setHoverId(id)}
      onMouseLeave={() => setHoverId(null)}
    >
      <span
        style={{
          ...styles.emoji,
          fontSize:
            hoverId === id
              ? "clamp(28px, 6vw, 38px)"
              : "clamp(20px, 5vw, 28px)",
          transition: "font-size 0.15s ease",
        }}
      >
        {emoji}
      </span>
      {hoverId === id && (
        <div style={styles.tooltip}>
          <strong>{nome}</strong>
          <p style={{ margin: "4px 0 0", fontSize: 11 }}>{descricao}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    bottom: "clamp(60px, 12vh, 90px)",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    zIndex: 10,
    maxWidth: "92vw",
  },
  barra: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #aaa",
    padding: "4px clamp(8px, 2vw, 16px)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  titulo: {
    fontSize: "clamp(10px, 2vw, 12px)",
    color: "#555",
    margin: 0,
    whiteSpace: "nowrap",
  },
  lista: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  wrapper: {
    position: "relative",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "clamp(32px, 8vw, 44px)",
    height: "clamp(32px, 8vw, 44px)",
  },
  emoji: { display: "inline-block", lineHeight: 1 },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    border: "1px solid #222",
    padding: "6px 10px",
    fontSize: 12,
    whiteSpace: "nowrap",
    zIndex: 20,
    boxShadow: "2px 2px 0 #ccc",
    maxWidth: "60vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
