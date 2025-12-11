override UV_ENV = .venv
override UV_CACHE_DIR = .uv-cache
override TMPDIR = $(PWD)/.tmp

.PHONY: setup test

setup:
	UV_PROJECT_ENV=$(UV_ENV) UV_CACHE_DIR=$(UV_CACHE_DIR) TMPDIR=$(TMPDIR) uv pip install '.[dev]'

test:
	UV_PROJECT_ENV=$(UV_ENV) UV_CACHE_DIR=$(UV_CACHE_DIR) TMPDIR=$(TMPDIR) uv run pytest backend/tests/test_api.py

.PHONY: backend frontend
backend:
	UV_PROJECT_ENV=$(UV_ENV) UV_CACHE_DIR=$(UV_CACHE_DIR) TMPDIR=$(TMPDIR) uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm install && npm run dev -- --host
