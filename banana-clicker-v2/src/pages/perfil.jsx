import React, { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase";
import { useGame } from "../context/GameContext";

const TAMANHO_AVATAR = 128;

function formatarTempo(ms) {
  const segundosTotais = Math.floor(ms / 1000);
  const m = Math.floor(segundosTotais / 60);
  const s = segundosTotais % 60;
  return `${m}m ${s}s`;
}

export default function Perfil() {
  const { nomePerfil, fotoPerfil, salvarFotoPerfil, historicoRuns } = useGame();
  const [novoNome, setNovoNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [preview, setPreview] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");

  const [modoExclusao, setModoExclusao] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  useEffect(() => {
    if (nomePerfil) setNovoNome(nomePerfil);
  }, [nomePerfil]);

  const atualizarPerfil = async (e) => {
    e.preventDefault();
    setMensagem("");
    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const jogadorRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(jogadorRef, { nomePerfil: novoNome });
      setMensagem("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      setMensagem("Erro ao atualizar o perfil.");
    }
  };

  const deletarConta = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;
    setErroExclusao("");

    try {
      await deleteDoc(doc(db, "usuarios", usuario.uid));
      await deleteUser(usuario);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setErroExclusao(
          "Segurança: Faça logout e login novamente para excluir.",
        );
      } else {
        setErroExclusao("Erro ao excluir: " + error.message);
      }
    }
  };

  function handleArquivo(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setMensagemFoto("Selecione um arquivo de imagem válido.");
      return;
    }
    setMensagemFoto("");
    const leitor = new FileReader();
    leitor.onload = (evento) => {
      redimensionarImagem(evento.target.result, TAMANHO_AVATAR, (base64) =>
        setPreview(base64),
      );
    };
    leitor.readAsDataURL(arquivo);
  }

  function redimensionarImagem(dataUrl, tamanho, callback) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = tamanho;
      canvas.height = tamanho;
      const ctx = canvas.getContext("2d");
      const lado = Math.min(img.width, img.height);
      const offsetX = (img.width - lado) / 2;
      const offsetY = (img.height - lado) / 2;
      ctx.drawImage(img, offsetX, offsetY, lado, lado, 0, 0, tamanho, tamanho);
      callback(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = dataUrl;
  }

  async function confirmarFoto() {
    if (!preview) return;
    setSalvandoFoto(true);
    try {
      await salvarFotoPerfil(preview);
      setMensagemFoto("Foto atualizada!");
      setPreview(null);
    } catch (error) {
      setMensagemFoto("Erro ao salvar.");
    }
    setSalvandoFoto(false);
  }

  function cancelarFoto() {
    setPreview(null);
    setMensagemFoto("");
  }

  const imgSrc = preview || fotoPerfil;

  return (
    <div style={styles.pagina}>
      <h2>Configurações do Perfil</h2>

      <div style={styles.secaoSuperior}>
        {/* FOTO E NOME */}
        <div style={styles.blocoEsq}>
          <div style={styles.avatarWrapper}>
            {imgSrc ? (
              <img src={imgSrc} alt="Avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarFallback}>🐵</div>
            )}
            {preview && <span style={styles.badgePreview}>Prévia</span>}
          </div>

          <label style={styles.btnEscolher}>
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleArquivo}
              style={{ display: "none" }}
            />
          </label>

          {preview && (
            <div style={styles.acoesFoto}>
              <button
                onClick={confirmarFoto}
                disabled={salvandoFoto}
                style={styles.btnConfirmar}
              >
                {salvandoFoto ? "..." : "✓ Salvar"}
              </button>
              <button
                onClick={cancelarFoto}
                disabled={salvandoFoto}
                style={styles.btnCancelar}
              >
                ✗
              </button>
            </div>
          )}
          {mensagemFoto && (
            <p style={styles.mensagemFeedback}>{mensagemFoto}</p>
          )}

          <form onSubmit={atualizarPerfil} style={styles.formNome}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>Apelido:</label>
            <input
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
              style={styles.inputNome}
            />
            <button type="submit" style={styles.btnSalvarNome}>
              Atualizar
            </button>
            {mensagem && (
              <p style={{ ...styles.mensagemFeedback, color: "green" }}>
                {mensagem}
              </p>
            )}
          </form>
        </div>

        {/* ZONA DE PERIGO */}
        <div style={styles.zonaPerigo}>
          <h3 style={styles.tituloPerigo}>Zona de Perigo</h3>
          {!modoExclusao ? (
            <>
              <p style={styles.textoPerigo}>
                Isso apagará o histórico inteiro.
              </p>
              <button
                onClick={() => setModoExclusao(true)}
                style={styles.btnExcluir}
              >
                Excluir Conta
              </button>
            </>
          ) : (
            <div style={styles.confirmacaoExclusao}>
              <p style={styles.textoAlertaExclusao}>
                <strong>CERTEZA?</strong> Irreversível!
              </p>
              <button onClick={deletarConta} style={styles.btnExcluirConfirmar}>
                Sim, excluir
              </button>
              <button
                onClick={() => {
                  setModoExclusao(false);
                  setErroExclusao("");
                }}
                style={styles.btnExcluirCancelar}
              >
                Cancelar
              </button>
              {erroExclusao && (
                <p style={styles.erroExclusao}>{erroExclusao}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <hr style={styles.separador} />

      {/* HISTÓRICO DE SPEEDRUNS */}
      <div style={styles.secaoHistorico}>
        <h3>🏆 Meu Histórico de Speedruns</h3>
        {historicoRuns.length === 0 ? (
          <p style={styles.textoVazio}>
            Você ainda não possui vitórias registradas. Junte 50.000 bananas!
          </p>
        ) : (
          <div style={styles.tabelaWrapper}>
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.th}>Pos</th>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Tempo Gasto</th>
                  <th style={styles.th}>Itens Comprados</th>
                  <th style={styles.th}>Prod. Final</th>
                </tr>
              </thead>
              <tbody>
                {historicoRuns.map((run, index) => (
                  <tr key={run.id}>
                    <td style={styles.td}>
                      <strong>{index + 1}º</strong>
                    </td>
                    <td style={styles.td}>
                      {new Date(run.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={styles.td}>
                      <strong>{formatarTempo(run.tempoMs)}</strong>
                    </td>
                    <td style={styles.td}>
                      🏭 {run.totalProducao || 0} | ⚡ {run.totalPowerups || 0}
                    </td>
                    <td style={styles.td}>⏱ {run.porSegundoFinal}/s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pagina: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px 80px",
    overflowY: "auto",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  secaoSuperior: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
    width: "100%",
    maxWidth: 700,
    marginBottom: 24,
  },
  blocoEsq: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatarImg: {
    width: 128,
    height: 128,
    minWidth: 128,
    minHeight: 128,
    borderRadius: "50%",
    border: "2px solid #222",
    objectFit: "cover",
    background: "#fff",
  },
  avatarFallback: {
    width: 128,
    height: 128,
    minWidth: 128,
    minHeight: 128,
    borderRadius: "50%",
    border: "2px solid #222",
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 48,
  },
  badgePreview: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#f9a825",
    border: "1px solid #222",
    fontSize: 11,
    padding: "2px 8px",
  },
  btnEscolher: {
    display: "inline-block",
    padding: "6px 12px",
    background: "#222",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 12,
    marginBottom: 8,
  },
  acoesFoto: { display: "flex", gap: 8 },
  btnConfirmar: {
    padding: "6px 10px",
    background: "#2e7d32",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 12,
  },
  btnCancelar: {
    padding: "6px 10px",
    background: "#c62828",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 12,
  },
  mensagemFeedback: { fontSize: 12, color: "#555", margin: "4px 0" },
  formNome: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    marginTop: 16,
  },
  inputNome: {
    width: "100%",
    padding: 8,
    boxSizing: "border-box",
    border: "1px solid #aaa",
    fontFamily: "monospace",
  },
  btnSalvarNome: {
    padding: 8,
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    fontFamily: "monospace",
  },
  zonaPerigo: {
    textAlign: "center",
    width: "100%",
    maxWidth: 300,
    border: "1px solid red",
    padding: 20,
    borderRadius: 5,
    boxSizing: "border-box",
  },
  tituloPerigo: { color: "red", marginTop: 0, fontSize: 16 },
  textoPerigo: { fontSize: 13, margin: "12px 0" },
  btnExcluir: {
    padding: 10,
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
    width: "100%",
    fontFamily: "monospace",
  },
  confirmacaoExclusao: { display: "flex", flexDirection: "column", gap: 12 },
  textoAlertaExclusao: { fontSize: 12, color: "#c62828", margin: 0 },
  btnExcluirConfirmar: {
    padding: 8,
    cursor: "pointer",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  btnExcluirCancelar: {
    padding: 8,
    cursor: "pointer",
    backgroundColor: "#eee",
    color: "#222",
    border: "1px solid #aaa",
    fontFamily: "monospace",
  },
  erroExclusao: {
    fontSize: 11,
    color: "red",
    marginTop: 4,
    fontWeight: "bold",
  },
  separador: { width: "100%", maxWidth: 700, margin: "10px 0 30px" },
  secaoHistorico: { width: "100%", maxWidth: 700, textAlign: "center" },
  textoVazio: { fontSize: 14, color: "#555", marginTop: 16 },
  tabelaWrapper: { width: "100%", overflowX: "auto", marginTop: 16 },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    border: "1px solid #aaa",
    fontSize: 13,
    minWidth: 500,
  },
  th: {
    background: "#f0f0f0",
    padding: "10px 8px",
    textAlign: "left",
    borderBottom: "2px solid #222",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
};
