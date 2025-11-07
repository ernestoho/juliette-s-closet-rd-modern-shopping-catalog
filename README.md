# Juliette's Closet RD - Modern Shopping Catalog

[cloudflarebutton]

Juliette's Closet RD is a visually breathtaking, modern e-commerce catalog designed for a seamless shopping experience. The application features a stunning dark-mode UI, showcasing products in categories like Clothing, Home, Supplements, and Amazon Various Items. Users can browse the catalog, add items to a persistent client-side shopping cart, and finalize their order by sending a pre-formatted message, including product details and their location, directly to a WhatsApp number. The architecture is built for performance and visual excellence on Cloudflare's edge network, prioritizing a fast, intuitive, and beautiful user interface.

## ✨ Key Features

*   **Modern Dark-Mode UI:** A sophisticated and visually stunning interface built for a premium user experience.
*   **Product Catalog:** Browse products across multiple categories with ease.
*   **Client-Side Shopping Cart:** A persistent shopping cart powered by Zustand for a seamless session.
*   **WhatsApp Ordering:** A unique and direct way for customers to place orders via a pre-filled WhatsApp message.
*   **Responsive Design:** Flawless layout and functionality across all device sizes, from mobile to desktop.
*   **High-Performance:** Built on Cloudflare's edge network for lightning-fast load times.

## 🚀 Technology Stack

*   **Frontend:** React, Vite, TypeScript
*   **Backend:** Hono on Cloudflare Workers
*   **State Management:** Zustand
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Animation:** Framer Motion
*   **Platform:** Cloudflare Workers & Durable Objects

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Bun](https://bun.sh/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd juliettes-closet-rd
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the backend worker simultaneously.
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The codebase is organized into three main directories:

*   `src/`: Contains the frontend React application, including pages, components, hooks, and styles.
*   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. This is where API routes and business logic reside.
*   `shared/`: Contains types and data structures that are shared between the frontend and the backend to ensure type safety.

## 🛠️ Development

During development, the `bun run dev` command utilizes Vite's proxy to forward any requests from `/api/*` to the local Wrangler server. This creates a seamless development experience.

To add new API endpoints, modify the `worker/user-routes.ts` file, following the existing patterns established with Hono.

## ☁️ Deployment

This project is configured for easy deployment to Cloudflare's global network.

1.  **Build the project:**
    This command bundles the React application and prepares the worker for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy script, which uses Wrangler to publish your application.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[cloudflarebutton]