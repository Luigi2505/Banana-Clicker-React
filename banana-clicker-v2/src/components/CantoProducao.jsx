export default function CantoProducao({ item, quantidade, canto }) {
  if (quantidade === 0) return null;

  const posicao = {
    "superior-esquerdo": {
      top: "20%",
      left: "25%",
      transform: "translate(-50%, -50%)",
    },
    "inferior-esquerdo": {
      top: "70%",
      left: "25%",
      transform: "translate(-50%, -50%)",
    },
    "superior-direito": {
      top: "20%",
      left: "75%",
      transform: "translate(-50%, -50%)",
    },
    "inferior-direito": {
      top: "70%",
      left: "75%",
      transform: "translate(-50%, -50%)",
    },
  }[canto];

  return (
    <div style={{ ...styles.canto, ...posicao }}>
      <img src={item.imagem} style={styles.imagem} />
      <p style={styles.quantidade}>{quantidade}x</p>
    </div>
  );
}

const styles = {
  canto: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imagem: {
    width: 170,
    height: "auto",
    animation: "balanco 3s ease-in-out infinite",
  },
  quantidade: {
    fontSize: 16,
    fontWeight: "bold",
    background: "rgba(255,255,255,0.85)",
    padding: "2px 8px",
    border: "1px solid #aaa",
    marginTop: 4,
  },
};
