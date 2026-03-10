# Local n8n + Directus + PostgreSQL + Dockerized Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fully local Docker-based stack that runs this Next.js app alongside n8n, Directus, and PostgreSQL, with secure local defaults and deployment-ready containerization.

**Architecture:** Create a single `docker-compose.yml` stack with four app services (`web`, `n8n`, `directus`, `postgres`) and named volumes for persistence. Keep the Next.js app connected to existing Supabase env vars unless explicitly overridden, while n8n and Directus use the shared local Postgres instance (separate DBs). Add repeatable smoke checks and clear env contracts so the same stack can be used for local development and server deployment preparation.

**Tech Stack:** Docker, Docker Compose, Next.js 15, Node 20, PostgreSQL 16, n8n, Directus, shell smoke checks, existing npm scripts.
