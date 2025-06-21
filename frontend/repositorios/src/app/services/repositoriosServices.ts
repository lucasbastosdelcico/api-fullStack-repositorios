import axios from 'axios';
import type { Repository } from '../types/repository';
import type { CreateRepositoryDto} from '../types/createRepository';

type ApiResponse = {
  Id: number, 
  NomeRepositorio: string;
  Descricao: string;
  Linguagem: string;
  NomeDonoRepositorio: string;
  ModificationDate: string;
  IsFavorito: boolean;
};

type Filtros = {
  pageNumber: number;
  pageSize: number;
  nomeDonoRepositorio: string;
  nomeRepositorio: string;
};
export const updateFavorito = async (id: number, isFavorito: boolean): Promise<void> => {
  await axios.put(`https://localhost:7155/api/Repositories/favoritos/${id}/${isFavorito}`);
};

export const createRepository = async (repository: CreateRepositoryDto): Promise<void> => {
  await axios.post('https://localhost:7155/api/Repositories', repository);
};

export const deleteRepository = async (id: number): Promise<void> => {
  await axios.delete(`https://localhost:7155/api/Repositories/${id}`);
};

export const getRepositoryById = async (id: number): Promise<Repository> => {
  const response = await axios.get<ApiResponse>(`https://localhost:7155/api/Repositories/${id}`);
  const repo = response.data;
 
  return {
    id: repo.Id,
    nomeRepositorio: repo.NomeRepositorio,
    descricao: repo.Descricao,
    linguagem: repo.Linguagem,
    nomeDonoRepositorio: repo.NomeDonoRepositorio,
    modificationDate: repo.ModificationDate,
    isFavorito: repo.IsFavorito,
  };
};

export const updateRepository = async (id: number, repository: CreateRepositoryDto): Promise<void> => {
  await axios.put(`https://localhost:7155/api/Repositories`, repository);
};


export const getRepositories = async (
  filtros: Filtros
): Promise<{ repos: Repository[]; totalPaginas: number }> => {
  try {
    const response = await axios.get('https://localhost:7155/api/Repositories', {
      params: {
        pageNumber: filtros.pageNumber,
        pageSize: filtros.pageSize,
        nomeDonoRepositorio: filtros.nomeDonoRepositorio || undefined,
        nomeRepositorio: filtros.nomeRepositorio || undefined,
      },
    });

    const data = response.data;

    return {
      repos: (data.Item || []).map((repo: ApiResponse) => ({
        id: repo.Id,
        nomeRepositorio: repo.NomeRepositorio,
        descricao: repo.Descricao,
        linguagem: repo.Linguagem,
        nomeDonoRepositorio: repo.NomeDonoRepositorio,
        modificationDate: repo.ModificationDate,
        isFavorito: repo.IsFavorito,
      })),
      totalPaginas: data.TotalCount 
    };
  } catch (error) {
    console.error('Erro ao buscar repositórios:', error);
    return { repos: [], totalPaginas: 1 };
  }
};

export const getRepositoriosFavoritos = async (): Promise<Repository[]> => {
  try {
    const response = await axios.get<ApiResponse[]>('https://localhost:7155/api/Repositories/favoritos');
    return response.data.map((repo) => ({
      id: repo.Id,
      nomeRepositorio: repo.NomeRepositorio,
      descricao: repo.Descricao,
      linguagem: repo.Linguagem,
      nomeDonoRepositorio: repo.NomeDonoRepositorio,
      modificationDate: repo.ModificationDate,
      isFavorito: repo.IsFavorito,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []; 
    }

    throw error;
  }
};




