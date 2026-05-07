// Exibe os emojis do item de produção num canto da tela
// A quantidade de emojis exibidos cresce conforme o jogador compra mais
export default function CantoProducao({ item, quantidade, canto }) {
  if (quantidade === 0) return null;

  // Mostra no máximo 12 emojis por canto para não poluir
  const total = Math.min(quantidade, 12);
  const emojis = Array.from({ length: total });

  // Posição absoluta de cada canto
  const posicao = {
    "superior-esquerdo": { top: 70,   left: 0   },
    "inferior-esquerdo": { bottom: 80, left: 0  },
    "superior-direito":  { top: 70,   right: 0  },
    "inferior-direito":  { bottom: 80, right: 0 },
  }[canto];

  // Direção que os emojis se organizam (grade)
  const alinhamento = canto.includes("direito") ? "flex-end" : "flex-start";

  return (
    <div style={{ ...styles.canto, ...posicao, alignItems: alinhamento }}>
      <p style={styles.label}>{item.nome} <strong>x{quantidade}</strong></p>
      <div style={{ ...styles.grade, justifyContent: alinhamento }}>
        {emojis.map((_, i) => (
          <span key={i} style={{
            ...styles.emoji,
            // Pequeno atraso na animação de cada emoji para ficarem alternados
            animationDelay: `${(i * 0.3) % 1.5}s`,
          }}>
            {item.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  canto: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    padding: 8,
    maxWidth: 160,
  },
  label: {
    fontSize: 11,
    background: "rgba(255,255,255,0.85)",
    padding: "2px 6px",
    marginBottom: 4,
    border: "1px solid #ccc",
  },
  grade: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  },
  emoji: {
    fontSize: 22,
    animation: "balanco 1.5s ease-in-out infinite",
    display: "inline-block",
  },
};
