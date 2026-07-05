# sai-code-gui.ps1 — ממשק SAI Code: אבחון, התקנה, התחברות והפעלה/כיבוי של הסינון ל-Claude Code.
# מיתוג רשמי: מגן SAI (slate) על רקע בהיר, הדגשת teal.
# מכונת-מצבים מונעת `sai-code doctor`: בדיקה → התקנת דרישות / חסום בסינון / מוכן / מחובר.
# Easter egg: 7 קליקים על הלוגו → קוד גישה → בחירת סביבת פיתוח.
#
# הרצה:  powershell -ExecutionPolicy Bypass -File sai-code-gui.ps1  (או דאבל-קליק על "SAI Code.vbs")

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

# The sai-code binary emits UTF-8 (e.g. Hebrew gateway/diagnostic text). Decode
# native-command output as UTF-8 so `& $exe` / ConvertFrom-Json don't mojibake it.
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

try {
    Add-Type -Namespace Win32 -Name Shell -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("shell32.dll", PreserveSig=false)]
public static extern void SetCurrentProcessExplicitAppUserModelID([System.Runtime.InteropServices.MarshalAs(System.Runtime.InteropServices.UnmanagedType.LPWStr)] string AppID);
'@ -ErrorAction Stop
    [Win32.Shell]::SetCurrentProcessExplicitAppUserModelID('SAI.Code')
} catch {}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe = Join-Path $scriptDir 'sai-code.exe'
if (-not (Test-Path $exe)) {
    [System.Windows.Forms.MessageBox]::Show("לא נמצא sai-code.exe לצד הסקריפט:`n$exe", "SAI Code", 'OK', 'Error') | Out-Null
    return
}

# ---- state ----
$script:env        = 'prod'
$script:devUnlocked = $false
$script:logoClicks = 0
$script:doctor     = $null
$script:mode       = ''      # '', 'connect', 'install'
$script:connected  = $false  # true while in the connected state (drives the account-panel refresh timer)
$script:ticks      = 0
$script:primary    = ''      # which action the primary button performs
$script:uiReady    = $false  # true after first render — guards early radio events
$script:version    = ''      # tool version (shown in footer)
$script:installOut = ''      # temp file: live install stdout (tailed into progress box)
$script:installProc = $null  # the running `sai-code install` process

# ---- palette (official SAI brand) ----
$cBg     = [System.Drawing.Color]::FromArgb(255, 255, 255)
$cCard   = [System.Drawing.Color]::FromArgb(243, 244, 246)
$cInk    = [System.Drawing.Color]::FromArgb(30, 41, 59)
$cText   = [System.Drawing.Color]::FromArgb(47, 49, 55)
$cMuted  = [System.Drawing.Color]::FromArgb(107, 114, 128)
$cTeal   = [System.Drawing.Color]::FromArgb(16, 163, 127)
$cTealDk = [System.Drawing.Color]::FromArgb(13, 138, 108)
$cBorder = [System.Drawing.Color]::FromArgb(226, 232, 240)
$cRed    = [System.Drawing.Color]::FromArgb(192, 57, 43)
$cAmber  = [System.Drawing.Color]::FromArgb(180, 120, 10)
$cAmberBg = [System.Drawing.Color]::FromArgb(254, 243, 199)

function Get-Urls {
    # Link to real PORTAL pages (/my…), not the bare domain root — the root has
    # no website homepage and renders blank. /my is the Odoo portal (login then
    # account); /my/payg/settings is the pay-per-use + payment-method page.
    # /my/subscriptions is a GET page that shows the subscription, the payment
    # method, and the pay-per-use settings form. (/my/payg/settings is POST-only.)
    if ($script:env -eq 'dev') {
        $b = 'https://account-dev.sai-app.com'
        return @{ account="$b/my"; payg="$b/my/subscriptions"; chat='https://chat-dev.sai-app.com' }
    }
    $b = 'https://account.sai-app.com'
    return @{ account="$b/my"; payg="$b/my/subscriptions"; chat='https://sai-app.com' }
}
function Open-Url { param([string]$u) Start-Process $u | Out-Null }
function Invoke-Sai { param([string[]]$SaiArgs) return (& $exe @SaiArgs 2>&1 | Out-String) }
function Get-Doctor { try { return (Invoke-Sai @('doctor', '--json') | ConvertFrom-Json) } catch { return $null } }

function Show-PasswordPopup {
    $dlg = New-Object System.Windows.Forms.Form
    $dlg.Text = 'גישת פיתוח'; $dlg.Size = New-Object System.Drawing.Size(320, 160)
    $dlg.StartPosition = 'CenterScreen'; $dlg.FormBorderStyle = 'FixedDialog'
    $dlg.MaximizeBox = $false; $dlg.MinimizeBox = $false; $dlg.BackColor = $cBg; $dlg.RightToLeft = 'Yes'
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = 'הזן קוד גישה:'; $lbl.Location = New-Object System.Drawing.Point(20, 20)
    $lbl.Size = New-Object System.Drawing.Size(260, 20); $lbl.ForeColor = $cText
    $lbl.Font = New-Object System.Drawing.Font('Segoe UI', 9); $dlg.Controls.Add($lbl)
    $txt = New-Object System.Windows.Forms.TextBox
    $txt.Location = New-Object System.Drawing.Point(20, 48); $txt.Size = New-Object System.Drawing.Size(260, 24)
    $txt.PasswordChar = '*'; $txt.Font = New-Object System.Drawing.Font('Segoe UI', 11); $dlg.Controls.Add($txt)
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = 'אישור'; $btn.Location = New-Object System.Drawing.Point(100, 84)
    $btn.Size = New-Object System.Drawing.Size(100, 30); $btn.FlatStyle = 'Flat'
    $btn.FlatAppearance.BorderSize = 0; $btn.BackColor = $cTeal; $btn.ForeColor = [System.Drawing.Color]::White
    $btn.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
    $btn.Add_Click({ $dlg.DialogResult = 'OK'; $dlg.Close() }); $dlg.Controls.Add($btn)
    $dlg.AcceptButton = $btn
    if ($dlg.ShowDialog() -eq 'OK') { return $txt.Text }
    return $null
}

# ---- form (two modes: compact 440×560, expanded 750×560 with side dashboard) ----
$form = New-Object System.Windows.Forms.Form
$form.Text = 'SAI Code'; $form.Size = New-Object System.Drawing.Size(440, 560)
$form.StartPosition = 'CenterScreen'; $form.FormBorderStyle = 'FixedSingle'
$form.MaximizeBox = $false; $form.RightToLeft = 'Yes'; $form.BackColor = $cBg
$form.Font = New-Object System.Drawing.Font('Segoe UI', 10)
$icoPath = Join-Path $scriptDir 'sai-code.ico'
if (Test-Path $icoPath) { try { $form.Icon = New-Object System.Drawing.Icon($icoPath) } catch {} }

