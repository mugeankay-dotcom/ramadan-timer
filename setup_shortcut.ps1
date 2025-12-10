
try {
    # 1. Convert Icon
    Add-Type -AssemblyName System.Drawing
    $workDir = 'c:\Users\HP\.gemini\antigravity\scratch\ramadan_timer'
    $srcIcon = "$workDir\icon-kabe-512.png"
    $dstIcon = "$workDir\app.ico"
    
    if (Test-Path $srcIcon) {
        $img = [System.Drawing.Bitmap]::FromFile($srcIcon)
        $handle = $img.GetHicon()
        $icon = [System.Drawing.Icon]::FromHandle($handle)
        
        $stream = New-Object System.IO.FileStream($dstIcon, [System.IO.FileMode]::Create)
        $icon.Save($stream)
        $stream.Close()
        
    
        $img.Dispose()
        Write-Host "Icon created: $dstIcon"
    }
    else {
        Write-Warning "Source icon not found, skipping icon creation."
    }

    # 2. Create Shortcut
    $WshShell = New-Object -comObject WScript.Shell
    $ShortcutPath = "$Home\Desktop\Ramazan 2026.lnk"
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    
    # Target: Chrome with --app flag
    # Try typical paths
    $ChromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (-not (Test-Path $ChromePath)) {
        $ChromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    }
    
    $Shortcut.TargetPath = $ChromePath
    $Shortcut.Arguments = "--app=""file:///$workDir/index.html"""
    $Shortcut.Description = "Ramazan 2026 İmsakiyesi ve Zikirmatik"
    $Shortcut.IconLocation = "$dstIcon"
    $Shortcut.Save()
    
    Write-Host "Shortcut created at: $ShortcutPath"
}
catch {
    Write-Error $_
    exit 1
}
