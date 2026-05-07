// Componente de rodapé simples
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <span>🍌 Banana Clicker — Projeto React BSI 2025</span>
    </footer>
  );
}

const styles = {
  footer: {
    padding: "12px 24px",
    background: "#fff",
    borderTop: "2px solid #222",
    textAlign: "center",
    fontSize: 13,
    marginTop: "auto",
  },
};
