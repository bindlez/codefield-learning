param(
  [Parameter(Mandatory=$true)][ValidatePattern('^[0-9a-f-]{36}$')][string]$Token,
  [Parameter(Mandatory=$true)][ValidateSet('attach','move')][string]$Action,
  [int]$Dx = 0,
  [int]$Dy = 0
)
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class CodefieldWindow {
  public delegate bool EnumProc(IntPtr hwnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc callback, IntPtr arg);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr hwnd, StringBuilder text, int length);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hwnd);
  [DllImport("user32.dll", EntryPoint="GetWindowLongPtrW")] public static extern IntPtr GetWindowLongPtr(IntPtr hwnd, int index);
  [DllImport("user32.dll", EntryPoint="SetWindowLongPtrW")] public static extern IntPtr SetWindowLongPtr(IntPtr hwnd, int index, IntPtr value);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hwnd, IntPtr after, int x, int y, int cx, int cy, uint flags);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hwnd, out RECT rect);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
"@
$target = [IntPtr]::Zero
for ($attempt = 0; $attempt -lt 40 -and $target -eq [IntPtr]::Zero; $attempt++) {
  $found = [System.Collections.Generic.List[IntPtr]]::new()
  $callback = [CodefieldWindow+EnumProc]{
    param($hwnd, $arg)
    if ([CodefieldWindow]::IsWindowVisible($hwnd)) {
      $title = [System.Text.StringBuilder]::new(512)
      [void][CodefieldWindow]::GetWindowText($hwnd, $title, $title.Capacity)
      if ($title.ToString().Contains("Codefield floating editor $Token")) { $found.Add($hwnd) }
    }
    return $true
  }
  [void][CodefieldWindow]::EnumWindows($callback, [IntPtr]::Zero)
  if ($found.Count -gt 0) { $target = $found[0] } else { Start-Sleep -Milliseconds 250 }
}
if ($target -eq [IntPtr]::Zero) { Write-Error 'Floating window was not found.'; exit 1 }
if ($Action -eq 'attach') {
  $style = [CodefieldWindow]::GetWindowLongPtr($target, -16).ToInt64()
  $style = $style -band (-bnot 0x00CF0000)
  [void][CodefieldWindow]::SetWindowLongPtr($target, -16, [IntPtr]::new($style))
  # HWND_TOPMOST, keep size and position, refresh the non-client frame.
  if (-not [CodefieldWindow]::SetWindowPos($target, [IntPtr]::new(-1), 0, 0, 0, 0, 0x0023)) { exit 1 }
} else {
  $rect = [CodefieldWindow+RECT]::new()
  if (-not [CodefieldWindow]::GetWindowRect($target, [ref]$rect)) { exit 1 }
  if (-not [CodefieldWindow]::SetWindowPos($target, [IntPtr]::Zero, ($rect.Left + $Dx), ($rect.Top + $Dy), 0, 0, 0x0015)) { exit 1 }
}
