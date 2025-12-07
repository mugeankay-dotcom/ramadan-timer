$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$Home\Desktop\Ramazan 2026.lnk")
$Shortcut.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$Shortcut.Arguments = "--app=""file:///c:/Users/HP/.gemini/antigravity/scratch/ramadan_timer/index.html"""
$Shortcut.Description = "Ramazan 2026 İmsakiyesi ve Sayacı"
$Shortcut.IconLocation = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$Shortcut.Save()
