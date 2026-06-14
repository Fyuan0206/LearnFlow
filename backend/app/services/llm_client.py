import json
from typing import TypeVar

import httpx
from pydantic import BaseModel

from app.config import settings

T = TypeVar("T", bound=BaseModel)


class LLMClient:
    def __init__(self) -> None:
        self.api_key = settings.llm_api_key
        self.base_url = settings.llm_base_url.rstrip("/")
        self.model = settings.llm_model
        self.timeout = settings.llm_timeout

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: type[T],
    ) -> T | None:
        if not self.api_key:
            return None

        schema = response_schema.model_json_schema()
        final_system = (
            f"{system_prompt}\n\n"
            "你必须只返回一个合法的 JSON 对象，不要添加 Markdown 代码块或其他说明。\n"
            "JSON Schema 如下：\n"
            f"{json.dumps(schema, ensure_ascii=False, indent=2)}"
        )

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": final_system},
                            {"role": "user", "content": user_prompt},
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.5,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                raw = data["choices"][0]["message"]["content"]
                parsed = json.loads(raw)
                return response_schema.model_validate(parsed)
        except Exception:
            return None


llm_client = LLMClient()
