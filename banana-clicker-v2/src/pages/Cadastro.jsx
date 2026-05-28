import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { dbService } from "../services/db.service";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [nomePerfil, setNomePerfil] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function lidarComCadastro(e) {
    e.preventDefault();
    setErro("");

    const regexSenha =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regexSenha.test(senha)) {
      setErro(
        "Senha deve ter 8+ caracteres, uma maiúscula, um número e um símbolo.",
      );
      return;
    }

    try {
      const credencial = await authService.cadastrar(email, senha);
      const usuario = credencial.user;

      // Cria o documento do jogador no Firestore via serviço com progresso inicial zerado
      await dbService.criarPerfil(usuario.uid, {
        nome,
        nomePerfil,
        email,
        dataCriacao: new Date(),
        progresso: {
          bananas: 0,
          dinheiro: 0,
          porClique: 1,
          porSegundo: 0,
          qtdProducao: { p1: 0, p2: 0, p3: 0, p4: 0 },
          powerupsComprados: {},
          permanentesComprados: {},
        },
      });

      navigate("/"); // Vai direto para o jogo após cadastrar
    } catch (error) {
      setErro("Erro ao criar conta: " + error.message);
    }
  }

  return (
    <div style={styles.pagina}>
      <div style={styles.caixa}>
        <h1 style={styles.titulo}>🍌 Banana Clicker</h1>
        <h2 style={styles.subtitulo}>Criar Conta</h2>

        <form onSubmit={lidarComCadastro} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Apelido"
            value={nomePerfil}
            onChange={(e) => setNomePerfil(e.target.value)}
            required
          />
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

          <button style={styles.btn} type="submit">
            Cadastrar
          </button>
        </form>

        <p style={styles.link}>
          Já tem conta? <Link to="/">Fazer login</Link>
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
