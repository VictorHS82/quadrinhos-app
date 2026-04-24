# 📚 Quadrinhos App

Um aplicativo React Native para gerenciar sua coleção de quadrinhos com CRUD completo e persistência de dados em SQLite.

## 🎯 Requisitos Implementados

✅ **React Native** com Expo e TypeScript  
✅ **CRUD Básico** - Create, Read, Update, Delete de Quadrinhos  
✅ **SQLite** - Persistência de dados local  
✅ **TypeScript** - Type-safe development  
✅ **Interface Responsiva** - Design amigável e intuitivo  

## 📱 Entidade: Quadrinho

```typescript
interface Quadrinho {
  id: number;                // ID único (autoincrement)
  titulo: string;            // Título do quadrinho
  autor: string;             // Autor/Escritor
  editora: string;           // Editora
  anoPublicacao: number;     // Ano de publicação
  descricao: string;         // Descrição completa
  dataCriacao: string;       // Data de criação do registro
}
```

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (opcional)

### Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd quadrinhos-app

# Instalar dependências
npm install

# Iniciar o aplicativo
npm start
```

### Comandos Disponíveis

```bash
npm start       # Inicia o servidor Expo
npm run android # Executa no Android
npm run ios     # Executa no iOS
npm run web     # Executa na web
npm run lint    # Executar linter
```

## 📂 Estrutura do Projeto

```
quadrinhos-app/
├── app/                    # Rotas (Expo Router)
│   ├── (tabs)/            # Abas de navegação
│   │   ├── index.tsx      # Home - Lista de quadrinhos
│   │   └── explore.tsx    # Tela de exploração
│   ├── add.tsx            # Adicionar novo quadrinho
│   ├── edit/[id].tsx      # Editar quadrinho
│   ├── detail/[id].tsx    # Detalhes do quadrinho
│   └── _layout.tsx        # Configuração de rotas
│
├── database/              # Banco de dados
│   └── db.ts              # Inicialização e configuração SQLite
│
├── services/              # Lógica de negócio
│   └── QuadrinhoService.ts # CRUD de quadrinhos
│
├── screens/               # Componentes de tela
│   ├── HomeScreen.tsx     # Tela inicial
│   ├── AddEditScreen.tsx  # Adicionar/Editar
│   └── DetailScreen.tsx   # Detalhes
│
├── types/                 # Definições de tipos
│   └── Quadrinho.ts       # Interfaces da entidade
│
├── components/            # Componentes reutilizáveis
├── hooks/                 # Custom hooks
├── constants/             # Constantes da app
├── package.json           # Dependências do projeto
└── tsconfig.json          # Configuração TypeScript
```

## 🎨 Funcionalidades

### ✨ Home (Lista)
- Visualizar todos os quadrinhos
- Busca por título, autor ou editora
- Botão para adicionar novo quadrinho
- Botões rápidos para editar/deletar
- Pull-to-refresh para recarregar

### ➕ Adicionar Quadrinho
- Formulário com validação de campos
- Campos obrigatórios: Título, Autor, Editora, Ano
- Descrição opcional
- Salva automaticamente no SQLite

### ✏️ Editar Quadrinho
- Carrega dados do quadrinho selecionado
- Atualiza apenas os campos modificados
- Validação de formulário

### 👁️ Detalhes
- Visualização completa das informações
- Data de criação formatada
- Botões de editar e deletar
- Confirmação antes de deletar

### 🔍 Busca
- Pesquisa em tempo real
- Busca por título, autor ou editora
- Atualiza dinamicamente

## 💾 Banco de Dados

O projeto usa **SQLite** via `expo-sqlite` para persistência local de dados.

### Tabela de Quadrinhos

```sql
CREATE TABLE quadrinhos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  editora TEXT NOT NULL,
  anoPublicacao INTEGER NOT NULL,
  descricao TEXT,
  dataCriacao TEXT NOT NULL
);
```

## 🔧 Tecnologias Utilizadas

- **React Native 0.81.5** - Framework mobile
- **Expo 54** - Plataforma de desenvolvimento
- **TypeScript 5.9.2** - Type-safety
- **SQLite (expo-sqlite)** - Banco de dados local
- **React Navigation** - Navegação entre telas
- **Expo Router** - Roteamento declarativo

## 📦 Dependências Principais

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.33",
  "expo-router": "~6.0.23",
  "expo-sqlite": "^latest",
  "typescript": "~5.9.2"
}
```

## 🐛 Troubleshooting

### Erro ao conectar ao banco de dados
- Limpe o cache: `expo start -c`
- Verifique se o expo-sqlite está instalado corretamente

### Telas em branco
- Verifique o console para erros
- Reinicie o servidor: `npm start`

### Problemas de compilação TypeScript
- Execute: `npm install`
- Verifique o `tsconfig.json`

## 📄 Licença

Este projeto é de código aberto e disponível sob a licença MIT.

## 👤 Autor

Desenvolvido como projeto de aprendizado em React Native com TypeScript e SQLite.

---

**Versão:** 1.0.0  
**Última atualização:** Abril de 2026
