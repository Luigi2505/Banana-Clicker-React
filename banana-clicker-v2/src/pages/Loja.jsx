import { useState } from "react";
import { useGame, ITENS_PRODUCAO, ITENS_POWERUP } from "../context/GameContext";
import ItemLoja from "../components/ItemLoja";

export default function Loja() {
  const [aba, setAba] = useState("producao");

  const {
    bananas,
    qtdProducao,
    powerupsComprados,
    precoProducao,
    comprarProducao,
    comprarPowerUp,
  } = useGame();

  const abaStyle = (nome) => ({
    flex: 1,
    padding: "7px 4px",
    fontFamily: "monospace",
    fontSize: 12,
    cursor: "pointer",
    background: aba === nome ? "#222" : "#eee",
    color: aba === nome ? "#fff" : "#222",
    border: aba === nome ? "1px solid #222" : "1px solid #aaa",
    fontWeight: aba === nome ? "bold" : "normal",
  });

  return (
    <div style={styles.pagina}>
      <h2 style={styles.titulo}>🛒 Loja</h2>

      <div style={styles.abas}>
        <button style={abaStyle("producao")} onClick={() => setAba("producao")}>
          🏭 Producao
        </button>
        <button style={abaStyle("powerup")} onClick={() => setAba("powerup")}>
          ⚡ Power-ups
        </button>
      </div>

      {/* Aba: Produção */}
      {aba === "producao" &&
        ITENS_PRODUCAO.map((item) => {
          const preco = precoProducao(item);
          return (
            <ItemLoja
              key={item.id}
              emoji={item.emoji}
              nome={item.nome}
              descricao={`🍌 ${preco} | +${item.bananasSegundo}/s`}
              badge={`x${qtdProducao[item.id]}`}
              podePagar={bananas >= preco}
              jaComprou={false}
              onComprar={() => comprarProducao(item)}
            />
          );
        })}

      {/* Aba: Power-ups */}
      {aba === "powerup" &&
        ITENS_POWERUP.map((item) => {
          const jaComprou = powerupsComprados[item.id];
          return (
            <ItemLoja
              key={item.id}
              emoji={item.emoji}
              nome={item.nome}
              descricao={`🍌 ${item.preco} | clique x${item.multiplicador}`}
              badge={jaComprou ? "✓" : "—"}
              podePagar={bananas >= item.preco}
              jaComprou={jaComprou}
              onComprar={() => comprarPowerUp(item)}
            />
          );
        })}
    </div>
  );
}

const styles = {
  pagina: { maxWidth: 500, margin: "0 auto", padding: 24 },
  titulo: {
    fontSize: 22,
    marginBottom: 16,
    borderBottom: "2px solid #222",
    paddingBottom: 8,
  },
  abas: { display: "flex", gap: 4, marginBottom: 16 },
};
