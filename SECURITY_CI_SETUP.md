# Security CI Setup Configuration

This document outlines the GitHub Actions continuous integration security workflow configured for the MeetMind AI repository. 

**Note: The security scanners are executed exclusively within the GitHub Actions environment upon specific branch events. No scanners were executed locally on the developer machine, nor is this document a claim that the application has been security-scanned successfully yet.**

## Configured Scanners

The `.github/workflows/security.yml` workflow orchestrates the following security scanners, running each in an isolated job:

1. **Bandit**
   - **Target:** `backend/app/` (Python source code)
   - **Purpose:** Static application security testing (SAST) for Python code to detect common vulnerabilities.
   - **Output:** `bandit-report.json`

2. **pip-audit**
   - **Target:** `backend/requirements.txt`
   - **Purpose:** Scans the Python dependencies list against known vulnerability databases (OSV, PyPI).
   - **Output:** `pip-audit-report.json`

3. **npm audit**
   - **Target:** `frontend/` (Using `package-lock.json`)
   - **Purpose:** Scans the Node.js dependency tree for known vulnerabilities.
   - **Output:** `npm-audit-report.json`

## Workflow Execution Triggers

The workflow runs automatically on the following events:
- **Push** to the `main` branch.
- **Pull Request** targeting the `main` branch.

## Failure Handling and Report Generation

The workflow is intentionally designed **not** to mask security findings:
- We do **not** use the `|| true` anti-pattern for scanner execution commands.
- If a scanner (like `npm audit` or `bandit`) identifies vulnerabilities, the tool returns a non-zero exit code. This correctly fails the corresponding GitHub Actions job, exposing the security failure immediately on the pull request or commit status.
- We utilize the `if: always()` condition for the artifact upload step in each job. This guarantees that even when a job fails (due to a vulnerability finding), the raw JSON report is preserved and uploaded as an artifact for inspection.

## Accessing Reports

When the workflow completes (or fails), you can access the reports by:
1. Navigating to the **Actions** tab in the GitHub repository.
2. Selecting the specific **Security Audit** workflow run.
3. Downloading the preserved artifacts from the **Artifacts** section at the bottom of the run summary page. The available artifacts will be:
   - `bandit-report`
   - `pip-audit-report`
   - `npm-audit-report`

SECURITY CI CONFIGURED
