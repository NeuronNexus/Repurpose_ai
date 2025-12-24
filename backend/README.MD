# RepurposeAI – Backend Architecture

The backend is the **core intelligence layer** of RepurposeAI.
It is responsible for all reasoning, orchestration, validation, and synthesis.

This is not a CRUD backend.
It is an **agentic research system**.

---

## 1. Tech Stack

- Python
- FastAPI
- Ollama (local LLM execution)
- reportlab (PDF generation)

No database is used in the MVP.

---

## 2. Architectural Role

The backend:
- receives high-level user intent
- decomposes it into structured research tasks
- executes those tasks via specialized agents
- validates and normalizes all outputs
- synthesizes cross-domain insights
- produces both JSON and PDF outputs

The backend is:
- stateless
- deterministic (given LLM variability)
- schema-strict

---

## 3. Core Concepts

### Multi-Agent Design

The MVP intentionally uses **three agents only**:

1. Master Agent
2. Clinical Evidence Agent
3. Patent Analysis Agent

This is a design constraint to:
- reduce integration complexity
- make reasoning traceable
- keep the MVP defensible

---

### Schema-First Architecture

All agent outputs must conform to strict schemas.
The backend never trusts raw LLM output.

Key techniques:
- safe JSON extraction
- normalization of lists
- flattening of nested objects
- strict FastAPI response models

This prevents:
- runtime failures
- frontend crashes
- hallucinated structure

---

## 4. Agent Responsibilities

### Master Agent
- Interprets the user query
- Extracts drug and indication
- Defines objectives and assumptions
- Creates task plan for other agents
- Performs final synthesis
- Produces hypothesis strength score

Acts as the **system brain**.

---

### Clinical Evidence Agent
- Analyzes biomedical evidence conceptually
- Structures studies by:
  - type
  - outcome
  - signal
  - limitations
- Produces confidence notes
- Outputs an overall evidence signal

Focuses on **scientific credibility**.

---

### Patent Analysis Agent
- Analyzes patent landscape conceptually
- Identifies key patents
- Determines freedom-to-operate
- Surfaces risks and white-space opportunities

Focuses on **IP feasibility**.

---

## 5. Orchestration Flow

1. `/api/analyze` receives user query
2. Master Agent generates investigation plan
3. Clinical Agent executes evidence analysis
4. Patent Agent executes IP analysis
5. Master Agent synthesizes all outputs
6. Backend returns a single validated JSON object

There is no streaming or partial output.

---

## 6. API Endpoints

### Analyze Endpoint
```
POST /api/analyze
```

Input:
```json
{
  "query": "Evaluate Drug X for Indication Y"
}
```

Output:
- Full multi-agent structured analysis

### PDF Report Endpoint
```
POST /api/report/pdf
```

Input:
```json
{
  "analysis": { ...full analysis JSON... }
}
```

Output:
- Executive PDF research brief

---

## 7. PDF Generation

PDFs are generated using reportlab (platypus).

Design goals:
- deterministic layout
- offline capability
- consulting-style brief
- 1–2 pages maximum

No HTML or browser-based rendering is used.

---

## 8. LLM Integration

- Ollama runs locally
- Model: llama3.1:8b
- Used for all reasoning steps
- Slow but private and reproducible

The backend is designed to tolerate:
- long inference times
- non-JSON output
- verbose responses

Normalization layers ensure stability.

---

## 9. CORS & Frontend Communication

CORS is explicitly enabled to allow:
- Vite frontend (localhost:5173)
- FastAPI backend (127.0.0.1:8000)

This is a development and demo configuration.

---

## 10. What the Backend Does NOT Do

- No authentication
- No persistence
- No external API calls (yet)
- No fine-tuning
- No streaming tokens

These are intentional MVP exclusions.

---

## 11. Summary

The backend is a research-grade agentic system, not a chatbot API.

Its core value lies in:
- structured reasoning
- cross-domain synthesis
- strict validation
- executive-ready outputs

Everything else is secondary.
