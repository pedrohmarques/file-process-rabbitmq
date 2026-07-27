# File Processing System 🚀

Sistema de processamento assíncrono de arquivos CSV e Excel utilizando arquitetura baseada em filas, permitindo o envio de múltiplos arquivos, processamento em background e acompanhamento do progresso em tempo real.

O projeto foi desenvolvido com foco em demonstrar conceitos de **arquitetura orientada a eventos**, **processamento distribuído**, **comunicação em tempo real** e **containerização**.

---

## 📌 Sobre o projeto

A aplicação permite que usuários enviem arquivos nos formatos:

- CSV
- Excel (`.xlsx`, `.xls`)

Após o upload, os arquivos são enviados para uma fila do **RabbitMQ**, onde workers independentes realizam o processamento em segundo plano.

O frontend acompanha o status de cada arquivo em tempo real através de eventos enviados pelo **Socket.IO**.

---

# 🏗️ Arquitetura
                Angular 20
                   |
                   |
            Upload de arquivos
                   |
                   |
             Node.js API
                   |
                   |
             RabbitMQ Queue
                   |
                   |
          Worker Processing Service
                   |
                   |
          Atualização de progresso
                   |
                   |
              Socket.IO
                   |
                   |
              Angular UI

              
---

# 🛠️ Tecnologias utilizadas

## Frontend

- Angular 20
- TypeScript
- RxJS
- Socket.IO Client
- SCSS

Responsável por:

- Upload de arquivos;
- Seleção múltipla de arquivos;
- Visualização do processamento;
- Atualização em tempo real dos status.

---

## Backend API

- Node.js
- Express.js
- Multer
- RabbitMQ (`amqplib`)
- Socket.IO

Responsável por:

- Receber arquivos enviados pelo frontend;
- Realizar validações;
- Criar jobs de processamento;
- Publicar mensagens no RabbitMQ;
- Enviar atualizações para os clientes conectados.

---

## Worker

Serviço independente responsável pelo processamento dos arquivos.

Responsabilidades:

- Consumir mensagens do RabbitMQ;
- Processar arquivos CSV e Excel;
- Atualizar progresso de processamento;
- Informar status da execução.

---

## Infraestrutura

- Docker
- Docker Compose
- RabbitMQ Management

Todos os serviços são executados em containers independentes.

---

# 🌐 Deploy no Netlify (Frontend)

O frontend Angular pode ser publicado no Netlify. A API, o worker e o RabbitMQ precisam estar hospedados separadamente (ex.: Railway, Render, VPS).

### Variáveis de ambiente

| Serviço | Variável | Descrição |
|---------|----------|-----------|
| **Netlify** | `API_URL` | URL pública da API (ex.: `https://api.exemplo.com`) |
| **API** | `CORS_ORIGIN` | URL do site Netlify (ex.: `https://seu-app.netlify.app`) |
| **API** | `RABBITMQ_URL` | URL de conexão do RabbitMQ |
| **API** | `PORT` | Porta do servidor (padrão: `3000`) |
| **Worker** | `RABBITMQ_URL` | URL de conexão do RabbitMQ |

Arquivos de referência: `frontend/.env.example`, `backend/api/.env.example`, `backend/worker/.env.example`.

### Passos no Netlify

1. Conecte o repositório ao Netlify.
2. O `netlify.toml` na raiz já configura build e redirects do SPA.
3. Em **Site settings → Environment variables**, adicione:
   ```
   API_URL=https://sua-api.exemplo.com
   ```
4. Na API, configure `CORS_ORIGIN` com a URL do site Netlify.

O script `frontend/scripts/set-env.js` injeta `API_URL` no build de produção automaticamente.

---

# 🔄 Fluxo de processamento

### 1. Upload

O usuário seleciona os arquivos no Angular.

A aplicação envia:

---

### 2. Criação do Job

A API recebe os arquivos utilizando Multer e cria um job:

```json
{
  "jobId": "123456",
  "filename": "clientes.csv",
  "status": "PENDING"
}