# tray notification icon — used for usage-quota toast alerts
$notify = New-Object System.Windows.Forms.NotifyIcon
try { if (Test-Path $icoPath) { $notify.Icon = New-Object System.Drawing.Icon($icoPath) } } catch {}
if (-not $notify.Icon) { $notify.Icon = [System.Drawing.SystemIcons]::Information }
$notify.Text = 'SAI Code'; $notify.Visible = $true
$form.Add_FormClosed({ try { $notify.Visible = $false; $notify.Dispose() } catch {} })
$script:lastQuotaAlert = 0   # highest daily-usage % already alerted (re-armed on daily reset)
$script:prevDailyUsed = -1

# update banner (top, hidden unless an update is available)
$updateBar = New-Object System.Windows.Forms.Panel
$updateBar.Size = New-Object System.Drawing.Size(424, 30); $updateBar.Location = New-Object System.Drawing.Point(0, 0)
$updateBar.BackColor = $cAmberBg; $updateBar.Visible = $false; $updateBar.Cursor = 'Hand'
$form.Controls.Add($updateBar)
$lblUpdate = New-Object System.Windows.Forms.Label
$lblUpdate.Dock = 'Fill'; $lblUpdate.TextAlign = 'MiddleCenter'; $lblUpdate.ForeColor = $cAmber
$lblUpdate.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$lblUpdate.Cursor = 'Hand'; $updateBar.Controls.Add($lblUpdate)

# logo (clickable — dev easter egg)
$logo = New-Object System.Windows.Forms.PictureBox
$logo.Size = New-Object System.Drawing.Size(76, 84); $logo.Location = New-Object System.Drawing.Point(182, 40)
$logo.BackColor = $cBg; $logo.SizeMode = 'Zoom'; $logo.Cursor = 'Hand'
$logoFile = Join-Path $scriptDir 'sai-logo.png'
if (Test-Path $logoFile) { try { $logo.Image = [System.Drawing.Image]::FromFile($logoFile) } catch {} }
$logo.Add_Click({
    $script:logoClicks++
    if ($script:logoClicks -ge 7 -and -not $script:devUnlocked) {
        $script:logoClicks = 0
        $pw = Show-PasswordPopup
        if ($pw -ne $null) {
            $hash = (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes('sai-d3v-g8!' + $pw))) -Algorithm SHA256).Hash.ToLower()
            if ($hash -eq '8af0f9ca4a28b2f444ec4d5138bd06077f8cea4eb647d8905ce0c25fe55deaa0') {
                $script:devUnlocked = $true; $envPanel.Visible = $true; $lblLog.Text = 'מצב פיתוח נפתח.'
            } else { $lblLog.Text = 'קוד שגוי.' }
        }
    }
})
$form.Controls.Add($logo)

$lblBrand = New-Object System.Windows.Forms.Label
$lblBrand.Text = 'SAI Code'; $lblBrand.Font = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold)
$lblBrand.ForeColor = $cInk; $lblBrand.AutoSize = $false; $lblBrand.TextAlign = 'MiddleCenter'
$lblBrand.Size = New-Object System.Drawing.Size(400, 30); $lblBrand.Location = New-Object System.Drawing.Point(20, 128)
$form.Controls.Add($lblBrand)

$lblTag = New-Object System.Windows.Forms.Label
$lblTag.Text = 'תכנות AI מסונן'; $lblTag.ForeColor = $cMuted; $lblTag.AutoSize = $false
$lblTag.TextAlign = 'MiddleCenter'; $lblTag.Size = New-Object System.Drawing.Size(400, 20)
$lblTag.Location = New-Object System.Drawing.Point(20, 158); $form.Controls.Add($lblTag)

# status card
$card = New-Object System.Windows.Forms.Panel
$card.Size = New-Object System.Drawing.Size(380, 54); $card.Location = New-Object System.Drawing.Point(30, 192)
$card.BackColor = $cCard; $form.Controls.Add($card)
$lblStatus = New-Object System.Windows.Forms.Label
$lblStatus.Dock = 'Fill'; $lblStatus.TextAlign = 'MiddleCenter'
$lblStatus.Font = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
$card.Controls.Add($lblStatus)

# detail / error line (per state)
$lblDetail = New-Object System.Windows.Forms.Label
$lblDetail.Size = New-Object System.Drawing.Size(380, 44); $lblDetail.Location = New-Object System.Drawing.Point(30, 250)
$lblDetail.ForeColor = $cMuted; $lblDetail.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$lblDetail.TextAlign = 'MiddleCenter'; $form.Controls.Add($lblDetail)

# primary button (context-sensitive: connect / install / retry)
$btnPrimary = New-Object System.Windows.Forms.Button
$btnPrimary.Size = New-Object System.Drawing.Size(380, 46); $btnPrimary.Location = New-Object System.Drawing.Point(30, 298)
$btnPrimary.FlatStyle = 'Flat'; $btnPrimary.FlatAppearance.BorderSize = 0
$btnPrimary.BackColor = $cTeal; $btnPrimary.ForeColor = [System.Drawing.Color]::White
$btnPrimary.Font = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
$btnPrimary.Cursor = 'Hand'; $form.Controls.Add($btnPrimary)

# secondary (disconnect)
$btnDisconnect = New-Object System.Windows.Forms.Button
$btnDisconnect.Text = 'התנתק'; $btnDisconnect.Size = New-Object System.Drawing.Size(380, 34)
$btnDisconnect.Location = New-Object System.Drawing.Point(30, 350); $btnDisconnect.FlatStyle = 'Flat'
$btnDisconnect.FlatAppearance.BorderColor = $cBorder; $btnDisconnect.FlatAppearance.BorderSize = 1
$btnDisconnect.BackColor = $cBg; $btnDisconnect.ForeColor = $cRed; $btnDisconnect.Cursor = 'Hand'
$form.Controls.Add($btnDisconnect)

