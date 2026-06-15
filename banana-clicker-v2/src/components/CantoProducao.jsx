export default function CantoProducao({ item, quantidade, canto }) {
  if (quantidade === 0) return null;

  const posicao = {
    "superior-esquerdo": {
      top: "10%",
      left: "5%",
      transform: "translate(-50%, -50%)",
    },
    "inferior-esquerdo": {
      top: "85%",
      left: "5%",
      transform: "translate(-50%, -50%)",
    },
    "superior-direito": {
      top: "10%",
      left: "95%",
      transform: "translate(-50%, -50%)",
    },
    "inferior-direito": {
      top: "85%",
      left: "95%",
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
    zIndex: 2,
  },
  imagem: {
    // Em telas grandes fica 170px, em telas pequenas encolhe proporcionalmente
    width: "clamp(40px, 10vw, 100px)",
    height: "auto",
    animation: "balanco 3s ease-in-out infinite",
  },
  quantidade: {
    fontSize: "clamp(11px, 2.5vw, 16px)",
    fontWeight: "bold",
    background: "rgba(255,255,255,0.85)",
    padding: "2px 8px",
    border: "1px solid #aaa",
    marginTop: 4,
    whiteSpace: "nowrap",
  },
};
