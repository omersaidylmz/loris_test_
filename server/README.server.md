# Loris server PoC

1) Install
   cd server
   npm ci

2) Local dev
   cp .env.example .env
   # fill .env with your secrets (OPENAI_API_KEY etc.)
   npm run dev
   # server at http://localhost:8080

3) Reindex (creates embeddings in Pinecone)
   npm run reindex
   # or POST /api/reindex with header x-admin-token: <ADMIN_TOKEN>

4) Search example
   POST /api/search
   Body:
   {
     "selectedProfiles": ["Narenciye","Çiçeksi","Vanilya"],
     "gender": "maskulen",
     "topK": 10,
     "freeText": null
   }
