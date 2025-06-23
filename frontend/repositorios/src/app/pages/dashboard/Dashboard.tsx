import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaStar, FaEdit } from 'react-icons/fa';
import {
  deleteRepository,
  getMeusRepositorios,
  getRepositories,
  getRepositoriosFavoritos,
  updateFavorito
} from '../../services/repositoriosServices';

declare global {
  interface Window {
    bootstrap: {
      Modal: new (element: HTMLElement) => {
        show: () => void;
        hide: () => void;
      };
    };
  }
}

type Repository = {
  id: number;
  nomeRepositorio: string;
  descricao: string;
  linguagem: string;
  nomeDonoRepositorio: string;
  modificationDate: string;
  isFavorito: boolean;
};

export const Dashboard = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [linguagemFiltro, setLinguagemFiltro] = useState('');
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [visualizandoMeusRepos, setVisualizandoMeusRepos] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  

  const pageSize = 5;

  const buscarRepositorios = async () => {
    try {
      if (mostrarFavoritos) {
        const favoritos = await getRepositoriosFavoritos();
        setRepos(favoritos);
        setTotalPaginas(1);
        setPaginaAtual(1);
      } else {
        const { repos, totalPaginas } = await getRepositories({
          pageNumber: paginaAtual,
          pageSize,
          nomeDonoRepositorio: nomeFiltro,
          nomeRepositorio: linguagemFiltro
        });
        setRepos(repos);
        setTotalPaginas(totalPaginas);
      }
    } catch (err) {
      console.error('Erro ao buscar repositórios:', err);
      setRepos([]);
    }
  };

  const carregarMeusRepositorios = async () => {
    try {
      const meusRepos = await getMeusRepositorios();

      const filtrados = meusRepos.filter((repo) => {
        const nomeMatch = nomeFiltro.trim() === '' || repo.nomeDonoRepositorio.toLowerCase().includes(nomeFiltro.toLowerCase());
        const repoMatch = linguagemFiltro.trim() === '' || repo.nomeRepositorio.toLowerCase().includes(linguagemFiltro.toLowerCase());
        return nomeMatch && repoMatch;
      });

      setRepos(filtrados);
      setMostrarFavoritos(false);
      setVisualizandoMeusRepos(true);
    } catch (err) {
      console.error('Erro ao carregar seus repositórios:', err);
    }
  };

  const voltarParaTodos = () => {
    setVisualizandoMeusRepos(false);
    setPaginaAtual(1);
    buscarRepositorios();
  };

 const handleFavoritar = async (id: number, isFavorito: boolean) => {
  try {
    await updateFavorito(id, !isFavorito);

    if (visualizandoMeusRepos) {
      carregarMeusRepositorios();
    } else {
      buscarRepositorios();
    }
  } catch (err) {
    console.error('Erro ao atualizar favorito:', err);
  }
};


  const abrirModal = (id: number) => {
    setIdParaExcluir(id);
    const modalEl = document.getElementById('confirmarExclusaoModal');
    if (!modalEl || !window.bootstrap?.Modal) return;

    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  };

  const confirmarExclusao = async () => {
  if (idParaExcluir !== null) {
    try {
      await deleteRepository(idParaExcluir);
      setIdParaExcluir(null);

      if (visualizandoMeusRepos) {
        carregarMeusRepositorios();
      } else {
        buscarRepositorios();
      }

    } catch (err) {
      console.error('Erro ao excluir repositório:', err);
    }
  }
};


  const editarRepositorio = (id: number) => {
    navigate(`/cadastro-repositorio/${id}`);
  };

  const toggleFavoritos = () => {
    setMostrarFavoritos(!mostrarFavoritos);
    setPaginaAtual(1);
    setVisualizandoMeusRepos(false);
  };

  useEffect(() => {
    if (!visualizandoMeusRepos) {
      buscarRepositorios();
    }
  }, [paginaAtual, mostrarFavoritos]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Repositórios API</h1>
        <div className="d-flex gap-2">
          <Link to="/cadastro-repositorio" className="btn btn-light">
            + Cadastrar Repositório
          </Link>
          {visualizandoMeusRepos ? (
            <button className="btn btn-light" onClick={voltarParaTodos}>
              Voltar
            </button>
          ) : (
            <button className="btn btn-light" onClick={carregarMeusRepositorios}>
              Filtrar Meus Repositórios
            </button>
          )}
        </div>
      </div>

      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Responsável</label>
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por responsável"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nome do Repositório</label>
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por nome"
              value={linguagemFiltro}
              onChange={(e) => setLinguagemFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-primary flex-grow-1" onClick={visualizandoMeusRepos ? carregarMeusRepositorios : buscarRepositorios}>
              Filtrar
            </button>
            <button className="btn btn-outline-secondary" onClick={toggleFavoritos}>
              {mostrarFavoritos ? 'Ver Todos' : 'Ver Favoritos'}
            </button>
          </div>
        </div>
      </div>

      {repos.length === 0 ? (
        <div className="text-center p-4 border rounded bg-light text-muted" style={{ fontStyle: 'italic' }}>
          Nenhum repositório encontrado.
        </div>
      ) : (
        <>
          <table className="table table-hover border rounded shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Linguagem</th>
                <th>Responsável</th>
                <th>Atualização</th>
                <th>Favorito</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo, index) => (
                <tr key={index}>
                  <td>{repo.id}</td>
                  <td>{repo.nomeRepositorio}</td>
                  <td>{repo.descricao}</td>
                  <td>{repo.linguagem}</td>
                  <td>{repo.nomeDonoRepositorio}</td>
                  <td>{new Date(repo.modificationDate).toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleFavoritar(repo.id, repo.isFavorito)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Favoritar"
                    >
                      <FaStar color={repo.isFavorito ? 'gold' : '#ccc'} />
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => editarRepositorio(repo.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}
                      title="Editar"
                    >
                      <FaEdit color="#007bff" />
                    </button>
                    <button
                      onClick={() => abrirModal(repo.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Excluir"
                    >
                      <FaTrash color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!mostrarFavoritos && !visualizandoMeusRepos && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-light"
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>
              <span className="text-muted">Página {paginaAtual} de {totalPaginas}</span>
              <button
                className="btn btn-light"
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      <div
        className="modal fade"
        id="confirmarExclusaoModal"
        tabIndex={-1}
        aria-labelledby="confirmarExclusaoModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmarExclusaoModalLabel">Confirmar Exclusão</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">Tem certeza que deseja excluir este repositório?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={confirmarExclusao} data-bs-dismiss="modal">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
