# Easy RAG

**Product for WebGPU Hackathon**

Easy RAG is a web application that utilizes the RAG architecture, running directly on your browser using WebGPU to harness the power of local GPU.

You can try it [here](https://instant-agent.web.app/)!

## Prerequisites

- Compatible with `devcontainer` or `GitHub Codespaces`.
- **Note**: Running via WSL will result in significant performance degradation and is thus not recommended.

## Setup

1. **Launching the Application**

   - Use `devcontainer` or `GitHub Codespaces` to launch the application. Ensure your environment meets the prerequisites for smooth operation.

2. **Environment Setup**

   - Before deploying, make sure to configure your `functions/.env` file with the Browserless API key. Refer to `.env.example` for guidance.

3. **Firebase Authentication**
   - Once the application is running via `devcontainer`, authenticate with Firebase. Execute `firebase login` to complete this step.

## Recommendations

- Ensure that you are not using the WSL interface to avoid performance issues.
- Regularly update your API keys and keep them secure to prevent unauthorized access.
