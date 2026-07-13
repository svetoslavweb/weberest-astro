#!/bin/bash
# One-time setup on SuperHosting cPanel terminal.
# Usage: bash hosting-setup.sh
#
# Before running:
# 1. Add server SSH public key to GitHub → repo → Settings → Deploy keys (read-only)
# 2. Push main branch so GitHub Actions creates the "hosting" branch

set -euo pipefail

REPO="git@github.com:svetoslavweb/weberest-astro.git"
TARGET="${HOME}/public_html/bg"

echo "→ Target: ${TARGET}"

if [ -d "${TARGET}" ] && [ "$(ls -A "${TARGET}" 2>/dev/null)" ]; then
  BACKUP="${HOME}/public_html/bg.backup.$(date +%Y%m%d-%H%M%S)"
  echo "→ Backing up existing files to ${BACKUP}"
  mv "${TARGET}" "${BACKUP}"
fi

mkdir -p "$(dirname "${TARGET}")"
git clone -b hosting --single-branch "${REPO}" "${TARGET}"
git -C "${TARGET}" config pull.ff only

echo ""
echo "Done. To deploy updates after git push:"
echo "  cd ${TARGET} && git pull"
