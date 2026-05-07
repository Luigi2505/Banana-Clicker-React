import { useState } from "react";
import { useGame } from "../context/GameContext";
import { ITENS_PRODUCAO, ITENS_POWERUP } from "../context/GameContext";
import ItemLoja from "../components/ItemLoja";

export default function Loja() {
  const [aba, setAba] = useState("producao");

  const { bananas, qtdProducao, powerupsComprados, precoProducao, comprarProducao, comprarPowerUp } = useGame();

  return (
    <div style={styles.pagina}>
      <h2 style={styles.titulo}>🛒 Loja</h2>

      {/* Duas abas: Produção e Power-ups */}
      <div style={styles.abas}>
        <button style={aba === "producao" ? styles.abaAtiva : styles.aba} onClick={() => setAba("producao")}>
          🏭 Producao
        </button>
        <button style={aba === "powerup" ? styles.abaAtiva : styles.aba} onClick={() => setAba("powerup")}>
          ⚡ Power-ups
        </button>
      </div>

      {/* Aba: itens que geram bananas por segundo */}
      {aba === "producao" && ITENS_PRODUCAO.map((item) => {
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

      {/* Aba: power-ups de clique (compra única) */}
      {aba === "powerup" && ITENS_POWERUP.map((item) => {
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
  titulo: { fontSize: 22, marginBottom: 16, borderBottom: "2px solid #222", paddingBottom: 8 },
  abas:   { display: "flex", gap: 4, marginBottom: 16 },
  aba: {
    flex: 1, padding: "7px 4px", background: "#eee", border: "1px solid #aaa",
    cursor: "pointer", fontFamily: "monospace", fontSize: 13,
  },
  abaAtiva: {
    flex: 1, padding: "7px 4px", background: "#222", color: "#fff",
    border: "1px solid #222", cursor: "pointer", fontFamily: "monospace",
    fontSize: 13, fontWeight: "bold",
  },
};
