AI Search Backend with Retrieval-Augmented Generation (RAG)
A production-ready backend application that answers user queries using Retrieval-Augmented Generation (RAG). It retrieves relevant context from a vector database (Milvus) using OpenAI embeddings,
and passes that context to OpenAI's GPT models to generate accurate, context-aware responses.

🚀 Tech Stack
Backend: Node.js, Express.js

NLP & Embeddings: Python, OpenAI Embeddings (text-embedding-3-small)

Vector Search: Milvus

Database: MongoDB

AI Model: OpenAI GPT (GPT-3.5 / GPT-4 via API)

API Type: RESTful

Deployment: Render, Netlify (Frontend)

📌 Features
🔹 Convert long documents into vector embeddings using OpenAI's embedding API

🔹 Store and manage document embeddings in Milvus vector database

🔹 Accept user query → embed it → retrieve relevant document chunks

🔹 Inject context into prompt → call OpenAI's GPT model → return AI-generated answer

🔹 Clean API design for frontend consumption

🔹 Modular backend: text chunking, embedding, vector search, and GPT query are all separated
