// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Importa a configuração do Auth

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); // Estado para mostrar mensagens de erro na tela

  const lidarComLogin = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa qualquer erro anterior antes de tentar de novo

    try {
      // Tenta autenticar o usuário no Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      
      alert("Login realizado com sucesso!");
      // O Firebase Auth guarda a sessão automaticamente. 
      // Não precisamos fazer nada mais aqui, o componente principal (App.jsx) vai perceber que o usuário logou.

    } catch (error) {
      console.error("Erro ao fazer login:", error.code);
      
      // Tratamento de erros comuns para deixar amigável para o usuário
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErro("E-mail ou senha incorretos. Tente novamente.");
      } else if (error.code === 'auth/too-many-requests') {
        setErro("Muitas tentativas falhas. Tente novamente mais tarde.");
      } else {
        setErro("Ocorreu um erro ao fazer login.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <form onSubmit={lidarComLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <h2>Fazer Login</h2>
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />

        {/* Mostra a mensagem de erro em vermelho se existir algum erro */}
        {erro && <p style={{ color: 'red', margin: '0', fontSize: '14px' }}>{erro}</p>}
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;