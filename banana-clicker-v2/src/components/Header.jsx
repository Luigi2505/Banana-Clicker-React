import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useGame } from "../context/GameContext";

export default function Header() {
  const { bananas, dinheiro, nomePerfil, salvarJogo } = useGame();
  const location = useLocation();

  async function sair() {
    console.log("Iniciando processo de logout...");

    // Dispara o salvamento de forma assíncrona. Se travar, o catch captura e a vida segue.
    // NUNCA dê await nisso durante um logout.
    salvarJogo().catch((e) =>
      console.warn("Falha ao salvar no banco antes de sair:", e),
    );

    try {
      await authService.sair();
      console.log("Logout efetuado. Redirecionando...");
    } catch (e) {
      console.error("Erro ao deslogar o usuário:", e);
    }
  }

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#222",
    background: location.pathname === path ? "#222" : "transparent",
    padding: "6px 14px",
    border: "1px solid #222",
    fontFamily: "monospace",
    fontSize: 14,
  });

  return (
    <header style={styles.header}>
      <span style={styles.logo}>🍌 {nomePerfil || "Banana Clicker"}</span>

      <nav style={styles.nav}>
        <Link to="/" style={linkStyle("/")}>
          🐵 Jogar
        </Link>
        <Link to="/loja" style={linkStyle("/loja")}>
          🛒 Loja
        </Link>
        <Link to="/ranking" style={linkStyle("/ranking")}>
          🏆 Ranking
        </Link>
      </nav>

      <div style={styles.direita}>
        <span style={styles.saldo}>🍌 {Math.floor(bananas)}</span>
        <span style={styles.dinheiro}>💰 R$ {dinheiro.toFixed(2)}</span>
        <button style={styles.sairBtn} onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 24px",
    background: "#fff",
    borderBottom: "2px solid #222",
    flexWrap: "wrap",
    gap: 8,
  },
  logo: { fontWeight: "bold", fontSize: 16 },
  nav: { display: "flex", gap: 8 },
  direita: { display: "flex", alignItems: "center", gap: 12 },
  saldo: { fontWeight: "bold", fontSize: 15 },
  dinheiro: { fontSize: 13, color: "#555" },
  sairBtn: {
    padding: "4px 12px",
    background: "transparent",
    border: "1px solid #aaa",
    fontFamily: "monospace",
    fontSize: 12,
    cursor: "pointer",
  },
};