# live install progress (download/install of Node.js + Claude Code). Hidden
# until an install runs; overlays the detail+button area while installing.
$progressBox = New-Object System.Windows.Forms.TextBox
$progressBox.Multiline = $true; $progressBox.ReadOnly = $true; $progressBox.ScrollBars = 'Vertical'
$progressBox.Size = New-Object System.Drawing.Size(380, 150)
$progressBox.Location = New-Object System.Drawing.Point(30, 244)
$progressBox.Font = New-Object System.Drawing.Font('Consolas', 8)
$progressBox.BackColor = [System.Drawing.Color]::FromArgb(248, 249, 250)
$progressBox.ForeColor = $cText; $progressBox.BorderStyle = 'FixedSingle'
$progressBox.RightToLeft = 'No'   # npm/winget output is left-to-right
$progressBox.Visible = $false
$form.Controls.Add($progressBox)

# quick-links row
$linksPanel = New-Object System.Windows.Forms.Panel
$linksPanel.Size = New-Object System.Drawing.Size(380, 30); $linksPanel.Location = New-Object System.Drawing.Point(30, 392)
$form.Controls.Add($linksPanel)
function New-NavLink {
    param([string]$text, [int]$x, [scriptblock]$onClick)
    $ll = New-Object System.Windows.Forms.LinkLabel
    $ll.Text = $text; $ll.AutoSize = $true; $ll.Location = New-Object System.Drawing.Point($x, 6)
    $ll.LinkColor = $cTealDk; $ll.ActiveLinkColor = $cTeal; $ll.LinkBehavior = 'HoverUnderline'
    $ll.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
    $ll.Add_LinkClicked($onClick); $linksPanel.Controls.Add($ll); return $ll
}
New-NavLink 'חשבון' 330 { Open-Url (Get-Urls).account } | Out-Null
New-NavLink 'צ׳אט'   278 { Open-Url (Get-Urls).chat }    | Out-Null
New-NavLink 'בדוק עדכונים' 158 { Manual-CheckUpdate } | Out-Null
New-NavLink 'שמור לוגים' 40 { Save-Logs } | Out-Null

$sep = New-Object System.Windows.Forms.Label
$sep.Size = New-Object System.Drawing.Size(380, 1); $sep.Location = New-Object System.Drawing.Point(30, 426)
$sep.BorderStyle = 'FixedSingle'; $sep.ForeColor = $cBorder; $form.Controls.Add($sep)

# hidden env selector (7-click)
$envPanel = New-Object System.Windows.Forms.Panel
$envPanel.Size = New-Object System.Drawing.Size(380, 26); $envPanel.Location = New-Object System.Drawing.Point(30, 434)
$envPanel.Visible = $false; $form.Controls.Add($envPanel)
$rbProd = New-Object System.Windows.Forms.RadioButton
$rbProd.Text = 'ייצור'; $rbProd.ForeColor = $cMuted; $rbProd.Checked = $true; $rbProd.AutoSize = $true
$rbProd.Location = New-Object System.Drawing.Point(290, 3)
$rbProd.Add_CheckedChanged({ if ($rbProd.Checked) { $script:env = 'prod'; if ($script:uiReady) { Refresh-State } } }); $envPanel.Controls.Add($rbProd)
$rbDev = New-Object System.Windows.Forms.RadioButton
$rbDev.Text = 'פיתוח (dev)'; $rbDev.ForeColor = $cMuted; $rbDev.AutoSize = $true
$rbDev.Location = New-Object System.Drawing.Point(180, 3)
$rbDev.Add_CheckedChanged({ if ($rbDev.Checked) { $script:env = 'dev'; if ($script:uiReady) { Refresh-State } } }); $envPanel.Controls.Add($rbDev)

# log line
$lblLog = New-Object System.Windows.Forms.Label
$lblLog.Size = New-Object System.Drawing.Size(380, 34); $lblLog.Location = New-Object System.Drawing.Point(30, 464)
$lblLog.ForeColor = $cMuted; $lblLog.Font = New-Object System.Drawing.Font('Segoe UI', 8)
$lblLog.TextAlign = 'MiddleCenter'; $form.Controls.Add($lblLog)

$lblFoot = New-Object System.Windows.Forms.Label
$lblFoot.Text = 'SAI · sai-app.com'; $lblFoot.Size = New-Object System.Drawing.Size(380, 16)
$lblFoot.Location = New-Object System.Drawing.Point(30, 500); $lblFoot.ForeColor = $cBorder
$lblFoot.Font = New-Object System.Drawing.Font('Segoe UI', 7.5); $lblFoot.TextAlign = 'MiddleCenter'
$form.Controls.Add($lblFoot)

# ---- side dashboard (shown when connected + beta, right side of expanded form) ----
# When visible, the form expands to 750px wide: main panel (0..439), dashboard (440..749).
$dashboard = New-Object System.Windows.Forms.Panel
$dashboard.Size = New-Object System.Drawing.Size(310, 560); $dashboard.Location = New-Object System.Drawing.Point(440, 0)
$dashboard.BackColor = [System.Drawing.Color]::FromArgb(241, 245, 249)
$dashboard.Visible = $false; $dashboard.Padding = New-Object System.Windows.Forms.Padding(16, 16, 16, 16)
$dashboard.RightToLeft = 'Yes'
$form.Controls.Add($dashboard)

# title inside dashboard
$lblDashTitle = New-Object System.Windows.Forms.Label
$lblDashTitle.Text = 'לוח מחוונים'; $lblDashTitle.AutoSize = $false; $lblDashTitle.TextAlign = 'MiddleRight'
$lblDashTitle.ForeColor = $cInk; $lblDashTitle.Font = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
$lblDashTitle.Size = New-Object System.Drawing.Size(278, 30); $lblDashTitle.Location = New-Object System.Drawing.Point(16, 16)
$dashboard.Controls.Add($lblDashTitle)

# user email inside dashboard
$lblDashEmail = New-Object System.Windows.Forms.Label
$lblDashEmail.AutoSize = $false; $lblDashEmail.TextAlign = 'MiddleRight'; $lblDashEmail.ForeColor = $cMuted
$lblDashEmail.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$lblDashEmail.Size = New-Object System.Drawing.Size(278, 16); $lblDashEmail.Location = New-Object System.Drawing.Point(16, 46)
$dashboard.Controls.Add($lblDashEmail)

# tab control inside dashboard (usage · PAYG · BYOK)
$acctTabs = New-Object System.Windows.Forms.TabControl
$acctTabs.Size = New-Object System.Drawing.Size(278, 450)
$acctTabs.Location = New-Object System.Drawing.Point(16, 72)
$acctTabs.RightToLeft = 'Yes'; $acctTabs.RightToLeftLayout = $true
$acctTabs.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$dashboard.Controls.Add($acctTabs)

