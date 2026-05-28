import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [nomePerfil, setNomePerfil] = useState('');

  const lidarComCadastro = async (e) => {
    e.preventDefault();

    const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regexSenha.test(senha)) {
      alert("A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um símbolo.");
      return;
    }

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, senha);
      const usuario = credencial.user;

      // Cria o documento do jogador apenas com os dados essenciais para o jogo infinito
      await setDoc(doc(db, "usuarios", usuario.uid), {
        nome: nome,
        nomePerfil: nomePerfil,
        email: email,
        dataCriacao: new Date(),
        progresso: { bananas: 0, dinheiro: 0, multiplicador: 1 }
      });

      alert("Conta criada! Pronto para clicar.");
    } catch (error) {
      alert("Erro ao criar conta: " + error.message);
    }
  };

  return (
    <form onSubmit={lidarComCadastro} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
      <h2>Criar Conta</h2>
      <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="text" placeholder="Apelido" value={nomePerfil} onChange={(e) => setNomePerfil(e.target.value)} required />
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default Cadastro;