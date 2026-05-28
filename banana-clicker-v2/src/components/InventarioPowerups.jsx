import { useState } from "react";
import { ITENS_POWERUP, ITENS_PERMANENTES } from "../context/GameContext";
import { useGame } from "../context/GameContext";

export default function InventarioPowerups() {
  const { powerupsComprados, permanentesComprados } = useGame();
  const [hoverId, setHoverId] = useState(null);

  const powerupsAtivos = ITENS_POWERUP.filter((pu) => powerupsComprados[pu.id]);
  // Timeskip não aparece no inventário (não é permanente de verdade)
  const permanentesAtivos = ITENS_PERMANENTES.filter(
    (it) => it.tipo !== "timeskip" && permanentesComprados[it.id],
  );

  if (powerupsAtivos.length === 0 && permanentesAtivos.length === 0)
    return null;

  return (
    <div style={styles.container}>
      {/* Barra 1: Power-ups */}
      {powerupsAtivos.length > 0 && (
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
      )}

      {/* Barra 2: Itens Permanentes ativos */}
      {permanentesAtivos.length > 0 && (
        <div style={styles.barra}>
          <p style={styles.titulo}>Permanentes:</p>
          <div style={styles.lista}>
            {permanentesAtivos.map((it) => (
              <ItemInventario
                key={it.id}
                id={it.id}
                emoji={it.emoji}
                nome={it.nome}
                descricao={it.descricao}
                hoverId={hoverId}
                setHoverId={setHoverId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente interno reutilizável para cada item do inventário
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
          fontSize: hoverId === id ? 38 : 28,
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
    bottom: 90,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    zIndex: 10,
  },
  barra: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #aaa",
    padding: "6px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 12,
    color: "#555",
    margin: 0,
    whiteSpace: "nowrap",
  },
  lista: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  wrapper: {
    position: "relative",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  emoji: {
    display: "inline-block",
    lineHeight: 1,
  },
  tooltip: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    border: "1px solid #222",
    padding: "6px 10px",
    fontSize: 12,
    whiteSpace: "nowrap",
    zIndex: 20,
    pointerEvents: "none",
    boxShadow: "2px 2px 0 #ccc",
  },
};