$tabUsage = New-Object System.Windows.Forms.TabPage
$tabUsage.Text = '  שימוש  '; $tabUsage.BackColor = $cCard; $tabUsage.RightToLeft = 'Yes'
$tabPayg = New-Object System.Windows.Forms.TabPage
$tabPayg.Text = '  תשלום לפי שימוש  '; $tabPayg.BackColor = $cCard; $tabPayg.RightToLeft = 'Yes'
$tabByok = New-Object System.Windows.Forms.TabPage
$tabByok.Text = '  מפתח API  '; $tabByok.BackColor = $cCard; $tabByok.RightToLeft = 'Yes'
$acctTabs.Controls.AddRange(@($tabUsage, $tabPayg, $tabByok))

# helpers: a right-aligned value line / small caption on a given tab page.
function New-AcctLine { param($parent, [int]$y)
    $l = New-Object System.Windows.Forms.Label
    $l.AutoSize = $false; $l.TextAlign = 'MiddleRight'; $l.ForeColor = $cText
    $l.Font = New-Object System.Drawing.Font('Segoe UI', 9)
    $l.Size = New-Object System.Drawing.Size(352, 20); $l.Location = New-Object System.Drawing.Point(8, $y)
    $parent.Controls.Add($l); return $l
}
# Small caption above each value, so every number says what it is (transparency).
function New-AcctCaption { param($parent, [int]$y, [string]$text)
    $l = New-Object System.Windows.Forms.Label
    $l.AutoSize = $false; $l.TextAlign = 'MiddleRight'; $l.ForeColor = $cMuted
    $l.Font = New-Object System.Drawing.Font('Segoe UI', 8)
    $l.Size = New-Object System.Drawing.Size(352, 16); $l.Location = New-Object System.Drawing.Point(8, $y)
    $l.Text = $text; $parent.Controls.Add($l); return $l
}

# ----- Tab 1: usage -----
$null       = New-AcctCaption $tabUsage 16  'שימוש יומי (קוד)'
$lblDaily   = New-AcctLine    $tabUsage 32
$null       = New-AcctCaption $tabUsage 64  'שימוש החודש'
$lblMonthly = New-AcctLine    $tabUsage 80
$null       = New-AcctCaption $tabUsage 112 'יתרת קרדיט'
$lblCredits = New-AcctLine    $tabUsage 128
$lblReserve = New-AcctLine    $tabUsage 156   # "רזרבת תשלום-לפי-שימוש" — shown only when > 0

# ----- Tab 2: pay-per-use -----
$lblPayg = New-Object System.Windows.Forms.Label
$lblPayg.AutoSize = $false; $lblPayg.TextAlign = 'MiddleRight'; $lblPayg.ForeColor = $cMuted
$lblPayg.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$lblPayg.Size = New-Object System.Drawing.Size(352, 20); $lblPayg.Location = New-Object System.Drawing.Point(8, 16)
$tabPayg.Controls.Add($lblPayg)

# Transparency line: monthly ceiling + how much was auto-charged so far.
$lblCapInfo = New-Object System.Windows.Forms.Label
$lblCapInfo.AutoSize = $false; $lblCapInfo.TextAlign = 'MiddleRight'; $lblCapInfo.ForeColor = $cText
$lblCapInfo.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$lblCapInfo.Size = New-Object System.Drawing.Size(352, 18); $lblCapInfo.Location = New-Object System.Drawing.Point(8, 42)
$tabPayg.Controls.Add($lblCapInfo)

# Cap editor row (visible only when pay-per-use is on): label · textbox · save.
$lblCapEdit = New-Object System.Windows.Forms.Label
$lblCapEdit.AutoSize = $false; $lblCapEdit.TextAlign = 'MiddleRight'; $lblCapEdit.ForeColor = $cText
$lblCapEdit.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$lblCapEdit.Size = New-Object System.Drawing.Size(170, 24); $lblCapEdit.Location = New-Object System.Drawing.Point(182, 70)
$lblCapEdit.Text = 'תקרה חודשית (₪)'
$tabPayg.Controls.Add($lblCapEdit)

$txtCap = New-Object System.Windows.Forms.TextBox
$txtCap.Size = New-Object System.Drawing.Size(90, 24); $txtCap.Location = New-Object System.Drawing.Point(86, 71)
$txtCap.TextAlign = 'Center'
$tabPayg.Controls.Add($txtCap)

$btnSaveCap = New-Object System.Windows.Forms.Button
$btnSaveCap.Size = New-Object System.Drawing.Size(70, 26); $btnSaveCap.Location = New-Object System.Drawing.Point(10, 70)
$btnSaveCap.FlatStyle = 'Flat'; $btnSaveCap.FlatAppearance.BorderSize = 0
$btnSaveCap.BackColor = $cTeal; $btnSaveCap.ForeColor = [System.Drawing.Color]::White
$btnSaveCap.Font = New-Object System.Drawing.Font('Segoe UI', 9); $btnSaveCap.Cursor = 'Hand'
$btnSaveCap.Text = 'שמור'
$tabPayg.Controls.Add($btnSaveCap)

$btnPayg = New-Object System.Windows.Forms.Button
$btnPayg.Size = New-Object System.Drawing.Size(220, 34); $btnPayg.Location = New-Object System.Drawing.Point(76, 116)
$btnPayg.FlatStyle = 'Flat'; $btnPayg.FlatAppearance.BorderSize = 0
$btnPayg.BackColor = $cTeal; $btnPayg.ForeColor = [System.Drawing.Color]::White
$btnPayg.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$btnPayg.Cursor = 'Hand'; $tabPayg.Controls.Add($btnPayg)

# ----- Tab 3: BYOK — the user's OWN Anthropic API key. Stored server-side
# (envelope-encrypted) via the PAT; coding requests then route through the user's
# key. The raw key is piped to the binary over stdin so it never lands in the
# process argument list.
$lblByokTitle = New-Object System.Windows.Forms.Label
$lblByokTitle.AutoSize = $false; $lblByokTitle.TextAlign = 'MiddleRight'; $lblByokTitle.ForeColor = $cInk
$lblByokTitle.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$lblByokTitle.Size = New-Object System.Drawing.Size(352, 20); $lblByokTitle.Location = New-Object System.Drawing.Point(8, 16)
$lblByokTitle.Text = 'מפתח API משלך (Anthropic)'
$tabByok.Controls.Add($lblByokTitle)

$lblByok = New-Object System.Windows.Forms.Label
$lblByok.AutoSize = $false; $lblByok.TextAlign = 'MiddleRight'; $lblByok.ForeColor = $cText
$lblByok.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$lblByok.Size = New-Object System.Drawing.Size(352, 36); $lblByok.Location = New-Object System.Drawing.Point(8, 40)
$tabByok.Controls.Add($lblByok)

