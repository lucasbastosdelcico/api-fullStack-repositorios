# Repositórios API

Este projeto é uma API para gerenciamento de repositórios, construída com .NET 8 e Entity Framework Core InMemory, e inclui uma aplicação frontend React para consumo da API.

---

## Tecnologias e Dependências

### Backend (.NET 8)

- **.NET SDK:** 8.0
- **Entity Framework Core Design:** v9.0.6  
  Usado para scaffolding e migrações de banco de dados.
- **Entity Framework Core InMemory:** v9.0.6  
  Banco de dados em memória para desenvolvimento e testes.
- **Swashbuckle.AspNetCore:** v6.6.2  
  Geração automática de documentação Swagger para a API.

### Frontend (React + TypeScript)

- React com TypeScript
- React Router DOM
- Axios para requisições HTTP
- React Icons para ícones visuais (estrelas, editar, excluir)
- Bootstrap para estilos e componentes UI

---

## Estrutura do Projeto

- **Backend:** API REST construída em ASP.NET Core com suporte a operações CRUD para repositórios, incluindo filtros, paginação, favoritos e autenticação simples.
- **Frontend:** Interface React para listar, filtrar, favoritar, editar e excluir repositórios. Integração completa com a API via Axios.

---

## Configuração e Execução

### Backend

1. Certifique-se de ter o [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) instalado.
2. No diretório do backend, restaure as dependências:
   ```bash
   dotnet restore
