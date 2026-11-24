$ErrorActionPreference = 'Stop'
$node = (Get-Command node.exe).Source
$entry = Join-Path $PSScriptRoot 'server/open-workspace.cjs'
$key = [Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('Software\Classes\codefield')
try {
  $key.SetValue('', 'URL:Codefield workspace')
  $key.SetValue('URL Protocol', '')
  $command = $key.CreateSubKey('shell\open\command')
  try { $command.SetValue('', ('"{0}" "{1}"' -f $node,$entry)) } finally { $command.Dispose() }
} finally { $key.Dispose() }
Write-Output 'The Start server link now opens this Codefield installation.'
