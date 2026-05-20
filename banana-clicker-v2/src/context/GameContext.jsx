import { createContext, useContext, useState, useEffect, useRef } from "react";

export const META = 50000;

export const ITENS_PRODUCAO = [
  {
    id: "p1",
    nome: "Macaquinho Ajudante",
    imagem: "/images/macaco.png",
    preco: 10,
    bananasSegundo: 1,
    canto: "superior-esquerdo",
  },
  {
    id: "p2",
    nome: "Bananal",
    imagem: "/images/bananeira.png",
    preco: 50,
    bananasSegundo: 5,
    canto: "inferior-esquerdo",
  },
  {
    id: "p3",
    nome: "Fazenda de Macacos",
    imagem: "/images/fazenda.png",
    preco: 200,
    bananasSegundo: 20,
    canto: "superior-direito",
  },
  {
    id: "p4",
    nome: "Fabrica de Banana",
    imagem: "/images/fabrica.png",
    preco: 500,
    bananasSegundo: 50,
    canto: "inferior-direito",
  },
];

export const ITENS_POWERUP = [
  {
    id: "u1",
    nome: "Luvas de Clique",
    emoji: "🧤",
    preco: 30,
    multiplicador: 1.2,
    descricao: "Suas maos ficam mais rapidas. Clique vale x1.2!",
  },
  {
    id: "u2",
    nome: "Dedos Turbo",
    emoji: "⚡",
    preco: 150,
    multiplicador: 1.5,
    descricao: "Velocidade pura nos dedos. Clique vale x1.5!",
  },
  {
    id: "u3",
    nome: "Mao Magica",
    emoji: "🪄",
    preco: 400,
    multiplicador: 2.0,
    descricao: "Magia bananeira! Clique vale x2.0!",
  },
  {
    id: "u4",
    nome: "Braco Robotico",
    emoji: "🦾",
    preco: 1000,
    multiplicador: 3.0,
    descricao: "Tecnologia de ponta. Clique vale x3.0!",
  },
  {
    id: "u5",
    nome: "Poder do Macaco Rei",
    emoji: "👑",
    preco: 3000,
    multiplicador: 5.0,
    descricao: "O poder supremo dos macacos. Clique vale x5.0!",
  },
];

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [bananas, setBananas] = useState(0);
  const [porClique, setPorClique] = useState(1);
  const [porSegundo, setPorSegundo] = useState(0);
  const [qtdProducao, setQtdProducao] = useState({
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
  });
  const [powerupsComprados, setPowerupsComprados] = useState({});
  const [venceu, setVenceu] = useState(false);
  const [cps, setCps] = useState(0);

  // Ref conta cliques no segundo atual sem causar re-renders
  const cliquesNoSegundo = useRef(0);

  // Produção automática a cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (porSegundo > 0) {
        setBananas((b) => {
          const novo = b + porSegundo;
          if (novo >= META) setVenceu(true);
          return novo;
        });
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [porSegundo]);

  // Atualiza CPS a cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setCps(cliquesNoSegundo.current);
      cliquesNoSegundo.current = 0;
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  function clicarMacaco() {
    cliquesNoSegundo.current += 1;
    setBananas((b) => {
      const novo = b + porClique;
      if (novo >= META) setVenceu(true);
      return novo;
    });
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

  function reiniciar() {
    setBananas(0);
    setPorClique(1);
    setPorSegundo(0);
    setQtdProducao({ p1: 0, p2: 0, p3: 0, p4: 0 });
    setPowerupsComprados({});
    setVenceu(false);
    setCps(0);
    cliquesNoSegundo.current = 0;
  }

  const valor = {
    bananas,
    porClique,
    porSegundo,
    qtdProducao,
    powerupsComprados,
    venceu,
    cps,
    clicarMacaco,
    precoProducao,
    comprarProducao,
    comprarPowerUp,
    reiniciar,
  };

  return <GameContext.Provider value={valor}>{children}</GameContext.Provider>;
}
