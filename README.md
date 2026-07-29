# 🔍 AI Semantic Search using RAG + Vector Database

> An AI-powered semantic search system that understands the *meaning* behind your questions — not just the keywords.

---

## 📖 Overview

This project implements a **Retrieval Augmented Generation (RAG)** pipeline that lets users ask natural language questions and get accurate, context-aware answers pulled from a knowledge base.

Unlike traditional keyword search, this system uses **vector embeddings** and **semantic similarity search** to understand the intent behind a query — so it can find the right information even when the exact words don't match.

---

## ❓ Problem Statement

Traditional keyword-based search breaks down when the query and the document don't share the same vocabulary.

**Example:**

> **User query:** *"How does parking automation work?"*

A keyword search may return nothing useful if the source document instead talks about a *"vehicle detection system"* — even though the two are conceptually the same thing.

**The fix:** semantic search with vector embeddings, so the system can match on *meaning*, not just matching words.

---

## 💡 Solution

This project solves that problem with a RAG pipeline:

1. Convert documents into vector embeddings
2. Store embeddings in a vector database
3. Convert the user's query into an embedding
4. Run a semantic similarity search
5. Retrieve the most relevant document chunks
6. Pass that context + the query to an LLM
7. Generate a final, grounded answer

This keeps responses **accurate**, **context-aware**, and **grounded in real data** — instead of the model just guessing.

---

## ✨ Key Features

- 🧠 Semantic search using vector embeddings
- 🔄 Retrieval Augmented Generation (RAG)
- 💬 Natural language question answering
- 🎯 Context-aware response generation
- 📊 Vector similarity search
- 🧩 Modular backend architecture
- 🔌 Easily extendable into chatbots, recommendation systems, or knowledge assistants

---

## 🏗️ System Architecture

```
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
```

---

## 🛠️ Tech Stack

| Category      | Technology                          |
|---------------|--------------------------------------|
| **Backend**   | Node.js, Express.js                  |
| **AI / ML**   | Embedding Model, RAG                 |
| **Database**  | Endee Vector Database                |
| **Other**     | GitHub, REST APIs                    |

---

## 🗄️ How Endee Vector Database Is Used

**Endee** is the core retrieval engine powering this project. It enables fast, efficient vector similarity search so the system can retrieve documents based on *semantic meaning* rather than exact keyword matches.

**Flow:**

1. Documents are converted into embeddings
2. Embeddings are stored inside the Endee vector database
3. User queries are converted into embeddings
4. Endee performs a nearest-neighbor vector search
5. The top relevant results are passed to the RAG pipeline

This enables fast, scalable semantic search — even across large datasets.

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── ragPipeline.js
│
├── embeddings/
│   └── documentProcessing.js
│
├── data/
│   └── knowledge_base.txt
│
├── README.md
└── package.json
```

---

## 🚀 Installation & Setup

**1. Clone the repository**
```bash
gh repo clone sanakhan8859/RAG
cd RAG
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the server**
```bash
node server.js
```

**4. Run the application**

Once the server starts, you can send queries through API requests.

---

## 📡 Example Usage

**Request:**
```http
POST /search
Content-Type: application/json

{
  "query": "How does smart parking work?"
}
```

**Response:**

The system returns a context-aware, AI-generated answer grounded in the retrieved documents.

---

## 🔄 Example Workflow

1. Upload documents to the knowledge base
2. Convert documents into embeddings
3. Store embeddings in Endee
4. User sends a query
5. Query is converted into an embedding
6. Endee retrieves the most relevant data
7. LLM generates the final answer

---

## 🔮 Future Improvements

- [ ] Web interface for queries
- [ ] Multi-document ingestion
- [ ] Streaming responses
- [ ] Agentic AI workflows
- [ ] Multi-modal search (text + images)

---

## 🎯 Conclusion

This project shows how vector databases and RAG pipelines can power modern AI search systems. By combining semantic retrieval with large language models, it delivers accurate, context-aware responses — and the architecture can scale into AI assistants, research tools, recommendation engines, and enterprise knowledge systems.

---

## ✍️ Author

**Amber Afreen**
*Software Developer | AI Enthusiast*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
