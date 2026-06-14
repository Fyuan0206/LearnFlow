# 个人知识与效率协作中枢 — 后端

FastAPI + SQLite 后端，提供 `POST /api/research` 等接口。

## 本地启动

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# 按需编辑 .env 配置 LLM_API_KEY；留空则使用 mock 数据兜底
uvicorn app.main:app --reload --port 8000
```

## 接口文档

启动后访问：http://localhost:8000/docs

## 测试

```bash
curl http://localhost:8000/api/health

curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"query":"我要学 MCP","mode":"topic","userLevel":"beginner","timeBudgetHours":6}'
```

无 LLM_API_KEY 时，系统会返回 mock 数据，保证演示可用。
