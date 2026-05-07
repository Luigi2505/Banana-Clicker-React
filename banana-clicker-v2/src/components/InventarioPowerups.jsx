import { useState } from "react";
import { ITENS_POWERUP } from "../context/GameContext";
import { useGame } from "../context/GameContext";

// Exibe os power-ups já comprados pelo jogador
// Ao passar o mouse, o emoji cresce e aparece uma descrição
export default function InventarioPowerups() {
  const { powerupsComprados } = useGame();
  const [hoverId, setHoverId] = useState(null); // qual power-up está com hover

  // Filtra só os que foram comprados
  const comprados = ITENS_POWERUP.filter((pu) => powerupsComprados[pu.id]);

  if (comprados.length === 0) return null;

  return (
    <div style={styles.inventario}>
      <p style={styles.titulo}>Seus power-ups:</p>
      <div style={styles.lista}>
        {comprados.map((pu) => (
          <div
            key={pu.id}
            style={styles.wrapper}
            onMouseEnter={() => setHoverId(pu.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            {/* Emoji do power-up — cresce no hover */}
            <span style={{
              ...styles.emoji,
              fontSize: hoverId === pu.id ? 38 : 28,
              transition: "font-size 0.15s ease",
            }}>
              {pu.emoji}
            </span>

            {/* Tooltip que aparece no hover */}
            {hoverId === pu.id && (
              <div style={styles.tooltip}>
                <strong>{pu.nome}</strong>
                <p style={{ margin: "4px 0 0", fontSize: 11 }}>{pu.descricao}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  inventario: {
    position: "absolute",
    bottom: 90,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #aaa",
    padding: "6px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
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
