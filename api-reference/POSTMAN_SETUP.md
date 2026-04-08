# Postman Collection Setup

Agent-CoreX provides an official Postman collection for easy API testing.

---

## Installation

### Method 1: Direct Import

1. **Download the collection:**
   - [Agent-CoreX-API.postman_collection.json](./Agent-CoreX-API.postman_collection.json)

2. **Open Postman**

3. **Click "Import"** (top-left corner)

4. **Select the JSON file** and click "Import"

5. **Add your API key** (see below)

---

### Method 2: Import from URL

1. Click **"Import"** in Postman

2. Click **"Link"** tab

3. Paste this URL:
   ```
   https://raw.githubusercontent.com/ankitpro/agent-corex/main/postman/Agent-CoreX-API.postman_collection.json
   ```

4. Click **"Import"**

---

## Configuration

### Set API Key

After importing, configure your API key:

1. **Open the collection** in Postman

2. **Click the "Variables" tab**

3. **Find `api_key` variable**

4. **Paste your API key** in the "Current Value" field

5. **Save** (Ctrl+S)

---

### Set Base URL (Optional)

Default: `https://api.agent-corex.com`

To change:

1. Open **Collection Variables**

2. Edit `base_url`

3. Save

---

## Structure

The collection includes:

```
Agent-CoreX API
├── Health & Auth (4 endpoints)
├── Tool Discovery (7 endpoints)
├── Tool Execution (5 endpoints)
├── MCP Servers (5 endpoints)
├── Capabilities & Packs (5 endpoints)
├── Custom Packs (9 endpoints)
├── Billing & Plans (4 endpoints)
├── Analytics & Logging (3 endpoints)
├── Free Tools & Recommender (4 endpoints)
├── User Servers (2 endpoints)
└── Settings (2 endpoints)
```

---

## Quick Start

### 1. Test Health Endpoint

1. Go to **Health & Auth** folder

2. Click **GET /health**

3. Click **Send**

4. You should see:
   ```json
   {
     "status": "ok"
   }
   ```

---

### 2. Search for Tools

1. Go to **Tool Discovery** folder

2. Click **GET /retrieve_tools**

3. Review the pre-filled query: `create github pull request`

4. Click **Send**

5. View results in the response panel

---

### 3. Execute a Tool

1. Go to **Tool Execution** folder

2. Click **POST /execute_tool**

3. The request body shows an example:
   ```json
   {
     "tool": "create_pull_request",
     "arguments": {
       "repository": "owner/repo",
       "title": "Fix critical bug",
       "from_branch": "hotfix/bug",
       "to_branch": "main"
     }
   }
   ```

4. Modify as needed

5. Click **Send**

---

### 4. Submit Async Job

1. Go to **Tool Execution** folder

2. Click **POST /jobs/submit**

3. Modify the request body with your tool and arguments

4. Click **Send**

5. Note the `job_id` from response

6. Use that ID to poll status with **GET /jobs/:job_id**

---

## Environment Variables

Create a Postman Environment for different settings:

1. **Environments** (top-left dropdown)

2. **Create new environment** → `Agent-CoreX Dev`

3. Add variables:
   ```
   api_key: <your-dev-api-key>
   base_url: https://api.agent-corex.com
   ```

4. Create another environment `Agent-CoreX Local`:
   ```
   api_key: <your-local-key>
   base_url: http://localhost:8000
   ```

5. Switch between environments in dropdown

---

## Pre-request Scripts

Add a pre-request script to log requests:

1. **Collection** → **Pre-request Scripts**

2. Add:
   ```javascript
   console.log("Request to: " + request.url);
   console.log("Method: " + request.method);
   ```

3. All requests will log before sending

---

## Tests

Add tests to verify responses:

1. Click any endpoint

2. Go to **Tests** tab

3. Add validation:
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   pm.test("Response is JSON", function () {
       pm.response.to.be.json;
   });
   ```

4. Send request

5. Check **Test Results** tab

---

## Workflows

Create request workflows using **Postman Runner**:

1. **Tools icon** (bottom-left)

2. Click **Runner**

3. Select **Agent-CoreX API** collection

4. Select **Health & Auth** folder

5. Click **Run**

6. Watch all requests execute in sequence

---

## Common Requests

### Search Tools
```
GET /retrieve_tools?query=deploy&top_k=5
```

### List Available Tools
```
GET /tools/registry
```

### Get Tool Details
```
GET /tools/registry/create_pull_request
```

### Execute Tool
```
POST /execute_tool
Body: { "tool": "...", "arguments": {...} }
```

### Submit Job
```
POST /jobs/submit
Body: { "tool": "...", "arguments": {...} }
```

### Check Job Status
```
GET /jobs/{job_id}
```

### List Available Packs
```
GET /packs
```

### Enable Pack
```
POST /packs/enable
Body: { "pack_id": "..." }
```

### Create Custom Server
```
POST /custom-packs/mcp-servers
Body: { "name": "...", "display_name": "..." }
```

### Create Custom Pack
```
POST /custom-packs/packs
Body: { "name": "...", "servers": [...] }
```

---

## Troubleshooting

### 401 Unauthorized

**Problem:** Getting `401 Unauthorized`

**Solution:**
1. Check API key is set in Variables
2. Verify key is not expired
3. Get new key from dashboard

---

### 429 Rate Limited

**Problem:** Getting `429 Too Many Requests`

**Solution:**
1. Wait before retrying
2. Check rate limit headers
3. Reduce request frequency

---

### 404 Not Found

**Problem:** Getting `404 Not Found`

**Solution:**
1. Check endpoint path is correct
2. Verify tool/job ID exists
3. Check base URL is correct

---

### Invalid JSON

**Problem:** Getting JSON parse error in request body

**Solution:**
1. Click **Body** tab
2. Select **raw**
3. Select **JSON** from dropdown
4. Verify JSON syntax is valid

---

## Export Requests

### Export as cURL

1. Click any request

2. Click **Code** (right panel)

3. Select **cURL**

4. Copy and paste into terminal

---

### Export Entire Collection

1. Click **...** on collection name

2. Select **Export**

3. Save as JSON

4. Use for version control or sharing

---

## Share Collection

1. Click **...** on collection

2. Select **Share Collection**

3. Follow Postman's sharing options

4. Get shareable link

---

## Tips & Tricks

### 1. Use Variables in Request Body

Instead of hardcoding values:

```json
{
  "repository": "{{github_repo}}",
  "title": "{{pr_title}}"
}
```

Then set variables in Environment.

---

### 2. Chain Requests

Extract data from one request and use in next:

In **Tests** tab of response:
```javascript
var jsonData = pm.response.json();
pm.environment.set("job_id", jsonData.job_id);
```

In next request:
```
GET /jobs/{{job_id}}
```

---

### 3. Create Request Collections

Organize related requests in folders:

- GitHub Operations
  - Create PR
  - Create Issue
  - List PRs

- AWS Operations
  - Deploy
  - Scale
  - Monitor

---

## Documentation Links

- [API Reference](/api-reference/complete-api-reference)
- [SDK Examples](/api-reference/sdks)
- [Webhooks](/api-reference/webhooks)
- [Error Handling](/api-reference/errors)

---

## Support

- **Postman Docs:** https://learning.postman.com
- **Agent-CoreX Docs:** https://docs.agent-corex.com
- **Issues:** https://github.com/ankitpro/agent-corex/issues