$txtKey = New-Object System.Windows.Forms.TextBox
$txtKey.Size = New-Object System.Drawing.Size(256, 24); $txtKey.Location = New-Object System.Drawing.Point(96, 88)
$txtKey.UseSystemPasswordChar = $true
$txtKey.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$tabByok.Controls.Add($txtKey)

$btnSaveKey = New-Object System.Windows.Forms.Button
$btnSaveKey.Size = New-Object System.Drawing.Size(82, 26); $btnSaveKey.Location = New-Object System.Drawing.Point(8, 87)
$btnSaveKey.FlatStyle = 'Flat'; $btnSaveKey.FlatAppearance.BorderSize = 0
$btnSaveKey.BackColor = $cTeal; $btnSaveKey.ForeColor = [System.Drawing.Color]::White
$btnSaveKey.Font = New-Object System.Drawing.Font('Segoe UI', 9); $btnSaveKey.Cursor = 'Hand'
$btnSaveKey.Text = 'שמור מפתח'
$tabByok.Controls.Add($btnSaveKey)

$btnRemoveKey = New-Object System.Windows.Forms.Button
$btnRemoveKey.Size = New-Object System.Drawing.Size(120, 26); $btnRemoveKey.Location = New-Object System.Drawing.Point(8, 124)
$btnRemoveKey.FlatStyle = 'Flat'; $btnRemoveKey.FlatAppearance.BorderSize = 0
$btnRemoveKey.BackColor = $cBorder; $btnRemoveKey.ForeColor = $cInk
$btnRemoveKey.Font = New-Object System.Drawing.Font('Segoe UI', 9); $btnRemoveKey.Cursor = 'Hand'
$btnRemoveKey.Text = 'הסר מפתח'
$tabByok.Controls.Add($btnRemoveKey)

# Pulls `sai-code balance` + `sai-code payg` and renders the panel. Best-effort:
# any failure shows a muted fallback rather than throwing.
function Refresh-Account {
    $b = $null
    try { $b = Invoke-Sai @('balance') | ConvertFrom-Json } catch {}
    if ($b -and -not $b.error) {
        if ($b.daily.unlimited) { $lblDaily.Text = 'ללא הגבלה' }
        else { $lblDaily.Text = '{0:N0} מתוך {1:N0} נותרו' -f [int]$b.daily.remaining, [int]$b.daily.limit }

        # Monthly usage + the period it counts from (transparency on the window).
        $since = ''
        if ($b.monthly.periodStart) {
            try { $since = ' · מאז ' + ([datetime]$b.monthly.periodStart).ToString('dd/MM') } catch {}
        }
        $lblMonthly.Text = ('{0:N0} טוקנים' -f [int]$b.monthly.used) + $since
        $lblCredits.Text = '{0:N0} טוקנים' -f [int]$b.tokenCredits
        if ([int]$b.paygReserve -gt 0) {
            $lblReserve.Text = 'רזרבת תשלום לפי שימוש: {0:N0}' -f [int]$b.paygReserve; $lblReserve.Visible = $true
        } else { $lblReserve.Visible = $false }

        # usage-quota toast alert on approaching the daily SAI Code allowance.
        if (-not $b.daily.unlimited -and [int]$b.daily.limit -gt 0) {
            $used = [int]$b.daily.used; $limit = [int]$b.daily.limit
            # daily reset → usage dropped → re-arm the alert ladder.
            if ($script:prevDailyUsed -ge 0 -and $used -lt $script:prevDailyUsed) { $script:lastQuotaAlert = 0 }
            $script:prevDailyUsed = $used
            $pct = [int](100.0 * $used / $limit)
            $lblDaily.Text = 'נותרו {0:N0} מתוך {1:N0} ({2}% נוצל)' -f [int]$b.daily.remaining, $limit, $pct
            foreach ($lvl in @(95, 80)) {
                if ($pct -ge $lvl -and $script:lastQuotaAlert -lt $lvl) {
                    $script:lastQuotaAlert = $lvl
                    $ttl = if ($lvl -ge 95) { 'המכסה היומית כמעט נגמרה' } else { 'מתקרב למכסה היומית' }
                    $tip = "ניצלת $pct% מהמכסה היומית של SAI Code."
                    if (-not $script:paygEnabled) { $tip += ' שקול להפעיל תשלום לפי שימוש.' }
                    try { $notify.ShowBalloonTip(8000, $ttl, $tip, [System.Windows.Forms.ToolTipIcon]::Warning) } catch {}
                    break
                }
            }
        } else { $script:prevDailyUsed = -1; $script:lastQuotaAlert = 0 }
    } else {
        $lblDaily.Text = 'לא ניתן לטעון מאזן'; $lblMonthly.Text = ''; $lblCredits.Text = ''
        $lblReserve.Visible = $false
    }

    # Pay-per-use is a BETA-only feature: show the whole section only to beta
    # users. `betaAccess` comes from the gateway /balance and is set from Odoo
    # (LibreChat Users → Enable Beta).
    $script:beta = [bool]($b -and -not $b.error -and $b.betaAccess)
    if (-not $script:beta) {
        # Collapse to compact — hide the entire side dashboard.
        $script:paygEligible = $false; $script:paygEnabled = $false
        $dashboard.Visible = $false; $form.Width = 440
        return
    }
    # Expand: show side dashboard with tabs.
    $dashboard.Visible = $true; $form.Width = 750

    $p = $null
    try { $p = Invoke-Sai @('payg') | ConvertFrom-Json } catch {}
    $script:paygEligible = [bool]($p -and $p.eligible)
    $script:paygEnabled  = [bool]($p -and $p.enabled)
    # Cap editor + transparency line show only when pay-per-use is active.
    $lblCapInfo.Visible = $script:paygEnabled
    $lblCapEdit.Visible = $script:paygEnabled
    $txtCap.Visible     = $script:paygEnabled
    $btnSaveCap.Visible = $script:paygEnabled
    if (-not $script:paygEligible) {
        $lblPayg.Text = 'תשלום לפי שימוש: אינו זמין במסלול הנוכחי'; $lblPayg.ForeColor = $cMuted
        $btnPayg.Text = 'שדרג מסלול'; $btnPayg.BackColor = $cBorder
    } elseif ($script:paygEnabled) {
        $lblPayg.Text = 'תשלום לפי שימוש: פעיל'; $lblPayg.ForeColor = $cTealDk
        $cap = [double]($p.cap); $spent = [double]($p.spent_this_month)
        $lblCapInfo.Text = 'תקרה חודשית: ₪{0:N0} · נוצל החודש: ₪{1:N0}' -f $cap, $spent
        if (-not $txtCap.Focused) { $txtCap.Text = ('{0:0}' -f $cap) }
        $btnPayg.Text = 'כבה תשלום לפי שימוש'; $btnPayg.BackColor = $cRed
    } else {
        $lblPayg.Text = 'תשלום לפי שימוש: כבוי'; $lblPayg.ForeColor = $cMuted
        $btnPayg.Text = 'הפעל תשלום לפי שימוש'; $btnPayg.BackColor = $cTeal
    }
    Refresh-Byok
}

