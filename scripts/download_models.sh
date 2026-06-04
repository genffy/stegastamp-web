#!/usr/bin/env sh
set -eu

TAG="models-v1"
ARCHIVE_NAME="stegastamp-models-v1.tar.gz"
EXPECTED_SHA256="601a36522e5545da21d9a1c364c7da9c4e97d8acd6a7cbd532b2d6a143059b08"
DEFAULT_URL="https://github.com/genffy/stegastamp-web/releases/download/${TAG}/${ARCHIVE_NAME}"
DOWNLOAD_URL="${MODEL_ARCHIVE_URL:-$DEFAULT_URL}"
TMP_DIR="${TMPDIR:-/tmp}/stegastamp-web-models"
ARCHIVE_PATH="${TMP_DIR}/${ARCHIVE_NAME}"

force=0
if [ "${1:-}" = "--force" ]; then
  force=1
fi

if [ "$force" -eq 0 ] && \
  [ -d "saved_models/stegastamp_pretrained" ] && \
  [ -d "detector_models/stegastamp_detector" ]; then
  echo "Model directories already exist. Use --force to download again."
  exit 0
fi

mkdir -p "$TMP_DIR"

if [ ! -f "$ARCHIVE_PATH" ] || [ "$force" -eq 1 ]; then
  echo "Downloading ${ARCHIVE_NAME}..."
  curl --fail --location --show-error --output "$ARCHIVE_PATH" "$DOWNLOAD_URL"
fi

if command -v shasum >/dev/null 2>&1; then
  actual_sha256="$(shasum -a 256 "$ARCHIVE_PATH" | awk '{print $1}')"
elif command -v sha256sum >/dev/null 2>&1; then
  actual_sha256="$(sha256sum "$ARCHIVE_PATH" | awk '{print $1}')"
else
  echo "Cannot verify checksum: install shasum or sha256sum." >&2
  exit 1
fi

if [ "$actual_sha256" != "$EXPECTED_SHA256" ]; then
  echo "Checksum mismatch for ${ARCHIVE_NAME}." >&2
  echo "Expected: $EXPECTED_SHA256" >&2
  echo "Actual:   $actual_sha256" >&2
  exit 1
fi

tar -xzf "$ARCHIVE_PATH" -C .
echo "Models are ready."
