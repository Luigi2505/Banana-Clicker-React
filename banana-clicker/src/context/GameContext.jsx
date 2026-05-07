import { createContext, useContext, useState, useEffect } from "react";

// Dados dos itens da loja (ficam aqui para serem usados em qualquer página)
export const ITENS_PRODUCAO = [
  { id: "p1", nome: "Macaquinho Ajudante", emoji: "🐒", preco: 10,   bananasSegundo: 1   },
  { id: "p2", nome: "Bananal",             emoji: "🌴", preco: 50,   bananasSegundo: 5   },
  { id: "p3", nome: "Fazenda de Macacos",  emoji: "🏡", preco: 200,  bananasSegundo: 20  },
  { id: "p4", nome: "Fabrica de Banana",   emoji: "🏭", preco: 500,  bananasSegundo: 50  },
  { id: "p5", nome: "Nave Bananeira",      emoji: "🚀", preco: 2000, bananasSegundo: 200 },
];

export const ITENS_POWERUP = [
  { id: "u1", nome: "Luvas de Clique",     emoji: "🧤", preco: 30,   multiplicador: 1.2 },
  { id: "u2", nome: "Dedos Turbo",         emoji: "⚡", preco: 150,  multiplicador: 1.5 },
  { id: "u3", nome: "Mao Magica",          emoji: "🪄", preco: 400,  multiplicador: 2.0 },
  { id: "u4", nome: "Braco Robotico",      emoji: "🦾", preco: 1000, multiplicador: 3.0 },
  { id: "u5", nome: "Poder do Macaco Rei", emoji: "👑", preco: 3000, multiplicador: 5.0 },
];

export const FUNDOS = [
  { id: "f0", nome: "Padrao",    emoji: "⬜", preco: 0,    url: null },
  { id: "f1", nome: "Floresta",  emoji: "🌲", preco: 100,  url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80" },
  { id: "f2", nome: "Cidade",    emoji: "🏙", preco: 300,  url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80" },
  { id: "f3", nome: "Praia",     emoji: "🏖", preco: 800,  url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80" },
  { id: "f4", nome: "Montanha",  emoji: "🏔", preco: 2000, url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" },
  { id: "f5", nome: "Galaxia",   emoji: "🌌", preco: 5000, url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80" },
];

// Criação do contexto
const GameContext = createContext();

// Hook para usar o contexto facilmente
export function useGame() {
  return useContext(GameContext);
}

// Provider: envolve a aplicação e disponibiliza o estado do jogo
export function GameProvider({ children }) {
  const [bananas, setBananas]               = useState(0);
  const [porClique, setPorClique]           = useState(1);
  const [porSegundo, setPorSegundo]         = useState(0);
  const [qtdProducao, setQtdProducao]       = useState({ p1:0, p2:0, p3:0, p4:0, p5:0 });
  const [powerupsComprados, setPowerupsComprados] = useState({});
  const [fundosComprados, setFundosComprados]     = useState({ f0: true });
  const [fundoAtual, setFundoAtual]         = useState(FUNDOS[0]);

  // Produção automática a cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (porSegundo > 0) setBananas((b) => b + porSegundo);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [porSegundo]);

  function clicarMacaco() {
    setBananas((b) => b + porClique);
  }

  function precoProducao(item) {
    return Math.floor(item.preco * Math.pow(1.15, qtdProducao[item.id]));
  }

  function comprarProducao(item) {
    const preco = precoProducao(item);
    if (bananas < preco) return;
    setBananas((b) => b - preco);
    setPorSegundo((ps) => ps + item.bananasSegundo);
    setQtdProducao((q) => ({ ...q, [item.id]: q[item.id] + 1 }));
  }

  function comprarPowerUp(item) {
    if (powerupsComprados[item.id] || bananas < item.preco) return;
    setBananas((b) => b - item.preco);
    setPorClique((pc) => Math.round(pc * item.multiplicador * 10) / 10);
    setPowerupsComprados((c) => ({ ...c, [item.id]: true }));
  }

  function comprarFundo(f) {
    if (fundosComprados[f.id]) {
      setFundoAtual(f);
    } else {
      if (bananas < f.preco) return;
      setBananas((b) => b - f.preco);
      setFundosComprados((fc) => ({ ...fc, [f.id]: true }));
      setFundoAtual(f);
    }
  }

  // Tudo que as páginas podem acessar
  const valor = {
    bananas, porClique, porSegundo,
    qtdProducao, powerupsComprados, fundosComprados, fundoAtual,
    clicarMacaco, precoProducao,
    comprarProducao, comprarPowerUp, comprarFundo,
  };

  return <GameContext.Provider value={valor}>{children}</GameContext.Provider>;
}