# Renders the BYOK (own API key) subsection from `sai-code byok status`. Beta-only
# (callers already gate on $script:beta). Best-effort — failures show muted text.
function Refresh-Byok {
    $s = $null
    try { $s = Invoke-Sai @('byok', 'status') | ConvertFrom-Json } catch {}
    $an = $null
    if ($s -and $s.providers) { $an = $s.providers | Where-Object { $_.id -eq 'anthropic' } | Select-Object -First 1 }
    if (-not ($s -and $s.eligible)) {
        $lblByok.Text = 'שימוש במפתח אישי אינו זמין בחשבון זה'; $lblByok.ForeColor = $cMuted
        $txtKey.Visible = $false; $btnSaveKey.Visible = $false; $btnRemoveKey.Visible = $false
        return
    }
    $txtKey.Visible = $true; $btnSaveKey.Visible = $true
    if ($an -and $an.configured) {
        $msg = 'מפתח פעיל ••••' + $an.last4
        if ($an.needsReentry) { $msg += ' — נדרשת הזנה מחדש' }
        $lblByok.Text = $msg; $lblByok.ForeColor = $cTealDk
        $btnRemoveKey.Visible = $true
    } else {
        $lblByok.Text = 'לא הוגדר מפתח — הדבק מפתח Anthropic כדי להשתמש בו'; $lblByok.ForeColor = $cMuted
        $btnRemoveKey.Visible = $false
    }
}

# Save the user's own Anthropic key. Piped over stdin (NOT an arg) so the secret
# never appears in the process list. The backend validates before storing.
$btnSaveKey.Add_Click({
    $key = ($txtKey.Text).Trim()
    if ($key -eq '') { $lblLog.Text = 'הדבק מפתח API.'; return }
    $r = $null
    try { $r = ($key | & $exe byok set 2>&1 | Out-String | ConvertFrom-Json) } catch {}
    if ($r -and $r.ok) { $lblLog.Text = 'המפתח נשמר ✓'; $txtKey.Text = '' }
    elseif ($r -and $r.error -eq 'invalid_key') { $lblLog.Text = 'מפתח לא תקין.' }
    elseif ($r -and $r.error -eq 'not_eligible') { $lblLog.Text = 'החשבון אינו זכאי למפתח אישי.' }
    elseif ($r -and $r.error -eq 'cooldown') { $lblLog.Text = 'נסה שוב בעוד רגע.' }
    elseif ($r -and $r.error -eq 'validation_unavailable') { $lblLog.Text = 'אימות לא זמין כעת, נסה שוב.' }
    else { $lblLog.Text = 'לא ניתן לשמור את המפתח כעת.' }
    Refresh-Account
})

$btnRemoveKey.Add_Click({
    $ans = [System.Windows.Forms.MessageBox]::Show('להסיר את המפתח האישי? הבקשות יחזרו להשתמש במכסת SAI.', 'הסרת מפתח', 'YesNo', 'Question')
    if ($ans -ne 'Yes') { return }
    $r = $null
    try { $r = Invoke-Sai @('byok', 'remove') | ConvertFrom-Json } catch {}
    if ($r -and $r.ok) { $lblLog.Text = 'המפתח הוסר ✓' } else { $lblLog.Text = 'לא ניתן להסיר את המפתח כעת.' }
    Refresh-Account
})

$btnPayg.Add_Click({
    if (-not $script:paygEligible) { Open-Url (Get-Urls).account; return }
    if ($script:paygEnabled) {
        try { Invoke-Sai @('payg', 'disable') | Out-Null } catch {}
        $lblLog.Text = 'תשלום לפי שימוש כובה.'; Refresh-Account; return
    }
    $msg = "הפעלת תשלום לפי שימוש מאשרת חיוב אוטומטי של אמצעי התשלום השמור כאשר המכסה היומית נגמרת, עד התקרה החודשית.`n`nלהמשיך?"
    $ans = [System.Windows.Forms.MessageBox]::Show($msg, 'תשלום לפי שימוש', 'YesNo', 'Question')
    if ($ans -ne 'Yes') { return }
    $r = $null
    try { $r = Invoke-Sai @('payg', 'enable', '--consent') | ConvertFrom-Json } catch {}
    if ($r -and $r.status -eq 'enabled') { $lblLog.Text = 'תשלום לפי שימוש הופעל ✓' }
    elseif ($r -and $r.status -eq 'no_token') {
        $lblLog.Text = 'אין אמצעי תשלום שמור — הוסף בפורטל.'; Open-Url (Get-Urls).payg
    } else { $lblLog.Text = 'לא ניתן להפעיל תשלום לפי שימוש כעת.' }
    Refresh-Account
})

# Save a new monthly ceiling. Validates a non-negative number, then POSTs it.
$btnSaveCap.Add_Click({
    $raw = ($txtCap.Text).Trim()
    $val = 0.0
    if (-not [double]::TryParse($raw, [ref]$val) -or $val -lt 0) {
        $lblLog.Text = 'תקרה לא תקינה — הזן מספר (₪).'; return
    }
    $r = $null
    try { $r = Invoke-Sai @('payg', 'cap', ('{0:0}' -f $val)) | ConvertFrom-Json } catch {}
    if ($r -and $r.status -eq 'cap_set') { $lblLog.Text = 'התקרה החודשית עודכנה ✓' }
    else { $lblLog.Text = 'לא ניתן לעדכן את התקרה כעת.' }
    Refresh-Account
})

# auto-refresh the balance/PAYG panel while connected (live numbers + alerts)
$acctTimer = New-Object System.Windows.Forms.Timer
$acctTimer.Interval = 20000
$acctTimer.Add_Tick({ if ($script:connected) { Refresh-Account } })

