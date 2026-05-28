import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useGame } from '../context/GameContext';

export default function Perfil() {
  const { nomePerfil } = useGame(); // Pega o nome atual do contexto
  const [novoNome, setNovoNome] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Preenche o input com o nome atual assim que a tela carregar
  useEffect(() => {
    if (nomePerfil) {
      setNovoNome(nomePerfil);
    }
  }, [nomePerfil]);

  const atualizarPerfil = async (e) => {
    e.preventDefault();
    setMensagem('');

    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const jogadorRef = doc(db, 'usuarios', usuario.uid);
      
      // Atualiza apenas o campo nomePerfil no banco de dados
      await updateDoc(jogadorRef, {
        nomePerfil: novoNome
      });
      
      setMensagem('Perfil atualizado com sucesso! (Recarregue a página para ver a mudança no jogo)');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMensagem('Erro ao atualizar o perfil.');
    }
  };

  const deletarConta = async () => {
    const confirmacao = window.confirm(
      "TEM CERTEZA ABSOLUTA? Você perderá todas as suas bananas, dinheiro e upgrades. Essa ação não pode ser desfeita!"
    );
    
    if (!confirmacao) return;

    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      // 1. Deleta os dados do jogador (o "Save") do Firestore
      await deleteDoc(doc(db, 'usuarios', usuario.uid));
      
      // 2. Deleta a conta de autenticação do usuário
      await deleteUser(usuario);
      
      alert("Sua conta foi excluída para sempre. Adeus, macaco!");
      // O onAuthStateChanged no App.jsx vai detectar a exclusão e jogar o usuário para a tela de Login automaticamente.
      
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      
      // Tratamento de segurança do Firebase
      if (error.code === 'auth/requires-recent-login') {
        alert("Por motivos de segurança, você precisa ter feito login recentemente para excluir sua conta. Saia, faça login novamente e tente excluir.");
      } else {
        alert('Erro ao excluir a conta: ' + error.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
      <h2>Configurações do Perfil</h2>
      
      {/* Formulário de Atualização */}
      <form onSubmit={atualizarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', marginBottom: '40px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Nome de Perfil (Apelido):</label>
          <input 
            type="text" 
            value={novoNome} 
            onChange={(e) => setNovoNome(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Salvar Alterações
        </button>
        
        {mensagem && <p style={{ color: 'green', fontSize: '14px', textAlign: 'center' }}>{mensagem}</p>}
      </form>

      <hr style={{ width: '300px', marginBottom: '30px' }} />

      {/* Zona de Perigo - Exclusão de Conta */}
      <div style={{ textAlign: 'center', width: '300px', border: '1px solid red', padding: '20px', borderRadius: '5px' }}>
        <h3 style={{ color: 'red', marginTop: 0 }}>Zona de Perigo</h3>
        <p style={{ fontSize: '14px' }}>Ao excluir sua conta, não será possível recuperar seu progresso.</p>
        <button 
          onClick={deletarConta} 
          style={{ padding: '10px', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none', width: '100%' }}
        >
          Excluir Minha Conta
        </button>
      </div>
    </div>
  );
}