# AGENTS.md

Tento subor je kanonicky kontext pre AI asistenta pracujuceho na repo `cv-web`.
Ak je nieco v konflikte medzi tymto suborom a starsim obsahom inde v projekte, preferuj tento subor.

## Projekt

- Nazov: `filip-cv`
- Typ: osobny CV/portfolio web pre Filipa Csupku
- Stack: Next.js, React, TypeScript, staticky export
- Jazyk dokumentacie: anglictina

## Ciel repozitara

- Prezentovat CV/portfolio site cistym a premium dojmom.
- Zachovat existujuci vizualny smer, typografiu a deploy flow.
- Minimalizovat riziko rozbitia statickeho exportu alebo nginx servingu.

## Aktualny stav kodu

- Frontend je v `src/`.
- Build a deploy su postavene na Next.js static export a Docker.
- Servovanie prebieha cez `nginx/` konfiguraciu v kontejnery.
- Produkcia je viazana na `../infra` GitOps repo a K8s manifesty.

## Ako repo lokalne pouzivat

- Dev server: `npm install && npm run dev`
- Build: `npm run build`
- Docker test: `docker compose up`

Ak sa meni UI, drz existujuci layout a neprepisuj ho zbytocne od nuly.

## Pravidla pre AI

- Pred upravami si precitaj `README.md` a potom relevantne subory v `src/` alebo `nginx/`.
- Necommittuj secrets, `.env` subory ani generovane artefakty ako `out/`.
- Pri zmene build alebo deploy casti skontroluj dopad na Dockerfile a workflowy.
- Preferuj iterativne a male zmeny pred rozsiahlym refaktorom.

## Poznamka

Toto nie je trvala pamat mimo repozitara. Funguje to tak, ze pri dalsej praci bude tento subor lokalny smerodajny zdroj kontextu pre projekt.
