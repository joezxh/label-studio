# 启动 Label Studio 并自动加载仓库根目录的 .env 环境变量。
# 用法：
#   ./scripts/start-label-studio.ps1              # 默认执行 label-studio
#   ./scripts/start-label-studio.ps1 -Command "python -m label_studio"   # 从源码运行
#   ./scripts/start-label-studio.ps1 -Command "label-studio --port 8080"
param(
    [string]$Command = "label-studio"
)

$ErrorActionPreference = 'Stop'
$envFile = Join-Path $PSScriptRoot '..\.env'

if (Test-Path $envFile) {
    Write-Host "Loading environment variables from $envFile"
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $parts = $line -split '=', 2
            if ($parts.Count -eq 2) {
                $name = $parts[0].Trim()
                $value = $parts[1].Trim()
                if ($value.Length -ge 2 -and $value[0] -eq '"' -and $value[-1] -eq '"') {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                Set-Item -Path "env:$name" -Value $value
                Write-Host "  $name=$value"
            }
        }
    }
} else {
    Write-Warning ".env not found at $envFile, starting without extra env vars."
}

Write-Host "Starting Label Studio: $Command"
Invoke-Expression $Command
