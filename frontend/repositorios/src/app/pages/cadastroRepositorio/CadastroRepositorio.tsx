import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createRepository,
  getRepositoryById,
  updateRepository
} from '../../services/repositoriosServices';

import './cadastroRepositorio.css';

export const CadastroRepositorio = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEdicao = !!id;

  const [nomeRepositorio, setNomeRepositorio] = useState('');
  const [linguagem, setLinguagem] = useState('');
  const [nomeDonoRepositorio, setNomeDonoRepositorio] = useState('');
  const [descricao, setDescricao] = useState('');

  
  useEffect(() => {
    if (isEdicao) {
      getRepositoryById(Number(id))
        .then((repo) => {
          setNomeRepositorio(repo.nomeRepositorio);
          setDescricao(repo.descricao);
          setLinguagem(repo.linguagem);
          setNomeDonoRepositorio(repo.nomeDonoRepositorio);
        })
        .catch(() => {
          alert('Erro ao carregar os dados para edição.');
          navigate('/repositorios');
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dados = {
        id,
        nomeRepositorio,
        descricao,
        linguagem,
        nomeDonoRepositorio,
      };

      if (isEdicao) {
        await updateRepository(Number(id), dados);
      } else {
        await createRepository(dados);
      }

      navigate('/repositorios');
    } catch (error) {
      console.error('Erro ao salvar repositório:', error);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{isEdicao ? 'Editar Repositório' : 'Cadastrar Repositório'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome do repositório</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: meu-repositorio"
            value={nomeRepositorio}
            onChange={(e) => setNomeRepositorio(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Linguagem</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: JavaScript"
            value={linguagem}
            onChange={(e) => setLinguagem(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Responsável pelo repositório</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome do responsável"
            value={nomeDonoRepositorio}
            onChange={(e) => setNomeDonoRepositorio(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            placeholder="Descreva o repositório"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">
            {isEdicao ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          <Link to="/repositorios" className="btn btn-light">Voltar</Link>
        </div>
      </form>
    </div>
  );
};
