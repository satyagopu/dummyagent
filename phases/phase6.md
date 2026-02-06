# Phase 6: Credentials & Settings Management 🔐

## 🎯 Goal
Empower users to bring their own AI models by strictly managing API keys. Move away from system-wide `.env` keys to user-specific, encrypted credentials stored in the database.

## 🛠️ Implementation Guide

### 1. Backend: Secure Storage 🛡️
*   **Database Schema**:
    *   Update `User` model or create `UserCredentials` table.
    *   Fields: `provider` (openai, google, anthropic), `api_key` (encrypted), `is_active`.
*   **Encryption Service**:
    *   Implement `app/services/encryption.py` using `cryptography` (Fernet).
    *   Ensure the master key is stored securely in `.env` (`ENCRYPTION_KEY`).
*   **API Endpoints**:
    *   `GET /api/settings/credentials`: List configured providers (mask keys, e.g., `sk-...X8d`).
    *   `POST /api/settings/credentials`: Add/Update an API key.
    *   `DELETE /api/settings/credentials/{provider}`: Remove a key.

### 2. Backend: Runtime Integration 🧠
*   **Update `LLMService`**:
    *   Modify `get_llm_service` to accept a `user_id`.
    *   Logic: Look for User's key first. If missing, fail (or fallback to system key only if explicitly allowed by config).
*   **Update `GraphExecutor`**:
    *   Pass `user_id` context down to `_process_llm_node` and `_process_agent_node`.
    *   Retrieve the specific decrypted key at runtime for the requested model.

### 3. Frontend: Settings Page ⚙️
*   **New Route**: `/settings` (Protected).
*   **Layout**: Sidebar navigation or Tabs (Account, API Keys, Preferences).
*   **API Keys Section**:
    *   List of providers (OpenAI, Gemini, Anthropic).
    *   Input fields with "Show/Hide" toggle.
    *   "Verify" button to test the key immediately upon entry.
*   **Profile Section**:
    *   Update Name/Email.
    *   Change Password.

## 📋 Execution Steps

### Step 1: Backend Foundation
- [ ] Install `cryptography`.
- [ ] Create `EncryptionService`.
- [ ] Update Database Models (`alembic` migration if needed, or simple reset).

### Step 2: Settings API
- [ ] Implement `SettingsRouter` (`app/api/settings.py`).
- [ ] Implement CRUD for credentials.

### Step 3: Executor Update
- [ ] Refactor `GraphExecutor` to require `user_tokens`.
- [ ] Update `LLMService` to use dynamic keys.

### Step 4: Frontend UI
- [ ] Create `SettingsPage`.
- [ ] Build `CredentialsForm`.
- [ ] Integrate with `SettingsAPI`.

## ✅ Verification
- [ ] **Security Test**: Verify API keys are stored as random strings (encrypted) in the DB, not plain text.
- [ ] **Functional Test**: Add an OpenAI key in Settings -> Run a workflow using GPT-3.5 -> Verify it works.
- [ ] **Isolation Test**: User A's key should not be accessible to User B.
