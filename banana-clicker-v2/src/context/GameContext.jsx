import { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { dbService } from "../services/db.service";
import { apiService } from "../services/api.service";

export const META = 50000;

export const ITENS_PRODUCAO = [
  {
    id: "p1",
    nome: "Macaquinho Ajudante",
    imagem: "/images/macaco.png",
    preco: 10,
    bananasSegundo: 10000,
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
    descricao: "Clique vale x1.2!",
  },
  {
    id: "u2",
    nome: "Dedos Turbo",
    emoji: "⚡",
    preco: 150,
    multiplicador: 1.5,
    descricao: "Clique vale x1.5!",
  },
  {
    id: "u3",
    nome: "Mao Magica",
    emoji: "🪄",
    preco: 400,
    multiplicador: 2.0,
    descricao: "Clique vale x2.0!",
  },
  {
    id: "u4",
    nome: "Braco Robotico",
    emoji: "🦾",
    preco: 1000,
    multiplicador: 3.0,
    descricao: "Clique vale x3.0!",
  },
  {
    id: "u5",
    nome: "Poder do Macaco Rei",
    emoji: "👑",
    preco: 3000,
    multiplicador: 5.0,
    descricao: "Clique vale x5.0!",
  },
];

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
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
  const [nomePerfil, setNomePerfil] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [venceu, setVenceu] = useState(false);
  const [cps, setCps] = useState(0);

  const [historicoRuns, setHistoricoRuns] = useState([]);
  const [dataInicioRun, setDataInicioRun] = useState(Date.now());

  const [climaMult, setClimaMult] = useState(1);
  const [climaInfo, setClimaInfo] = useState({
    cidade: "Carregando...",
    condicao: "",
  });

  const cliquesNoSegundo = useRef(0);
  const multGlobal = climaMult;

  useEffect(() => {
    const carregarProgresso = async () => {
      const usuario = auth.currentUser;
      if (!usuario) {
        setCarregando(false);
        return;
      }
      try {
        const dados = await dbService.carregarProgresso(usuario.uid);
        if (dados && dados.progresso) {
          const p = dados.progresso;
          setFotoPerfil(dados.fotoPerfil || null);
          setNomePerfil(dados.nomePerfil || "");
          setBananas(p.bananas || 0);
          setPorClique(p.porClique || 1);
          setPorSegundo(p.porSegundo || 0);
          setQtdProducao(p.qtdProducao || { p1: 0, p2: 0, p3: 0, p4: 0 });
          setPowerupsComprados(p.powerupsComprados || {});

          setHistoricoRuns(p.historicoRuns || []);
          setDataInicioRun(p.dataInicioRun || Date.now());
        }
      } catch (error) {
        console.error(
          "Falha ao ler o Firestore. Iniciando com dados zerados:",
          error,
        );
      } finally {
        setCarregando(false);
      }
    };
    carregarProgresso();
  }, []);

  const salvarJogo = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;
    try {
      await dbService.salvarProgresso(usuario.uid, {
        bananas,
        porClique,
        porSegundo,
        qtdProducao,
        powerupsComprados,
        historicoRuns,
        dataInicioRun,
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  async function salvarFotoPerfil(base64) {
    const usuario = auth.currentUser;
    if (!usuario) return;
    await dbService.salvarFotoPerfil(usuario.uid, base64);
    setFotoPerfil(base64);
  }

  useEffect(() => {
    if (carregando) return;
    const intervalo = setInterval(salvarJogo, 30000);
    return () => clearInterval(intervalo);
  }, [
    carregando,
    bananas,
    porClique,
    porSegundo,
    qtdProducao,
    powerupsComprados,
    historicoRuns,
  ]);

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

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCps(cliquesNoSegundo.current);
      cliquesNoSegundo.current = 0;
    }, 200);
    return () => clearInterval(intervalo);
  }, []);

  function aplicarClima(codigo, nomeCidade) {
    const ehChuva =
      (codigo >= 51 && codigo <= 65) || (codigo >= 80 && codigo <= 82);
    const ehTempestade = codigo >= 95 && codigo <= 99;
    const ehNeve =
      (codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86;
    const ehNevoeiro = codigo === 45 || codigo === 48;
    const ehGaroaGelada =
      codigo === 56 || codigo === 57 || codigo === 66 || codigo === 67;

    if (ehTempestade) {
      setClimaMult(1.5);
      setClimaInfo({ cidade: nomeCidade, condicao: `Tempestade (+50%)` });
    } else if (ehChuva) {
      setClimaMult(1.3);
      setClimaInfo({ cidade: nomeCidade, condicao: `Chuva (+30%)` });
    } else if (ehGaroaGelada) {
      setClimaMult(0.9);
      setClimaInfo({ cidade: nomeCidade, condicao: `Garoa gelada (-10%)` });
    } else if (ehNeve) {
      setClimaMult(0.85);
      setClimaInfo({ cidade: nomeCidade, condicao: `Neve (-15%)` });
    } else if (ehNevoeiro) {
      setClimaMult(0.95);
      setClimaInfo({ cidade: nomeCidade, condicao: `Nevoeiro (-5%)` });
    } else {
      setClimaMult(1.0);
      setClimaInfo({ cidade: nomeCidade, condicao: `Ceu limpo (Normal)` });
    }
  }

  async function buscarClimaCidade(lat, lon, nomeForcado) {
    const [codigo, nomeCidade] = await Promise.all([
      apiService.obterClimaAtual(lat, lon),
      nomeForcado
        ? Promise.resolve(nomeForcado)
        : apiService.obterNomeCidade(lat, lon),
    ]);
    aplicarClima(codigo, nomeCidade);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const { latitude, longitude } = posicao.coords;
          buscarClimaCidade(latitude, longitude);
        },
        () => buscarClimaCidade(-25.4284, -49.2733, "Curitiba (padrao)"),
      );
    } else {
      buscarClimaCidade(-25.4284, -49.2733, "Curitiba (padrao)");
    }
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

  // Função de Cheat para testes
  function hackBananas() {
    setBananas((b) => {
      const novo = b + 1000000;
      if (novo >= META) setVenceu(true);
      return novo;
    });
  }

  function reiniciar(salvarHistorico = false) {
    if (salvarHistorico) {
      const tempoMs = Date.now() - dataInicioRun;

      // Conta o total de itens de produção
      const totalProducao = Object.values(qtdProducao).reduce(
        (acc, val) => acc + val,
        0,
      );

      // Conta o total de powerups ativados
      const totalPowerups =
        Object.values(powerupsComprados).filter(Boolean).length;

      const novaRun = {
        id: Date.now(),
        data: new Date().toISOString(),
        tempoMs,
        totalProducao,
        totalPowerups,
        porSegundoFinal: porSegundo,
      };

      setHistoricoRuns((prev) => {
        const novoHist = [...prev, novaRun];
        return novoHist.sort((a, b) => a.tempoMs - b.tempoMs);
      });
    }

    setBananas(0);
    setPorClique(1);
    setPorSegundo(0);
    setQtdProducao({ p1: 0, p2: 0, p3: 0, p4: 0 });
    setPowerupsComprados({});
    setVenceu(false);
    setCps(0);
    cliquesNoSegundo.current = 0;
    setDataInicioRun(Date.now());
  }

  const valor = {
    bananas,
    porClique,
    porSegundo,
    qtdProducao,
    nomePerfil,
    powerupsComprados,
    venceu,
    cps,
    multGlobal,
    carregando,
    climaInfo,
    historicoRuns,
    buscarClimaCidade,
    clicarMacaco,
    precoProducao,
    comprarProducao,
    comprarPowerUp,
    salvarJogo,
    reiniciar,
    fotoPerfil,
    salvarFotoPerfil,
    hackBananas,
  };

  return <GameContext.Provider value={valor}>{children}</GameContext.Provider>;
}
