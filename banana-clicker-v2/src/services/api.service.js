// Camada de serviço — consumo de APIs externas
export const apiService = {
  // Open-Meteo: busca o código de clima atual (WMO) para uma coordenada
  async obterClimaAtual(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error("Falha ao buscar clima");
      const dados = await resposta.json();
      return dados.current_weather.weathercode;
    } catch (error) {
      console.error("Erro na API de clima:", error);
      return 0;
    }
  },

  // BigDataCloud: busca o nome da cidade a partir de coordenadas (geocodificação reversa)
  async obterNomeCidade(lat, lon) {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`;
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error("Falha ao buscar cidade");
      const dados = await resposta.json();
      // 'city' costuma vir vazio em áreas rurais, então cai para 'locality'
      return dados.city || dados.locality || "Localizacao desconhecida";
    } catch (error) {
      console.error("Erro na API de geocodificacao:", error);
      return "Localizacao desconhecida";
    }
  },
};
