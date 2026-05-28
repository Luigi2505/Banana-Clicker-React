import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function lidarComLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await authService.login(email, senha);
      // App.jsx detecta o login automaticamente via onAuthStateChanged
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErro("E-mail ou senha incorretos.");
      } else if (error.code === "auth/too-many-requests") {
        setErro("Muitas tentativas. Tente mais tarde.");
      } else {
        setErro("Erro ao fazer login.");
      }
    }
    setCarregando(false);
  }

  return (
    <div style={styles.pagina}>
      <div style={styles.caixa}>
        <h1 style={styles.titulo}>🍌 Banana Clicker</h1>
        <h2 style={styles.subtitulo}>Entrar</h2>

        <form onSubmit={lidarComLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p style={styles.erro}>{erro}</p>}

          <button style={styles.btn} type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={styles.link}>
          Não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pagina: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  caixa: {
    background: "#fff",
    border: "2px solid #222",
    padding: "40px 48px",
    width: 340,
    fontFamily: "monospace",
  },
  titulo: { fontSize: 22, margin: "0 0 4px", textAlign: "center" },
  subtitulo: {
    fontSize: 16,
    margin: "0 0 24px",
    textAlign: "center",
    fontWeight: "normal",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "10px 12px",
    border: "1px solid #aaa",
    fontFamily: "monospace",
    fontSize: 14,
  },
  erro: { color: "red", fontSize: 13, margin: 0 },
  btn: {
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "none",
    fontFamily: "monospace",
    fontSize: 14,
    cursor: "pointer",
  },
  link: { marginTop: 16, fontSize: 13, textAlign: "center" },
};
