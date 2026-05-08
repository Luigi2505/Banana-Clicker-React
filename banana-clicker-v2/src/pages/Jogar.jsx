import { useGame } from "../context/GameContext";
import { ITENS_PRODUCAO, META } from "../context/GameContext";
import Macaco from "../components/Macaco";
import CantoProducao from "../components/CantoProducao";
import InventarioPowerups from "../components/InventarioPowerups";
import TelaVitoria from "../components/TelaVitoria";

export default function Jogar() {
  const { bananas, porClique, porSegundo, qtdProducao, venceu } = useGame();

  // Progresso em percentual para a barra de meta
  const progresso = Math.min((bananas / META) * 100, 100);

  return (
    // Cenário fixo: fundo de floresta/selva
    <div style={styles.pagina}>
      {/* Tela de vitória aparece por cima de tudo quando venceu */}
      {venceu && <TelaVitoria />}

      {/* Emojis de produção nos 4 cantos */}
      {ITENS_PRODUCAO.map((item) => (
        <CantoProducao
          key={item.id}
          item={item}
          quantidade={qtdProducao[item.id]}
          canto={item.canto}
        />
      ))}

      {/* Centro: contador + macaco */}
      <div style={styles.centro}>
        <div style={styles.contador}>
          <p style={styles.qtd}>{Math.floor(bananas).toLocaleString()} 🍌</p>
          <p style={styles.info}>
            +{porClique} por clique &nbsp;|&nbsp; +{porSegundo}/s
          </p>
        </div>

        <Macaco />
      </div>

      {/* Inventário de power-ups comprados (centro inferior) */}
      <InventarioPowerups />

      {/* Barra de meta na parte de baixo */}
      <div style={styles.barraArea}>
        <div style={styles.barraLabel}>
          <span>
            Meta: {Math.floor(bananas).toLocaleString()} /{" "}
            {META.toLocaleString()} 🍌
          </span>
          <span>{progresso.toFixed(1)}%</span>
        </div>
        <div style={styles.barraFundo}>
          <div
            style={{ ...styles.barraPreenchimento, width: `${progresso}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  pagina: {
    position: "relative",
    height: "calc(100vh - 60px)",
    backgroundImage: "url('/images/fundo.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  centro: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 5,
  },
  contador: {
    background: "rgba(255,255,255,0.92)",
    border: "2px solid #222",
    padding: "10px 32px",
    textAlign: "center",
    marginBottom: 8,
  },
  qtd: { fontSize: 32, fontWeight: "bold", margin: 0 },
  info: { fontSize: 13, margin: "4px 0 0", color: "#555" },

  // Barra de meta
  barraArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "6px 16px 8px",
    background: "rgba(255,255,255,0.92)",
    borderTop: "2px solid #222",
    zIndex: 10,
  },
  barraLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "monospace",
  },
  barraFundo: {
    height: 14,
    background: "#ddd",
    border: "1px solid #aaa",
    overflow: "hidden",
  },
  barraPreenchimento: {
    height: "100%",
    background: "#f9a825",
    transition: "width 0.4s ease",
  },
};