# ---- state machine ----
# Renders the UI from a `doctor` report. States:
#   checking | needs-install | blocked | ready | connected
function Refresh-State {
    $d = Get-Doctor
    $script:doctor = $d
    $btnPrimary.Visible = $true; $btnPrimary.Enabled = $true; $btnPrimary.BackColor = $cTeal
    $btnDisconnect.Visible = $false
    $lblDetail.Text = ''; $lblDetail.ForeColor = $cMuted
    # collapse to compact size (hide side dashboard)
    $script:connected = $false
    $dashboard.Visible = $false; $form.Width = 440; $acctTimer.Stop()

    if ($null -eq $d) {
        $lblStatus.Text = '⚠ שגיאת אבחון'; $lblStatus.ForeColor = $cRed
        $lblDetail.Text = 'לא ניתן להריץ את כלי SAI. נסה להפעיל מחדש.'
        $btnPrimary.Text = 'נסה שוב'; $script:primary = 'recheck'
        return
    }

    # 1. prerequisites (Node / Claude Code)
    if (-not ($d.node.ok -and $d.claude.ok)) {
        $missing = @()
        if (-not $d.node.ok)   { $missing += 'Node.js' }
        if (-not $d.claude.ok) { $missing += 'Claude Code' }
        $lblStatus.Text = '○ דרושה התקנה'; $lblStatus.ForeColor = $cAmber
        $lblDetail.Text = "חסר: $($missing -join ', '). לחץ להתקנה אוטומטית."
        $btnPrimary.Text = 'התקן את הרכיבים הדרושים'; $script:primary = 'install'
        return
    }

    # 2. gateway blocked by the filter
    if ($d.gateway.status -ne 'ok') {
        $gwHost = ([uri]$d.gateway.url).Host
        $lblStatus.Text = '⛔ החיבור חסום'; $lblStatus.ForeColor = $cRed
        $lblDetail.Text = "$($d.gateway.detail)`nבקש מהסינון לאשר: $gwHost"
        $btnPrimary.Text = 'נסה שוב'; $script:primary = 'recheck'
        return
    }

    # 3. connected
    if ($d.account.connected) {
        $envTxt = if ($d.account.env -eq 'dev') { ' · פיתוח' } else { '' }
        $lblStatus.Text = "● מחובר: $($d.account.email)$envTxt"; $lblStatus.ForeColor = $cTealDk
        $lblDetail.Text = 'הסינון פעיל. Claude Code מנותב דרך SAI.'
        $btnPrimary.Text = 'חבר מחדש'; $script:primary = 'connect'
        $btnDisconnect.Visible = $true; $btnDisconnect.Enabled = $true
        $script:connected = $true
        $form.Width = 750; $dashboard.Visible = $true; $lblDashEmail.Text = $d.account.email
        Refresh-Account; $acctTimer.Start()
        return
    }

    # 4. ready (prereqs ok, gateway ok, not connected)
    $lblStatus.Text = '○ מוכן — התחבר'; $lblStatus.ForeColor = $cMuted
    $lblDetail.Text = 'הכל מוכן. התחבר עם חשבון SAI כדי להפעיל את הסינון.'
    $btnPrimary.Text = 'התחבר עם חשבון SAI'; $script:primary = 'connect'
}

# ---- background poll timer (connect / install) ----
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2500
$timer.Add_Tick({
    $script:ticks++
    $d = Get-Doctor
    if ($script:mode -eq 'connect') {
        if ($null -ne $d -and $d.account.connected) {
            $timer.Stop(); $script:mode = ''; Refresh-State; $lblLog.Text = 'ההתחברות הושלמה ✓'
        } elseif ($script:ticks -ge 80) {
            $timer.Stop(); $script:mode = ''; Refresh-State; $lblLog.Text = 'תם הזמן. נסה שוב.'
        }
    } elseif ($script:mode -eq 'install') {
        # tail the live install log into the progress box (UTF-8 — the tool
        # writes Hebrew; reading as ANSI would mojibake it).
        $logTxt = ''
        if (Test-Path $script:installOut) {
            try {
                $logTxt = [System.IO.File]::ReadAllText($script:installOut, [System.Text.Encoding]::UTF8)
                if ($logTxt -and $logTxt -ne $progressBox.Text) {
                    $progressBox.Text = $logTxt
                    $progressBox.SelectionStart = $progressBox.Text.Length
                    $progressBox.ScrollToCaret()
                }
            } catch {}
        }
        $procDone = ($null -ne $script:installProc -and $script:installProc.HasExited)
        if ($null -ne $d -and $d.node.ok -and $d.claude.ok) {
            $timer.Stop(); $script:mode = ''
            $progressBox.Visible = $false
            Refresh-State; $lblLog.Text = 'ההתקנה הושלמה ✓'
        } elseif ($procDone) {
            $timer.Stop(); $script:mode = ''
            $progressBox.Visible = $false
            # surface the failure reason — the tool writes "שגיאה: …" into the log
            $reason = ''
            if ($logTxt) {
                $errLine = ($logTxt -split "`r?`n" | Where-Object { $_ -like 'שגיאה:*' } | Select-Object -Last 1)
                if ($errLine) { $reason = $errLine }
            }
            Refresh-State
            # keep the failure on screen (detail line, red) until the next action,
            # and point the user at "save logs" so support can diagnose.
            if ($reason) { $lblDetail.Text = $reason; $lblDetail.ForeColor = $cRed }
            $lblLog.Text = 'ההתקנה נכשלה — לחץ "שמור לוגים" ושלח לתמיכה'
        } elseif ($script:ticks -ge 200) {
            $timer.Stop(); $script:mode = ''; $progressBox.Visible = $false
            Refresh-State; $lblLog.Text = 'ההתקנה ארכה זמן רב. בדוק את החיבור.'
        }
    }
})

