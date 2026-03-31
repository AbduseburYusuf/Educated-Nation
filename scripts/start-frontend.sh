#!/bin/bash
set -e

cd /home/sabri54/Desktop/Nation/frontend
echo "Frontend running on http://localhost:5173"
npm install
exec npm run dev -- --host 0.0.0.0 --port 5173
