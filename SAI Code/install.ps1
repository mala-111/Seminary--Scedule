# SAI Code — one-click installer.
# Run from the extracted SAI Code folder. No admin required.
#
# What it does:
#   1. Detects/installs Node.js (prerequisite) — Claude Code is a Node app.
#   2. Installs Claude Code globally              — `npm i -g @anthropic-ai/claude-code`.
#   3. Opens the SAI Code GUI                     — the user clicks "connect".
#
# -NoLaunch skips step 3 (used by the installer's post-install bootstrap, which
# launches the GUI itself via the "run now" checkbox).
param([switch]$Quiet, [switch]$NoLaunch)

$ErrorActionPreference = 'Stop'
$Host.UI.RawUI.WindowTitle = 'SAI Code Setup'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe = Join-Path $scriptDir 'sai-code.exe'
$gui = Join-Path $scriptDir 'sai-code-gui.ps1'

$CR = [System.Environment]::NewLine

# ---- helpers ----
function Write-Step($msg) {
    if (-not $Quiet) {
        Write-Host "===" -ForegroundColor Cyan -NoNewline
        Write-Host " $msg" -ForegroundColor White
    }
}
function Write-OK($msg)   {
    if (-not $Quiet) { Write-Host "  ✓ $msg" -ForegroundColor Green }
}
function Write-Warn($msg) {
    if (-not $Quiet) { Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
}
function Write-Err($msg)  {
    Write-Host "  ✗ $msg" -ForegroundColor Red
}

# ---- install prerequisites (Node.js + Claude Code) ----
# Delegate to the Go tool's `install` (single source of truth): it pulls Node.js
# from an MSI on our whitelisted domain (no winget — absent in Sandbox / managed
# machines) and Claude Code through our npm proxy. The tool self-elevates ONLY the
# Node MSI (a UAC prompt may appear); npm + the CA export run as the signed-in
# user so a content-filter's per-user root CA is trusted (Setup runs un-elevated).
Write-Step 'Installing prerequisites (Node.js + Claude Code) via SAI…'
& $exe install
if ($LASTEXITCODE -ne 0) {
    Write-Err 'התקנת הרכיבים לא הושלמה — ניתן לפתוח את SAI Code וללחוץ "התקן את הרכיבים".'
} else {
    Write-OK 'Prerequisites ready.'
}

# ---- launch the SAI Code GUI ----
if ($NoLaunch) {
    Write-OK 'Prerequisites ready. SAI Code will open from the installer.'
    exit 0
}
Write-Step 'Launching SAI Code GUI…'
Write-Host ''
Write-Host '  ┌────────────────────────────────────────────────────────┐'
Write-Host '  │  SAI Code is ready.                                   │'
Write-Host '  │                                                       │'
Write-Host '  │  Click "התחבר עם חשבון SAI" to connect with your SAI  │'
Write-Host '  │  account. A browser will open — sign in, then close    │'
Write-Host '  │  the browser and start coding.                         │'
Write-Host '  │                                                       │'
Write-Host '  │  After setup, launch Claude Code from any terminal:   │'
Write-Host '  │    claude                                              │'
Write-Host '  └────────────────────────────────────────────────────────┘'
Write-Host ''

# Verify the GUI files exist
if (-not (Test-Path $gui)) {
    Write-Err "Missing $gui — please run from the extracted SAI Code folder."
    exit 1
}
if (-not (Test-Path $exe)) {
    Write-Err "Missing $exe — please run from the extracted SAI Code folder."
    exit 1
}

# Launch the GUI (the double-click path). The GUI's connect button calls
# `sai-code activate <env>` which opens the browser for account login.
& $gui
