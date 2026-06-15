import React, { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase";
import { useGame } from "../context/GameContext";

const TAMANHO_AVATAR = 128;

export default function Perfil() {
  const { nomePerfil, fotoPerfil, salvarFotoPerfil } = useGame();
  const [novoNome, setNovoNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Estado do upload de imagem
  const [preview, setPreview] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");

  // Estado de Exclusão de Conta (Substitui o window.confirm/alert)
  const [modoExclusao, setModoExclusao] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  useEffect(() => {
    if (nomePerfil) {
      setNovoNome(nomePerfil);
    }
  }, [nomePerfil]);

  const atualizarPerfil = async (e) => {
    e.preventDefault();
    setMensagem("");

    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const jogadorRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(jogadorRef, { nomePerfil: novoNome });
      setMensagem(
        "Perfil atualizado com sucesso! (Recarregue a página para ver a mudança no jogo)",
      );
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
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
      // App.jsx detectará o logout automaticamente e redirecionará.
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === "auth/requires-recent-login") {
        setErroExclusao(
          "Segurança: Você precisa fazer logout e login novamente para confirmar esta exclusão.",
        );
      } else {
        setErroExclusao("Erro ao excluir a conta: " + error.message);
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
      redimensionarImagem(evento.target.result, TAMANHO_AVATAR, (base64) => {
        setPreview(base64);
      });
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
      setMensagemFoto("Foto de perfil atualizada!");
      setPreview(null);
    } catch (error) {
      setMensagemFoto("Erro ao salvar a foto.");
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

      {/* ── Foto de perfil ── */}
      <div style={styles.secaoFoto}>
        <div style={styles.avatarWrapper}>
          {imgSrc ? (
            <img src={imgSrc} alt="Avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarFallback}>🐵</div>
          )}

          {preview && <span style={styles.badgePreview}>Pré-visualização</span>}
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
              {salvandoFoto ? "Salvando..." : "✓ Confirmar"}
            </button>
            <button
              onClick={cancelarFoto}
              disabled={salvandoFoto}
              style={styles.btnCancelar}
            >
              ✗ Cancelar
            </button>
          </div>
        )}

        {mensagemFoto && <p style={styles.mensagemFoto}>{mensagemFoto}</p>}
      </div>

      {/* Formulário de Atualização de nome */}
      <form onSubmit={atualizarPerfil} style={styles.formNome}>
        <div>
          <label style={{ fontWeight: "bold" }}>
            Nome de Perfil (Apelido):
          </label>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            required
            style={styles.inputNome}
          />
        </div>

        <button type="submit" style={styles.btnSalvarNome}>
          Salvar Alterações
        </button>

        {mensagem && <p style={styles.mensagemSucesso}>{mensagem}</p>}
      </form>

      <hr style={styles.separador} />

      {/* Zona de Perigo - Exclusão de Conta */}
      <div style={styles.zonaPerigo}>
        <h3 style={styles.tituloPerigo}>Zona de Perigo</h3>

        {!modoExclusao ? (
          <>
            <p style={styles.textoPerigo}>
              Ao excluir sua conta, não será possível recuperar seu progresso.
            </p>
            <button
              onClick={() => setModoExclusao(true)}
              style={styles.btnExcluir}
            >
              Excluir Minha Conta
            </button>
          </>
        ) : (
          <div style={styles.confirmacaoExclusao}>
            <p style={styles.textoAlertaExclusao}>
              <strong>CERTEZA ABSOLUTA?</strong> Você perderá todas as suas
              bananas e upgrades. Esta ação não pode ser desfeita!
            </p>
            <div style={styles.acoesExclusao}>
              <button onClick={deletarConta} style={styles.btnExcluirConfirmar}>
                Sim, excluir para sempre
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
            </div>
            {erroExclusao && <p style={styles.erroExclusao}>{erroExclusao}</p>}
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
    padding: "24px 16px 80px", // Margem extra no final garante scroll total sem cortar o botão
    overflowY: "auto",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  secaoFoto: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImg: {
    width: 128,
    height: 128,
    minWidth: 128, // Impede esmagamento flexbox
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
    whiteSpace: "nowrap",
  },
  btnEscolher: {
    display: "inline-block",
    padding: "8px 16px",
    background: "#222",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 13,
    marginBottom: 8,
  },
  acoesFoto: { display: "flex", gap: 8 },
  btnConfirmar: {
    padding: "6px 14px",
    background: "#2e7d32",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 13,
  },
  btnCancelar: {
    padding: "6px 14px",
    background: "#c62828",
    color: "#fff",
    border: "1px solid #222",
    cursor: "pointer",
    fontSize: 13,
  },
  mensagemFoto: { fontSize: 13, color: "#555", marginTop: 8 },
  formNome: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    width: "100%",
    maxWidth: 300,
    marginBottom: 40,
  },
  inputNome: {
    width: "100%",
    padding: 8,
    marginTop: 5,
    boxSizing: "border-box",
  },
  btnSalvarNome: {
    padding: 10,
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
  },
  mensagemSucesso: { color: "green", fontSize: 14, textAlign: "center" },
  separador: { width: "100%", maxWidth: 300, marginBottom: 30 },
  zonaPerigo: {
    textAlign: "center",
    width: "100%",
    maxWidth: 300,
    border: "1px solid red",
    padding: 20,
    borderRadius: 5,
    boxSizing: "border-box",
  },
  tituloPerigo: { color: "red", marginTop: 0 },
  textoPerigo: { fontSize: 14 },
  btnExcluir: {
    padding: 10,
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
    width: "100%",
  },
  confirmacaoExclusao: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  textoAlertaExclusao: { fontSize: 13, color: "#c62828", margin: 0 },
  acoesExclusao: { display: "flex", flexDirection: "column", gap: 6 },
  btnExcluirConfirmar: {
    padding: 8,
    cursor: "pointer",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    fontWeight: "bold",
  },
  btnExcluirCancelar: {
    padding: 8,
    cursor: "pointer",
    backgroundColor: "#eee",
    color: "#222",
    border: "1px solid #aaa",
  },
  erroExclusao: {
    fontSize: 12,
    color: "red",
    marginTop: 8,
    fontWeight: "bold",
  },
};
