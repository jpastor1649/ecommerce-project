[33mcommit ec08ba9dc8c093fd22b815548e948890aa1a988c[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfrontend[m[33m, [m[1;31morigin/feature/auth-security-and-domain-layer[m[33m, [m[1;32mfeature/auth-security-and-domain-layer[m[33m)[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 22 13:08:15 2026 -0500

    feat: refactor src files, black, and pylint applied

[33mcommit 5a7169976d6b07ff7d2d0108257d5c6a8d3eeffe[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 22 13:01:01 2026 -0500

    feat: add domain layer with Email and Password value objects
    
    - Email VO: Validates RFC 5322 format, normalizes to lowercase
    - Password VO: Enforces security requirements (8+ chars, uppercase, lowercase, digit, special char)
    - Both VOs are immutable and support equality comparisons
    - Password encapsulates bcrypt hashing (12 rounds)

[33mcommit f14f57a1b0ab95ad367f07cfff2b496b62a427e6[m[33m ([m[1;31morigin/develop[m[33m, [m[1;32mdevelop[m[33m)[m
Merge: 84ba9ae d1d937d
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Wed Mar 18 18:02:48 2026 -0500

    Merge pull request #10 from jpastor1649/refactor/improve-auth-endpoints-and-docs
    
    Refactor authentication and configuration, update documentation

[33mcommit 84ba9ae731f312a72eda08b2287d2649d1d6808b[m
Merge: 2a100b4 500fe74
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Wed Mar 18 18:02:36 2026 -0500

    Merge pull request #9 from jpastor1649/feat/products-catalog
    
    feat: products catalog endpoints with category filter

[33mcommit d1d937d234db1456cd20ecb85cc252e50c5c2242[m[33m ([m[1;31morigin/refactor/improve-auth-endpoints-and-docs[m[33m, [m[1;32mrefactor/improve-auth-endpoints-and-docs[m[33m)[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 17:50:04 2026 -0500

    fix: pylint warnings in auth.py and auth_service.py
    
    - Added 'from exc' to HTTPException raise for proper exception chaining (W0707)
    - Removed duplicate imports in auth_service.py (W0404)
    - Fixed import order: stdlib before third-party (C0411)

[33mcommit d8b5eb098e4fd6cd6e866d5005872d10daee9a68[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Wed Mar 18 17:36:42 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 5efae5a50455b70da5c86a3a6feb987e554a49a5[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Wed Mar 18 17:34:09 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 3c6644f6e54e741f1a4396695b9ba576960fe6aa[m
Merge: 9efb1c7 2a100b4
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Wed Mar 18 17:33:38 2026 -0500

    Merge branch 'develop' into refactor/improve-auth-endpoints-and-docs

[33mcommit 500fe7431498b0f0d3fdf5cd273d08d34339fd82[m[33m ([m[1;31morigin/feat/products-catalog[m[33m)[m
Author: saospinav <saospinav@unal.edu.co>
Date:   Wed Mar 18 14:45:09 2026 -0500

    feat: add products catalog endpoints with category filter

[33mcommit 9efb1c77cd17ebc33e6fdd194249d2d4db721769[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 13:58:24 2026 -0500

    docs(readme): agregar guía instalación, Git Flow y CI/CD

[33mcommit 43ae75c50c5ff0fcce54fd9235b755147e3ec02a[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 13:58:15 2026 -0500

    refactor(config): hacer redis_url requerido

[33mcommit b360765ae6030a98fe149d5470cc9b26c5f57021[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 13:58:06 2026 -0500

    refactor(auth): agregar response_model, status_code y type hints

[33mcommit 0d056a43ecce72c72a551e9098c45d8eb30192b5[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 13:57:58 2026 -0500

    refactor(schemas): migrar Config class a model_config (Pydantic v2)

[33mcommit 45de0504db45238cadc9470dc10b80465f737c6f[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Wed Mar 18 13:57:48 2026 -0500

    fix(auth): reemplazar datetime.utcnow() por datetime.now(timezone.utc)

[33mcommit 2a100b45e0cee03c323ddc30dca3a6aa3d25348d[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Tue Mar 17 21:48:33 2026 -0500

    feat: refactore main, product, auth, auth_service

[33mcommit 3f19bd5a68b86f78e88dc686559acf751f18c421[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Tue Mar 17 21:42:01 2026 -0500

    feat(auth): implement register & login with JWT + bcrypt
    
    - POST /auth/register: create user with hashed password
    - POST /auth/login: validate credentials and return JWT token
    - Lifespan: auto-create database tables on startup
    - Docker Compose: full stack with PostgreSQL + Redis
    - Error handling: 409 duplicate email, 401 invalid credentials
    - Docstrings: professional English format (Args/Returns/Raises)

[33mcommit cafbd56023f8a8640690cd3b96de26d0c4e03584[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Tue Mar 17 19:06:48 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 4ec6af2ed9754213c35cb930979e52a11a85f844[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Tue Mar 17 19:06:24 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit add713cd90666c84725e5c288c1639b19a6dd708[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Tue Mar 17 19:06:03 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit cb4ba8c85f74bbb9d8768bd977e6f0a5fb399402[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Tue Mar 17 19:05:52 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 2376371ff70ca68a32a39a2d271e3a402a8629fb[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 22:08:17 2026 -0500

    feat:refactored product.py to pass lint tests

[33mcommit 20f0358cd48d18e70b4e82e5b6ed5c526f8ef061[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 22:06:37 2026 -0500

    feat:refactored product.py to pass lint tests

[33mcommit 34bef55e86bd6b7b0fd2cf04461ca5814133f30f[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 21:56:25 2026 -0500

    feat: README.md updated for deploying

[33mcommit 2f289ae3e5fbd5ffc2e0c4ac3c31c0bb632873a5[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 21:53:56 2026 -0500

    feat: added docker files, now is able to run using docker compose

[33mcommit 0590460bc5bbf97909f1b374ce2b98e816bb8909[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 21:19:56 2026 -0500

    feat: refactor product.py

[33mcommit 2c74311190530c4ca2a389202bcc409545432b93[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 21:15:31 2026 -0500

    feat: refactor project structure and update import paths for consistency

[33mcommit cf25917276fc4f297830b433e093e690a824de63[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 20:57:27 2026 -0500

    feat(auth): add register and login endpoints with JWT

[33mcommit 89c36eb586f21cd03f4ba59f2bcb24c3fbf7507e[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 20:25:49 2026 -0500

    feat(core): setup FastAPI app with settings, database and base models

[33mcommit 1bc1eca315438c75189cd13271a3dfef2c8e8e67[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 19:49:22 2026 -0500

    chore: setup backend structure:

[33mcommit bd78e169a862bdf0935a8a040e392e3b9e03c4c6[m[33m ([m[1;32mmain[m[33m)[m
Merge: de52693 4950fc6
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Mon Mar 16 19:14:58 2026 -0500

    Merge pull request #5 from jpastor1649/develop
    
    Enhance documentation and remove obsolete files

[33mcommit 4950fc683270e5eab2b808f9e13dcb3a8ef7de64[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 19:10:17 2026 -0500

    new diagramas bd

[33mcommit 735c8b674a0fcbf028a2994547db736cf1b2b97a[m
Merge: dedba9d 1bc5a83
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:54:26 2026 -0500

    Merge branch 'develop' of https://github.com/jpastor1649/ecommerce-project into develop

[33mcommit dedba9dd5244e794084481c11c9a9e79309b8952[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:54:22 2026 -0500

    chore: update README to remove obsolete CI pipeline references and enhance clarity

[33mcommit 1bc5a83ae7f0731734ef7a3df9a11d875911cc52[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Mon Mar 16 18:51:36 2026 -0500

    Update software architecture affiliation in README

[33mcommit 2189945bc676f37eb2e514d522cd59fe2d673013[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:49:30 2026 -0500

    feat: add comprehensive README with project overview, features, and setup instructions

[33mcommit 5b5918fe1496fe7f3b69452b09dfbddd7c87c6b9[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:48:12 2026 -0500

    chore: remove obsolete GitHub documentation and workflow files

[33mcommit f5f092f9dc1bb8a837a7158ce4179587c6b481a9[m
Merge: 4002723 1638863
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:46:10 2026 -0500

    Merge branch 'develop' of https://github.com/jpastor1649/ecommerce-project into develop

[33mcommit 4002723c2cdda77c4549e9f4d480525da84581fb[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:46:02 2026 -0500

    feat: add initial documentation and architecture files

[33mcommit de52693c01fb2e8c844f36ac3791f682bccdee94[m
Merge: c174611 1638863
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Mon Mar 16 18:43:03 2026 -0500

    Merge pull request #4 from jpastor1649/develop
    
    Enhance CI/CD workflows, project structure, and documentation

[33mcommit 1638863ece5e4420d266c99be9c7abe2ac329377[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Mon Mar 16 18:41:56 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit c6696391810d294bbee071b5e24fc0cf136e2766[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Mon Mar 16 18:41:41 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 8560fdb0b77d1bb8d12f5da7ed0b1cd9b21d9410[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:40:54 2026 -0500

    updated entrega1

[33mcommit d7272774564c273ecbf3b9ef66281d891e920e65[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:35:54 2026 -0500

    new diagram C&C view

[33mcommit 0ce7643546260d74f46049006fa4bb59a7fa562e[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:27:11 2026 -0500

    docs: include architecture diagramas exported

[33mcommit 5f09112b6b193ea38acf0a687032918042a626dd[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 18:23:10 2026 -0500

    new diagrams

[33mcommit c29e6c49a520346e113dbe4dca73da03119156b2[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Mon Mar 16 17:57:27 2026 -0500

    new docs

[33mcommit c324297091f81b562920614e851a17b1cc5d226e[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 22:14:17 2026 -0500

    "alo"

[33mcommit e30a70b0c1eccc8b56d6d887bfa62c43ab704d62[m
Merge: 0604a9b b9f2817
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:57:04 2026 -0500

    chore: merge remote changes and update CI/CD config

[33mcommit b9f2817d0a32c2fe43b0076ad6d3a28e5541f7fd[m
Merge: d26943b cc1ccb0
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:54:10 2026 -0500

    Merge pull request #3 from jpastor1649/copilot/sub-pr-2
    
    [WIP] [WIP] Address feedback on CI/CD workflows and project structure updates

[33mcommit cc1ccb09d521ea62adc0be4b1037672c0c4f9dac[m
Author: copilot-swe-agent[bot] <198982749+Copilot@users.noreply.github.com>
Date:   Mon Mar 16 02:53:46 2026 +0000

    docs: replace Ruff references with Black/Pylint in architecture and requirements docs
    
    Co-authored-by: jpastor1649 <129129208+jpastor1649@users.noreply.github.com>

[33mcommit 1d603a59ee5608be619e222f2145fce8e8d16028[m
Author: copilot-swe-agent[bot] <198982749+Copilot@users.noreply.github.com>
Date:   Mon Mar 16 02:52:15 2026 +0000

    Initial plan

[33mcommit 0604a9bc127cab9b699340f6fd9d9b91ee2d6c33[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:51:21 2026 -0500

    xd

[33mcommit d26943bcdfd637d3efe2012b54a8b02064922868[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:47:59 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 3c0a22e0034dd922706aa9e4f85046dc093fcca0[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:47:46 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 1694bc73f43cf91db252d2c25eb8e19a2c073aac[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:47:32 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 9ad57568cf718062582b4959957cac0a3763babe[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:47:16 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 3b8e9369a30a920e68dfb5bd735596271028a49d[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:46:57 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 4854e78237edbdb2e60e280b04e47bde2c8a5159[m
Author: jpastor <129129208+jpastor1649@users.noreply.github.com>
Date:   Sun Mar 15 21:46:48 2026 -0500

    Potential fix for pull request finding
    
    Co-authored-by: Copilot Autofix powered by AI <175728472+Copilot@users.noreply.github.com>

[33mcommit 3392e9b971203042556be7ca31fd7b54bda4e4a0[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:39:27 2026 -0500

    chore: updated worflows for linting and formatting

[33mcommit 6223bf0ce98d5a65e4d04627f85965c3e4191c55[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:28:35 2026 -0500

    chore: setup CI/CD workflows, project structure and docs
    
    - Add lint.yml, test.yml, docker.yml GitHub Actions workflows
    - Add backend/pyproject.toml with dependencies and ruff/pytest config
    - Add backend/tests placeholder for CI
    - Add docs: requirements, architecture, er-diagram, project-structure
    - Update .gitignore with Node.js, env files and OS entries
    - Add .github/agents: discovery, skills, ecommerce-mentor

[33mcommit 855ef7c3c47aa7bf759ef1a19bf16a2b9ef62dde[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:18:35 2026 -0500

    new README.md

[33mcommit 36b43a3ad66f5113dc080da777e0fd47029eeefd[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:18:05 2026 -0500

    chore: remove .vscode from tracking

[33mcommit 08de0bfcb32189243d0383f82aee9b27ce104ab4[m
Author: jpastor1649 <jpastor@unal.edu.co>
Date:   Sun Mar 15 21:16:20 2026 -0500

    updated .gitignore
