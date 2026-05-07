// Componente reutilizável: um item de loja qualquer
// Recebe as informações via props e chama onComprar quando clicado
export default function ItemLoja({ emoji, nome, descricao, badge, podePagar, jaComprou, onComprar }) {
  return (
    <button
      onClick={onComprar}
      disabled={!podePagar || jaComprou}
      style={{
        ...styles.btn,
        opacity: jaComprou ? 0.4 : podePagar ? 1 : 0.5,
        textDecoration: jaComprou ? "line-through" : "none",
      }}
    >
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <p style={styles.nome}>{nome}</p>
        <p style={styles.desc}>{descricao}</p>
      </div>
      <span style={styles.badge}>{badge}</span>
    </button>
  );
}

const styles = {
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    background: "#f0f0f0",
    border: "1px solid #aaa",
    padding: "10px 14px",
    color: "#222",
    cursor: "pointer",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  nome:  { margin: 0, fontWeight: "bold", fontSize: 14 },
  desc:  { margin: "2px 0 0", fontSize: 12 },
  badge: {
    marginLeft: "auto",
    fontWeight: "bold",
    fontSize: 14,
    background: "#ddd",
    padding: "2px 10px",
    minWidth: 32,
    textAlign: "center",
  },
};
