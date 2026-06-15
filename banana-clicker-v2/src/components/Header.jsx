import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useGame } from "../context/GameContext";

export default function Header() {
  const { bananas, dinheiro, nomePerfil, salvarJogo } = useGame();
  const location = useLocation();

  async function sair() {
    // Força o logout imediatamente e recarrega a página para limpar a memória
    await signOut(auth);
    window.location.reload();
  }

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#222",
    background: location.pathname === path ? "#222" : "transparent",
    padding: "6px 10px",
    border: "1px solid #222",
    fontFamily: "monospace",
    fontSize: "clamp(11px, 2.2vw, 14px)",
    whiteSpace: "nowrap",
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
        {/* LINK DO PERFIL MOVIDO PARA DENTRO DO NAV */}
        <Link to="/perfil" style={linkStyle("/perfil")}>
          👤 Perfil
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
    padding: "8px clamp(8px, 2vw, 24px)",
    background: "#fff",
    borderBottom: "2px solid #222",
    flexWrap: "wrap",
    gap: "clamp(4px, 1vw, 8px)",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "clamp(12px, 2.5vw, 16px)",
    whiteSpace: "nowrap",
  },
  nav: { display: "flex", gap: "clamp(4px, 1vw, 8px)", flexWrap: "wrap" },
  direita: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(6px, 1.5vw, 12px)",
    flexWrap: "wrap",
  },
  saldo: {
    fontWeight: "bold",
    fontSize: "clamp(12px, 2.2vw, 15px)",
    whiteSpace: "nowrap",
  },
  dinheiro: {
    fontSize: "clamp(10px, 2vw, 13px)",
    color: "#555",
    whiteSpace: "nowrap",
  },
  sairBtn: {
    padding: "4px 10px",
    background: "transparent",
    border: "1px solid #aaa",
    fontFamily: "monospace",
    fontSize: "clamp(10px, 2vw, 12px)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
