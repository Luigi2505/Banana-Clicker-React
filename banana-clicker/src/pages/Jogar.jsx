import { useGame } from "../context/GameContext";
import Macaco from "../components/Macaco";

// Página principal: mostra o macaco e o contador de bananas
export default function Jogar() {
  const { bananas, porClique, porSegundo, fundoAtual } = useGame();

  const estiloFundo = fundoAtual.url
    ? { backgroundImage: `url(${fundoAtual.url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div style={{ ...styles.pagina, ...estiloFundo }}>
      {/* Overlay escuro quando há imagem de fundo */}
      {fundoAtual.url && <div style={styles.overlay} />}

      <div style={styles.conteudo}>
        <div style={styles.contador}>
          <p style={styles.qtd}>{Math.floor(bananas)} 🍌</p>
          <p style={styles.info}>+{porClique} por clique &nbsp;|&nbsp; +{porSegundo}/s</p>
        </div>

        <Macaco />

        <p style={styles.dica}>Vá até a Loja para comprar melhorias!</p>
      </div>
    </div>
  );
}

const styles = {
  pagina: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    minHeight: "calc(100vh - 100px)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
  },
  conteudo: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 24,
  },
  contador: {
    background: "#fff",
    border: "2px solid #222",
    padding: "12px 40px",
    textAlign: "center",
  },
  qtd:  { fontSize: 36, fontWeight: "bold", margin: 0 },
  info: { fontSize: 13, margin: "4px 0 0" },
  dica: {
    marginTop: 12,
    fontSize: 13,
    background: "#fff",
    padding: "4px 12px",
    border: "1px solid #aaa",
  },
};
