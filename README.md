AI Semantic Search using RAG + Vector Database
Project Overview

This project implements an AI-powered semantic search system using Retrieval Augmented Generation (RAG). The system enables users to ask natural language questions and retrieves relevant information from a knowledge base using vector embeddings and semantic similarity search.

Unlike traditional keyword search, this system understands the meaning and context of queries, allowing more accurate and intelligent responses.

The project demonstrates how modern AI systems combine vector databases, embeddings, and large language models to build real-world AI applications.

Problem Statement

Traditional search systems rely on keyword matching, which often fails to understand the semantic meaning of queries.

Example:
User query:

"How does parking automation work?"

A keyword search may not find relevant results if the document uses terms like vehicle detection system instead.

To solve this problem, we use semantic search with vector embeddings, allowing the system to find contextually similar information even when exact keywords differ.

Solution

This project implements a RAG (Retrieval Augmented Generation) pipeline:

Convert documents into vector embeddings

Store embeddings in a vector database

Convert user query into embedding

Perform semantic similarity search

Retrieve the most relevant document chunks

Pass retrieved context to an LLM to generate a final answer

This architecture ensures responses are accurate, grounded in data, and context aware.

Key Features

Semantic search using vector embeddings

Retrieval Augmented Generation (RAG)

Natural language question answering

Context-aware response generation

Vector similarity search

Modular backend architecture

Easy to extend for chatbots, recommendation systems, or knowledge assistants

System Architecture
User Query
    ↓
Query Embedding
    ↓
Vector Database Search
    ↓
Top Relevant Documents
    ↓
Context + Query
    ↓
LLM Response Generation
    ↓
Final Answer to User
Tech Stack
Backend

Node.js

Express.js

AI / ML

Embedding Model

Retrieval Augmented Generation (RAG)

Database

Endee Vector Database (for storing embeddings)

Other Tools

GitHub

REST APIs

How Endee Vector Database is Used

This project uses Endee Vector Database as the core retrieval engine.

Endee enables efficient vector similarity search which allows the system to retrieve documents based on semantic meaning rather than keywords.

Steps:

Documents are converted into embeddings.

Embeddings are stored inside the Endee vector database.

User queries are converted into embeddings.

Endee performs nearest neighbor vector search.

Top relevant results are returned to the RAG pipeline.

This allows fast and scalable semantic search across large datasets.

Project Structure
project-root
│
├── backend
│   ├── server.js
│   ├── routes
│   ├── controllers
│   └── ragPipeline.js
│
├── embeddings
│   └── documentProcessing.js
│
├── data
│   └── knowledge_base.txt
│
├── README.md
└── package.json
Installation & Setup
1 Clone the repository
gh repo clone sanakhan8859/RAG
cd project-name
2 Install dependencies
npm install
3 Start the server
node server.js
4 Run the application

Once the server starts, users can send queries through API requests.

Example query:

POST /search
{
  "query": "How does smart parking work?"
}

The system will return a context-aware AI generated answer.

Example Workflow

Upload documents to knowledge base

Convert documents to embeddings

Store embeddings in Endee

User sends query

Query converted to embedding

Endee retrieves relevant data

LLM generates final answer

Future Improvements

Web interface for queries

Multi-document ingestion

Streaming responses

Agentic AI workflows

Multi-modal search (text + images)

Conclusion

This project demonstrates how vector databases and RAG pipelines can power modern AI search systems. By combining semantic retrieval with language models, the system provides accurate and context-aware responses.

The architecture can be extended to build AI assistants, research tools, recommendation engines, and enterprise knowledge systems.

Author

Amber Afreen

Software Developer | AI Enthusiast
