import { createContext, useContext, useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

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

export const ITENS_PERMANENTES = [
  {
    id: "ip1",
    nome: "Salto Temporal — 4h",
    emoji: "⏩",
    preco: 2.99,
    descricao: "Recebe instantaneamente 4h de producao idle.",
    tipo: "timeskip",
    horas: 4,
  },
  {
    id: "ip2",
    nome: "Salto Temporal — 8h",
    emoji: "⏭",
    preco: 4.99,
    descricao: "Recebe instantaneamente 8h de producao idle.",
    tipo: "timeskip",
    horas: 8,
  },
  {
    id: "ip3",
    nome: "Salto Temporal — 24h",
    emoji: "🕰",
    preco: 9.99,
    descricao: "Recebe instantaneamente 24h de producao idle.",
    tipo: "timeskip",
    horas: 24,
  },
  {
    id: "ip4",
    nome: "DNA Mutante",
    emoji: "🧬",
    preco: 14.99,
    descricao: "Multiplica toda geracao de bananas por 2x para sempre.",
    tipo: "multiplicador",
  },
  {
    id: "ip5",
    nome: "Macaco Ciborgue",
    emoji: "🤖",
    preco: 7.99,
    descricao: "Clica automaticamente 10x por segundo enquanto jogar.",
    tipo: "autoclicker",
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
  const [permanentesComprados, setPermanentesComprados] = useState({});
  const [dinheiro, setDinheiro] = useState(0); // saldo em reais do usuário
  const [nomePerfil, setNomePerfil] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [venceu, setVenceu] = useState(false);
  const [cps, setCps] = useState(0);

  const cliquesNoSegundo = useRef(0);
  const multGlobal = permanentesComprados["ip4"] ? 2 : 1;

  // ── CARREGAR PROGRESSO DO FIREBASE AO INICIAR ──
  useEffect(() => {
    const carregarProgresso = async () => {
      const usuario = auth.currentUser;
      if (!usuario) {
        setCarregando(false);
        return;
      }

      const jogadorRef = doc(db, "usuarios", usuario.uid);
      const docSnap = await getDoc(jogadorRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        const p = dados.progresso;

        setNomePerfil(dados.nomePerfil || "");
        setBananas(p.bananas || 0);
        setDinheiro(p.dinheiro || 0);
        setPorClique(p.porClique || 1);
        setPorSegundo(p.porSegundo || 0);
        setQtdProducao(p.qtdProducao || { p1: 0, p2: 0, p3: 0, p4: 0 });
        setPowerupsComprados(p.powerupsComprados || {});
        setPermanentesComprados(p.permanentesComprados || {});
      }
      setCarregando(false);
    };
    carregarProgresso();
  }, []);

  // ── SALVAR NO FIREBASE (chamado manualmente e pelo auto-save) ──
  const salvarJogo = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    const jogadorRef = doc(db, "usuarios", usuario.uid);
    try {
      await updateDoc(jogadorRef, {
        progresso: {
          bananas,
          dinheiro,
          porClique,
          porSegundo,
          qtdProducao,
          powerupsComprados,
          permanentesComprados,
        },
      });
      console.log("Jogo salvo!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // ── AUTO-SAVE A CADA 30 SEGUNDOS ──
  useEffect(() => {
    if (carregando) return;
    const intervalo = setInterval(salvarJogo, 30000);
    return () => clearInterval(intervalo);
  }, [
    carregando,
    bananas,
    dinheiro,
    porClique,
    porSegundo,
    qtdProducao,
    powerupsComprados,
    permanentesComprados,
  ]);

  // ── PRODUÇÃO AUTOMÁTICA ──
  useEffect(() => {
    const intervalo = setInterval(() => {
      const producao = porSegundo * multGlobal;
      if (producao > 0) {
        setBananas((b) => {
          const novo = b + producao;
          if (novo >= META) setVenceu(true);
          return novo;
        });
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [porSegundo, multGlobal]);

  // ── AUTOCLICKER (Macaco Ciborgue) ──
  useEffect(() => {
    if (!permanentesComprados["ip5"]) return;
    const intervalo = setInterval(() => {
      setBananas((b) => {
        const novo = b + porClique * multGlobal * 10;
        if (novo >= META) setVenceu(true);
        return novo;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [permanentesComprados, porClique, multGlobal]);

  // ── CPS ──
  useEffect(() => {
    const intervalo = setInterval(() => {
      setCps(cliquesNoSegundo.current);
      cliquesNoSegundo.current = 0;
    }, 200);
    return () => clearInterval(intervalo);
  }, []);

  function clicarMacaco() {
    cliquesNoSegundo.current += 1;
    setBananas((b) => {
      const novo = b + porClique * multGlobal;
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

  // Compra item permanente com dinheiro real e salva imediatamente no Firebase
  async function comprarPermanente(item) {
    if (item.tipo !== "timeskip" && permanentesComprados[item.id]) return;
    if (dinheiro < item.preco) return;

    // Debita o dinheiro
    const novoDinheiro = Math.round((dinheiro - item.preco) * 100) / 100;
    setDinheiro(novoDinheiro);

    if (item.tipo === "timeskip") {
      setBananas((b) => {
        const novo = b + porSegundo * item.horas * 3600;
        if (novo >= META) setVenceu(true);
        return novo;
      });
    } else {
      setPermanentesComprados((c) => ({ ...c, [item.id]: true }));
    }

    // Salva imediatamente após a compra
    await salvarJogo();
  }

  function reiniciar() {
    setBananas(0);
    setPorClique(1);
    setPorSegundo(0);
    setQtdProducao({ p1: 0, p2: 0, p3: 0, p4: 0 });
    setPowerupsComprados({});
    setPermanentesComprados({});
    setVenceu(false);
    setCps(0);
    cliquesNoSegundo.current = 0;
    // Não reseta dinheiro — saldo real não volta ao reiniciar
  }

  const valor = {
    bananas,
    porClique,
    porSegundo,
    qtdProducao,
    dinheiro,
    nomePerfil,
    powerupsComprados,
    permanentesComprados,
    venceu,
    cps,
    multGlobal,
    carregando,
    clicarMacaco,
    precoProducao,
    comprarProducao,
    comprarPowerUp,
    comprarPermanente,
    salvarJogo,
    reiniciar,
  };

  return <GameContext.Provider value={valor}>{children}</GameContext.Provider>;
}
