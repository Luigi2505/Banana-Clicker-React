import { useState } from "react";
import { useGame } from "../context/GameContext";
import {
  ITENS_PRODUCAO,
  ITENS_POWERUP,
  ITENS_PERMANENTES,
} from "../context/GameContext";
import ItemLoja from "../components/ItemLoja";

export default function Loja() {
  const [aba, setAba] = useState("producao");

  const {
    bananas,
    qtdProducao,
    powerupsComprados,
    permanentesComprados,
    precoProducao,
    comprarProducao,
    comprarPowerUp,
    comprarPermanente,
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

      {/* 3 abas */}
      <div style={styles.abas}>
        <button style={abaStyle("producao")} onClick={() => setAba("producao")}>
          🏭 Producao
        </button>
        <button style={abaStyle("powerup")} onClick={() => setAba("powerup")}>
          ⚡ Power-ups
        </button>
        <button
          style={abaStyle("permanente")}
          onClick={() => setAba("permanente")}
        >
          💎 Itens Permanentes
        </button>
      </div>

      {/* Aba: Produção */}
      {aba === "producao" &&
        ITENS_PRODUCAO.map((item) => {
          const preco = precoProducao(item);
          return (
            <ItemLoja
              key={item.id}
              emoji={item.imagem ? undefined : item.emoji}
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

      {/* Aba: Itens Permanentes */}
      {aba === "permanente" && (
        <div>
          {/* Aviso de que o pagamento será integrado depois */}
          <div style={styles.aviso}>
            💳 Pagamento com dinheiro real será integrado em breve. Por
            enquanto, clique para simular a compra.
          </div>

          {ITENS_PERMANENTES.map((item) => {
            const jaComprou =
              item.tipo !== "timeskip" && permanentesComprados[item.id];
            return (
              <ItemLoja
                key={item.id}
                emoji={item.emoji}
                nome={item.nome}
                descricao={`${item.preco} — ${item.descricao}`}
                badge={jaComprou ? "✓" : item.tipo === "timeskip" ? "+" : "—"}
                podePagar={true}
                jaComprou={jaComprou}
                onComprar={() => comprarPermanente(item)}
              />
            );
          })}
        </div>
      )}
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
  aviso: {
    background: "#fff8e1",
    border: "1px solid #f9a825",
    padding: "8px 12px",
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 1.5,
  },
};
