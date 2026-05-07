import { useGame } from "../context/GameContext";
import { ITENS_POWERUP, META } from "../context/GameContext";

const RANKING_SIMULADO = [
  { nome: "Macaco Mestre",   bananas: 99999 },
  { nome: "BananaLord",      bananas: 45200 },
  { nome: "Rei dos Macacos", bananas: 12800 },
  { nome: "ClicadorPro",     bananas: 8750  },
  { nome: "Você",            bananas: null  },
];

export default function Ranking() {
  const { bananas, porClique, porSegundo, qtdProducao, powerupsComprados } = useGame();

  const totalPowerups = Object.keys(powerupsComprados).length;
  const totalProducao = Object.values(qtdProducao).reduce((a, b) => a + b, 0);
  const progresso     = Math.min(((bananas / META) * 100), 100).toFixed(1);

  const ranking = RANKING_SIMULADO
    .map((r) => ({ ...r, bananas: r.bananas ?? Math.floor(bananas) }))
    .sort((a, b) => b.bananas - a.bananas);

  return (
    <div style={styles.pagina}>
      <h2 style={styles.titulo}>🏆 Ranking & Estatísticas</h2>

      <div style={styles.secao}>
        <h3 style={styles.subtitulo}>📊 Suas Estatísticas</h3>
        <table style={styles.tabela}>
          <tbody>
            <tr><td style={styles.td}>🍌 Bananas acumuladas</td>      <td style={styles.tdNum}>{Math.floor(bananas).toLocaleString()}</td></tr>
            <tr><td style={styles.td}>👆 Bananas por clique</td>      <td style={styles.tdNum}>{porClique}</td></tr>
            <tr><td style={styles.td}>⏱ Bananas por segundo</td>     <td style={styles.tdNum}>{porSegundo}</td></tr>
            <tr><td style={styles.td}>🏭 Itens de producao</td>       <td style={styles.tdNum}>{totalProducao}</td></tr>
            <tr><td style={styles.td}>⚡ Power-ups comprados</td>     <td style={styles.tdNum}>{totalPowerups} / {ITENS_POWERUP.length}</td></tr>
            <tr><td style={styles.td}>🎯 Progresso para a meta</td>   <td style={styles.tdNum}>{progresso}%</td></tr>
          </tbody>
        </table>
      </div>

      <div style={styles.secao}>
        <h3 style={styles.subtitulo}>🥇 Placar Geral</h3>
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Jogador</th>
              <th style={styles.th}>Bananas</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, i) => (
              <tr key={r.nome} style={{ background: r.nome === "Você" ? "#fffde7" : "transparent" }}>
                <td style={styles.td}>{i + 1}º</td>
                <td style={styles.td}>{r.nome === "Você" ? `👤 ${r.nome}` : r.nome}</td>
                <td style={styles.tdNum}>🍌 {r.bananas.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  pagina:    { maxWidth: 520, margin: "0 auto", padding: 24 },
  titulo:    { fontSize: 22, marginBottom: 20, borderBottom: "2px solid #222", paddingBottom: 8 },
  secao:     { marginBottom: 28 },
  subtitulo: { fontSize: 16, marginBottom: 10 },
  tabela:    { width: "100%", borderCollapse: "collapse", border: "1px solid #aaa", background: "#fff", fontSize: 14 },
  th:        { padding: "8px 12px", borderBottom: "2px solid #222", textAlign: "left", background: "#f0f0f0" },
  td:        { padding: "8px 12px", borderBottom: "1px solid #ddd" },
  tdNum:     { padding: "8px 12px", borderBottom: "1px solid #ddd", textAlign: "right", fontWeight: "bold" },
};
