import { useGame } from "../context/GameContext";
import { ITENS_PRODUCAO, META } from "../context/GameContext";
import Macaco from "../components/Macaco";
import CantoProducao from "../components/CantoProducao";
import InventarioPowerups from "../components/InventarioPowerups";
import TelaVitoria from "../components/TelaVitoria";

export default function Jogar() {
  const {
    bananas,
    porClique,
    porSegundo,
    qtdProducao,
    venceu,
    cps,
    climaInfo,
  } = useGame();

  const progresso = Math.min((bananas / META) * 100, 100);

  return (
    <div style={styles.pagina}>
      {venceu && <TelaVitoria />}

      {ITENS_PRODUCAO.map((item) => (
        <CantoProducao
          key={item.id}
          item={item}
          quantidade={qtdProducao[item.id]}
          canto={item.canto}
        />
      ))}

      <div style={styles.centro}>
        <div style={styles.contador}>
          <p style={styles.qtd}>{Math.floor(bananas).toLocaleString()} 🍌</p>
          <p style={styles.info}>
            +{porClique} por clique &nbsp;|&nbsp; +{porSegundo}/s
          </p>
          <p style={styles.info}>CPS: {cps}</p>
          <p style={styles.info}>
            🌤 {climaInfo.cidade}: {climaInfo.condicao}
          </p>
        </div>

        <Macaco />
      </div>

      <InventarioPowerups />

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
    height: "100%",
    width: "100%",
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
    width: "100%",
    padding: "0 8px",
    boxSizing: "border-box",
  },
  contador: {
    background: "rgba(255,255,255,0.92)",
    border: "2px solid #222",
    padding: "clamp(6px, 1.5vh, 10px) clamp(6px, 2vw, 32px)",
    textAlign: "center",
    marginBottom: 8,
    width: "min(60vw, 380px)",
    boxSizing: "border-box",
  },
  qtd: {
    fontSize: "clamp(18px, 5vw, 32px)",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  },
  info: {
    fontSize: "clamp(9px, 1.8vw, 13px)",
    margin: "4px 0 0",
    color: "#555",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  },

  barraArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "6px clamp(8px, 2vw, 16px) 8px",
    background: "rgba(255,255,255,0.92)",
    borderTop: "2px solid #222",
    zIndex: 10,
  },
  barraLabel: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 4,
    fontSize: "clamp(10px, 2vw, 12px)",
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
