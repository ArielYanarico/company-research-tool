# Company Research Tool
pplication that researches companies.

## Architecture

This project is organized as a monorepo containing:

- **Backend** (`apps/backend`): NestJS API server
- **Frontend** (`apps/frontend`): Reactjs web application with Tailwind CSS

## Prerequisites

- Node.js 24.x or higher
- pnpm 11.x or higher

## Problem statement 

* The goal is getting info of any company entered so:
  * How can I get its data from internet?
    * Using Search engines has limitations in free tier usage
    * **I can use some providers like wikipedia and clearbit in order to get companies URL only**
  * How can I get the desired information from gotten company Urls?
    * I can go manually go into web pages and fill a DB with data and offer only companies from my DB but it is lots of manually work for a little DB.
    * I can automate this process, but it still is a lots of work for few results.
    * I can automate a scrapping tool for getting this info directly from its HTML page information, but we have limitation of the HTML format and getting data (This is a partial solution)
    * I can scrap HTML pages with help from a AI agent, it could finid the desired information from HTML without depending on the page format (by default I am going to use a local free model)




## Todos

- [ ] Backend: Move errors from services to a common error handler middleware
- [ ] Backend: Move provider URLs to a constant file or env file
- [ ] DevOps: Add docker configuration for having a llama instance to scrap pages