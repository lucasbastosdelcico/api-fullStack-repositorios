import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaStar, FaEdit } from 'react-icons/fa';
import {
  deleteRepository,
  getRepositories,
  getRepositoriosFavoritos,
  updateFavorito,
} from '../../services/repositoriosServices';
import { useNavigate } from 'react-router-dom';

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
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 10;
  const navigate = useNavigate();
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const buscarRepositorios = async () => {
    try {
      const { repos, totalPaginas } = await getRepositories({
        pageNumber: paginaAtual,
        pageSize,
        nomeDonoRepositorio: nomeFiltro,
        nomeRepositorio: linguagemFiltro,
      });

      setRepos(repos);
      setTotalPaginas(totalPaginas || 1);
    } catch (err) {
      console.error('Erro ao buscar repositórios:', err);
      setRepos([]);
      setTotalPaginas(1);
    }
  };

  const handleFiltrar = () => {
    setPaginaAtual(1); 
    buscarRepositorios();
  };

  const toggleFavoritos = async () => {
  setMostrarFavoritos(!mostrarFavoritos);

  if (!mostrarFavoritos) {
    const favoritos = await getRepositoriosFavoritos();
    setRepos(favoritos);
  } else {
    buscarRepositorios(); 
  }
};

  const handleFavoritar = async (id: number, isFavorito: boolean) => {
    try {
      await updateFavorito(id, !isFavorito);
      buscarRepositorios();
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
        buscarRepositorios();
      } catch (err) {
        console.error('Erro ao excluir repositório:', err);
      }
    }
  };

  const editarRepositorio = (id: number) => {
  navigate(`/cadastro-repositorio/${id}`);
};

  useEffect(() => {
    buscarRepositorios();
  }, [paginaAtual]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Repositórios-API</h1>

    
      <div className="row mb-3">
        <div className="col-md-5">
          <input
            maxLength={20}
            type="text"
            className="form-control"
            placeholder="Filtrar por nome do responsável"
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            maxLength={20}
            type="text"
            className="form-control"
            placeholder="Filtrar por nome do repositório"
            value={linguagemFiltro}
            onChange={(e) => setLinguagemFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleFiltrar}>
            Filtrar
          </button>
        </div>
      </div>

     
      {repos.length === 0 ? (
        <div className="text-center p-4 border rounded bg-light text-muted" style={{ fontStyle: 'italic' }}>
          Nenhum repositório encontrado.
        </div>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Linguagem</th>
                <th>Responsável</th>
                <th>Última atualização</th>
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
                      type="button"
                      className="botao-estrela"
                      onClick={() => handleFavoritar(repo.id, repo.isFavorito)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FaStar color={repo.isFavorito ? 'gold' : '#ccc'} />
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => editarRepositorio(repo.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
                    title="Editar"
                  >
                    <FaEdit color="#007bff" />
                  </button>

                  <button
                    type="button"
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

        
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-light"
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>
            <span>Página {paginaAtual} de {totalPaginas}</span>
            <button
              className="btn btn-light"
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </button>
          </div>
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
<div className="col-md-12 mt-3">
  <div className="d-flex justify-content-between">
    <button onClick={toggleFavoritos} className="btn btn-light">
      {mostrarFavoritos ? 'Ver Todos' : 'Ver Favoritos'}
    </button>
    <Link to="/cadastro-repositorio" className="btn btn-light">
      Cadastrar Repositório
    </Link>
  </div>
</div>
    </div>
  );
};
