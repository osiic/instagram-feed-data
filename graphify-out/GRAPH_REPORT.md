# Graph Report - instagram-feed  (2026-09-13)

## Corpus Check
- Corpus is ~3,469 words - fits in a single context window. You may not need a graph.

## Summary
- 139 nodes · 155 edges · 17 communities (12 shown, 4 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Security & Implementation Rules
- TypeScript Compiler Config
- Dev Dependencies & Tooling
- Package Manifest & Scripts
- Instagram REST API Routes
- TypeScript Path & Build Inclusions
- Static Brand Assets & Icons
- Application Architecture & Layers
- Runtime Dependencies
- Prisma Relational Database Models
- Product Requirements & Scope
- Root Layout & Font Setup
- Next.js Agent Breaking Changes
- ESLint Configuration
- Next.js Runtime Config
- PostCSS Style Pipeline

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `API Contract Document` - 8 edges
3. `include` - 7 edges
4. `Database Design Document` - 7 edges
5. `Architecture Specification` - 6 edges
6. `scripts` - 5 edges
7. `CLAUDE.md Guidance` - 5 edges
8. `GET /api/instagram/accounts/:id` - 5 edges
9. `Application Services Layer` - 5 edges
10. `InstagramAccount Model` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Preserve Architecture Constraint` --semantically_similar_to--> `Claude Code Layer Rules`  [INFERRED] [semantically similar]
  docs/AI_IMPLEMENTATION_RULES.md → CLAUDE.md
- `Multi-Account Isolation Enforcement` --semantically_similar_to--> `Database Ownership Verification Rule`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/DATABASE.md
- `Multi-Account Isolation Enforcement` --semantically_similar_to--> `User Ownership Authorization`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/SECURITY.md
- `Token Encryption at Rest Specification` --semantically_similar_to--> `AES-GCM Token Encryption`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/SECURITY.md
- `MVP Explicit Non-Goals` --conceptually_related_to--> `Official OAuth Only Rule`  [INFERRED]
  docs/MVP_SCOPE.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Meta OAuth Subsystem** — docs_architecture_meta_oauth_flow, docs_api_connect, docs_api_callback, docs_security_oauth_state, docs_database_instagram_token_model [INFERRED 0.85]
- **Multi-Account Ownership Isolation** — claude_multi_account_isolation, docs_security_ownership_authorization, docs_database_ownership_isolation, docs_ai_rules_preserve_architecture [INFERRED 0.95]
- **MVP Relational Schema** — docs_database_user_model, docs_database_instagram_account_model, docs_database_instagram_token_model, docs_database_instagram_media_model, docs_database_instagram_insight_model [EXTRACTED 1.00]
- **Instagram Account Data API** — docs_api_accounts, docs_api_account_detail, docs_api_account_media, docs_api_account_insights, docs_api_disconnect_account [EXTRACTED 1.00]

## Communities (17 total, 4 thin omitted)

### Community 0 - "Security & Implementation Rules"
Cohesion: 0.11
Nodes (20): Normalized API Error Shape, Claude Code Layer Rules, CLAUDE.md Guidance, Mock Instagram Mode, Multi-Account Isolation Enforcement, Token Encryption at Rest Specification, AI Implementation Rules, No Scope Creep Constraint (+12 more)

### Community 1 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 2 - "Dev Dependencies & Tooling"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "Package Manifest & Scripts"
Cohesion: 0.16
Nodes (13): ignoreScripts, name, packageManager, private, scripts, build, dev, lint (+5 more)

### Community 4 - "Instagram REST API Routes"
Cohesion: 0.40
Nodes (10): GET /api/instagram/accounts/:id, GET /api/instagram/accounts/:id/insights, GET /api/instagram/accounts/:id/media, GET /api/instagram/accounts, GET /api/instagram/callback, GET /api/instagram/connect, API Contract Document, DELETE /api/instagram/accounts/:id (+2 more)

### Community 5 - "TypeScript Path & Build Inclusions"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 6 - "Static Brand Assets & Icons"
Cohesion: 0.32
Nodes (8): Next.js, public/, file.svg, globe.svg, next.svg, vercel.svg, window.svg, Vercel

### Community 7 - "Application Architecture & Layers"
Cohesion: 0.43
Nodes (7): Instagram Service Layer API, Database-Backed MVP Caching, Database Layer, Architecture Specification, Security Layer, Application Services Layer, UI Layer

### Community 8 - "Runtime Dependencies"
Cohesion: 0.29
Nodes (7): next, dependencies, next, react, react-dom, react, react-dom

### Community 9 - "Prisma Relational Database Models"
Cohesion: 0.60
Nodes (6): Database Design Document, InstagramAccount Model, InstagramInsight Model, InstagramMedia Model, InstagramToken Model, User Model

### Community 10 - "Product Requirements & Scope"
Cohesion: 0.33
Nodes (6): MVP Scope Document, MVP Must-Have Features, MVP Should-Have Features, Product Requirements Document, PRD Functional Requirements, PRD Non-Functional Requirements

### Community 11 - "Root Layout & Font Setup"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **54 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `eslintConfig`, `nextConfig` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 67 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies & Tooling` to `Package Manifest & Scripts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Config` to `TypeScript Path & Build Inclusions`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Security & Implementation Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.11052631578947368 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._