# ---- primary button dispatch ----
$btnPrimary.Add_Click({
    if ($script:mode -ne '') { return }
    switch ($script:primary) {
        'recheck' { $lblLog.Text = 'בודק…'; Refresh-State }
        'install' {
            # Run NON-elevated so the CA export + npm run in the USER's context
            # (their cert store holds the filter CA, which an elevated/admin run
            # can't see). The tool self-elevates ONLY the Node MSI — a single UAC
            # prompt may appear for that. Progress is teed to a log file we tail.
            $script:installOut = Join-Path $env:TEMP 'sai-code-install.log'
            try { [System.IO.File]::WriteAllText($script:installOut, '') } catch {}
            $progressBox.Clear(); $progressBox.Visible = $true; $progressBox.BringToFront()
            try {
                $script:installProc = Start-Process -FilePath $exe -ArgumentList @('install') `
                    -WindowStyle Hidden -PassThru
            } catch {
                $progressBox.Visible = $false
                $lblLog.Text = 'לא ניתן להפעיל את ההתקנה. נסה שוב.'
                return
            }
            $script:mode = 'install'; $script:ticks = 0
            $btnPrimary.Enabled = $false; $btnPrimary.Text = 'מתקין…'
            $lblDetail.Text = ''
            $lblLog.Text = 'מתקין Node.js ו-Claude Code — מציג התקדמות:'
            $timer.Start()
        }
        'connect' {
            $script:mode = 'connect'; $script:ticks = 0
            $btnPrimary.Enabled = $false
            $envName = if ($script:env -eq 'dev') { 'פיתוח' } else { 'ייצור' }
            $lblLog.Text = "פותח דפדפן להתחברות ($envName)…"
            Start-Process -FilePath $exe -ArgumentList @('activate', '--env', $script:env) -WindowStyle Hidden | Out-Null
            $timer.Start()
        }
    }
})

$btnDisconnect.Add_Click({
    $lblLog.Text = 'מנתק ומבטל את המפתח…'
    Invoke-Sai @('disable') | Out-Null
    Refresh-State
    $lblLog.Text = 'התנתקת — המפתח בוטל וכל סשני Claude נחסמו.'
})

# ---- update banner ----
$lblUpdate.Add_Click({ Start-UpdateFlow })
$updateBar.Add_Click({ Start-UpdateFlow })
function Start-UpdateFlow {
    $lblUpdate.Text = 'מעדכן…'
    $out = Invoke-Sai @('update')
    if ($LASTEXITCODE -eq 0) {
        # The update may have replaced the GUI script + launcher (not just the
        # binary). Relaunch via the now-updated launcher so the new GUI loads,
        # then close this (stale) window.
        $updateBar.Visible = $false
        $lblLog.Text = 'עודכן — מפעיל מחדש…'
        $launcher = Join-Path $scriptDir 'sai-code-launch.exe'
        try {
            if (Test-Path $launcher) {
                Start-Process -FilePath $launcher | Out-Null
            } else {
                Start-Process -FilePath 'powershell.exe' `
                    -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', (Join-Path $scriptDir 'sai-code-gui.ps1')) | Out-Null
            }
        } catch {}
        $form.Close()
    } else {
        $lblLog.Text = 'עדכון: ' + ($out -split "`n" | Select-Object -Last 1)
    }
}
function Check-Update {
    # auto-check on open — only when the gateway is reachable (never hang on a block)
    if ($null -eq $script:doctor -or $script:doctor.gateway.status -ne 'ok') { return }
    try {
        $u = Invoke-Sai @('check-update', '--json') | ConvertFrom-Json
        if ($u.available) {
            $lblUpdate.Text = "עדכון זמין: $($u.latest) — לחץ לעדכון"
            $updateBar.Visible = $true
        }
    } catch {}
}
# Manual "check for updates" link — always gives feedback (up-to-date / available / error).
function Manual-CheckUpdate {
    $lblLog.Text = 'בודק עדכונים…'
    try {
        $u = Invoke-Sai @('check-update', '--json') | ConvertFrom-Json
        if ($u.available) {
            $lblUpdate.Text = "עדכון זמין: $($u.latest) — לחץ לעדכון"
            $updateBar.Visible = $true; $updateBar.BringToFront()
            $lblLog.Text = "עדכון זמין: $($u.latest)"
        } elseif ($u.error) {
            $lblLog.Text = 'בדיקת עדכון נכשלה — בדוק חיבור'
        } else {
            $lblLog.Text = "מותקנת הגרסה העדכנית ($($u.current)) ✓"
        }
    } catch { $lblLog.Text = 'בדיקת עדכון נכשלה' }
}

# Collect a full diagnostics bundle (environment, prerequisite probes, gateway
# reachability, install + app logs) and save it to the Desktop *and* the clipboard
# so a user behind a filter can send it to support. Opens Explorer on the file.
function Save-Logs {
    $lblLog.Text = 'אוסף לוגים…'
    [System.Windows.Forms.Application]::DoEvents()
    $diag = ''
    try { $diag = Invoke-Sai @('logs') } catch {}
    if (-not $diag -or $diag.Trim() -eq '') { $diag = '(no diagnostics output)' }
    $desktop = [Environment]::GetFolderPath('Desktop')
    $path = Join-Path $desktop 'sai-code-logs.txt'
    $saved = $false; $copied = $false
    try {
        [System.IO.File]::WriteAllText($path, $diag, (New-Object System.Text.UTF8Encoding($true)))
        $saved = $true
    } catch {}
    try { Set-Clipboard -Value $diag; $copied = $true } catch {}
    if ($saved) {
        $lblLog.Text = 'לוגים נשמרו לשולחן העבודה (sai-code-logs.txt) — שלח אותם לתמיכה'
        try { Start-Process explorer.exe "/select,`"$path`"" | Out-Null } catch {}
    } elseif ($copied) {
        $lblLog.Text = 'הלוגים הועתקו ללוח — הדבק בהודעה לתמיכה'
    } else {
        $lblLog.Text = 'לא ניתן לאסוף לוגים'
    }
}

$form.Add_Shown({
    $script:uiReady = $true
    # show the installed version in the footer
    try { $script:version = (Invoke-Sai @('version')).Trim() } catch { $script:version = '' }
    if ($script:version) { $lblFoot.Text = "SAI Code $($script:version) · sai-app.com" }
    $lblLog.Text = 'בודק מערכת…'
    Refresh-State
    Check-Update
    $lblLog.Text = ''
})

if ($env:SAI_GUI_SELFTEST -eq '1') {
    Refresh-State
    if ($env:SAI_GUI_CAPTURE) {
        $form.ShowInTaskbar = $false; $form.StartPosition = 'Manual'
        $form.Location = New-Object System.Drawing.Point(-2000, -2000); $form.Show()
        1..5 | ForEach-Object { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 150 }
        $bmp = New-Object System.Drawing.Bitmap($form.Width, $form.Height)
        $form.DrawToBitmap($bmp, (New-Object System.Drawing.Rectangle(0, 0, $form.Width, $form.Height)))
        $bmp.Save($env:SAI_GUI_CAPTURE, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose(); $form.Hide()
        Write-Host "captured -> $env:SAI_GUI_CAPTURE"
    }
    Write-Host ("SELFTEST OK  primary={0}" -f $script:primary)
    $form.Dispose(); return
}

[System.Windows.Forms.Application]::Run($form)
