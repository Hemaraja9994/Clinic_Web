# Serves the Sri Rudra desk on this PC and opens it in the browser.
# Close this window to stop the desk.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8734
$listener = New-Object System.Net.HttpListener
$started = $false
foreach ($candidate in 8734, 8735, 8736, 8740) {
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:$candidate/")
  try {
    $listener.Start()
    $port = $candidate
    $started = $true
    break
  } catch {
    $listener.Close()
  }
}
if (-not $started) {
  Write-Host 'Could not start the desk. Close other copies of this window and try again.'
  Write-Host 'If Windows asks for permission, allow localhost, or run this file once as administrator.'
  Read-Host 'Press Enter to close'
  exit 1
}

$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.js' = 'text/javascript; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json'
  '.webmanifest' = 'application/manifest+json'
  '.png' = 'image/png'
  '.svg' = 'image/svg+xml'
  '.txt' = 'text/plain; charset=utf-8'
  '.woff2' = 'font/woff2'
}

Write-Host "Sri Rudra desk is running at http://localhost:$port/"
Write-Host 'Leave this window open while you work. Close it to stop the desk.'
Start-Process "http://localhost:$port/"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
  if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
  $relative = $path.TrimStart('/') -replace '/', [IO.Path]::DirectorySeparatorChar
  $file = Join-Path $root $relative
  $rootFull = [IO.Path]::GetFullPath($root)
  $fileFull = [IO.Path]::GetFullPath($file)
  $prefix = $rootFull.TrimEnd('\') + '\'
  $inside = $fileFull.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)
  if ($inside -and (Test-Path -LiteralPath $fileFull) -and -not (Get-Item -LiteralPath $fileFull).PSIsContainer) {
    $bytes = [IO.File]::ReadAllBytes($fileFull)
    $ext = [IO.Path]::GetExtension($fileFull).ToLowerInvariant()
    if ($types.ContainsKey($ext)) { $context.Response.ContentType = $types[$ext] }
    else { $context.Response.ContentType = 'application/octet-stream' }
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $context.Response.StatusCode = 404
    $missing = [Text.Encoding]::UTF8.GetBytes('Not found')
    $context.Response.OutputStream.Write($missing, 0, $missing.Length)
  }
  $context.Response.Close()
}
