Add-Type -AssemblyName System.Drawing

function New-Brush([int]$r, [int]$g, [int]$b) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($r, $g, $b))
}

function Draw-TowerKick {
  param(
    [System.Drawing.Graphics]$g,
    [int]$w,
    [int]$h,
    [bool]$round = $false
  )
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(10, 22, 32))

  if ($round) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(1, 1, $w - 2, $h - 2)
    $g.SetClip($path)
  }

  $s = [Math]::Min($w, $h)
  $cx = $w / 2.0
  $cy = $h / 2.0

  $stone = New-Brush 28 58 74
  $stoneDark = New-Brush 16 36 48
  $cyan = New-Brush 0 229 255
  $cyanSoft = New-Brush 61 231 255
  $pink = New-Brush 255 77 141
  $white = New-Brush 232 248 255

  $tw = $s * 0.24
  $th = $s * 0.48
  $tx = $cx - $tw * 0.18
  $ty = $cy - $th * 0.46
  $g.FillRectangle($stoneDark, [float]($tx + $s * 0.02), [float]($ty + $s * 0.02), [float]$tw, [float]$th)
  $g.FillRectangle($stone, [float]$tx, [float]$ty, [float]$tw, [float]$th)

  $win = $s * 0.042
  for ($r = 0; $r -lt 4; $r++) {
    for ($c = 0; $c -lt 2; $c++) {
      $brush = if (($r + $c) % 2 -eq 0) { $cyan } else { $cyanSoft }
      $g.FillRectangle(
        $brush,
        [float]($tx + $s * 0.04 + $c * ($win + $s * 0.04)),
        [float]($ty + $s * 0.055 + $r * ($win + $s * 0.038)),
        [float]$win,
        [float]$win
      )
    }
  }

  $cap = New-Object System.Drawing.Drawing2D.GraphicsPath
  $cap.AddPolygon(@(
    (New-Object System.Drawing.PointF ([float]($tx - $s * 0.03), [float]$ty)),
    (New-Object System.Drawing.PointF ([float]($tx + $tw + $s * 0.03), [float]$ty)),
    (New-Object System.Drawing.PointF ([float]($tx + $tw * 0.5), [float]($ty - $s * 0.07)))
  ))
  $g.FillPath($cyan, $cap)

  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(0, 229, 255), [float]($s * 0.055))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine(
    $pen,
    [float]($cx - $s * 0.34),
    [float]($cy + $s * 0.20),
    [float]($tx + $s * 0.01),
    [float]($cy + $s * 0.03)
  )
  $g.FillEllipse($pink, [float]($cx - $s * 0.38), [float]($cy + $s * 0.14), [float]($s * 0.13), [float]($s * 0.09))
  $g.FillEllipse($white, [float]($cx - $s * 0.35), [float]($cy + $s * 0.155), [float]($s * 0.04), [float]($s * 0.03))

  $stone.Dispose(); $stoneDark.Dispose(); $cyan.Dispose(); $cyanSoft.Dispose(); $pink.Dispose(); $white.Dispose(); $pen.Dispose()
}

function Save-Icon([string]$path, [int]$size, [bool]$round = $false) {
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  Draw-TowerKick -g $g -w $size -h $size -round $round
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

function Save-Splash([string]$path, [int]$w, [int]$h) {
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(10, 22, 32))
  $icon = [int]([Math]::Min($w, $h) * 0.36)
  $tmp = New-Object System.Drawing.Bitmap $icon, $icon
  $tg = [System.Drawing.Graphics]::FromImage($tmp)
  Draw-TowerKick -g $tg -w $icon -h $icon
  $tg.Dispose()
  $g.DrawImage($tmp, [int](($w - $icon) / 2), [int](($h - $icon) / 2 - $h * 0.06), $icon, $icon)
  $tmp.Dispose()
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$root = Split-Path $PSScriptRoot -Parent
$res = Join-Path $root "android\app\src\main\res"

Save-Icon (Join-Path $root "icon.png") 512
Save-Icon (Join-Path $res "mipmap-mdpi\ic_launcher.png") 48
Save-Icon (Join-Path $res "mipmap-mdpi\ic_launcher_round.png") 48 $true
Save-Icon (Join-Path $res "mipmap-mdpi\ic_launcher_foreground.png") 108
Save-Icon (Join-Path $res "mipmap-hdpi\ic_launcher.png") 72
Save-Icon (Join-Path $res "mipmap-hdpi\ic_launcher_round.png") 72 $true
Save-Icon (Join-Path $res "mipmap-hdpi\ic_launcher_foreground.png") 162
Save-Icon (Join-Path $res "mipmap-xhdpi\ic_launcher.png") 96
Save-Icon (Join-Path $res "mipmap-xhdpi\ic_launcher_round.png") 96 $true
Save-Icon (Join-Path $res "mipmap-xhdpi\ic_launcher_foreground.png") 216
Save-Icon (Join-Path $res "mipmap-xxhdpi\ic_launcher.png") 144
Save-Icon (Join-Path $res "mipmap-xxhdpi\ic_launcher_round.png") 144 $true
Save-Icon (Join-Path $res "mipmap-xxhdpi\ic_launcher_foreground.png") 324
Save-Icon (Join-Path $res "mipmap-xxxhdpi\ic_launcher.png") 192
Save-Icon (Join-Path $res "mipmap-xxxhdpi\ic_launcher_round.png") 192 $true
Save-Icon (Join-Path $res "mipmap-xxxhdpi\ic_launcher_foreground.png") 432

Save-Splash (Join-Path $res "drawable\splash.png") 480 800
Save-Splash (Join-Path $res "drawable-port-mdpi\splash.png") 320 480
Save-Splash (Join-Path $res "drawable-port-hdpi\splash.png") 480 800
Save-Splash (Join-Path $res "drawable-port-xhdpi\splash.png") 720 1280
Save-Splash (Join-Path $res "drawable-port-xxhdpi\splash.png") 960 1600
Save-Splash (Join-Path $res "drawable-port-xxxhdpi\splash.png") 1280 1920
Save-Splash (Join-Path $res "drawable-land-mdpi\splash.png") 480 320
Save-Splash (Join-Path $res "drawable-land-hdpi\splash.png") 800 480
Save-Splash (Join-Path $res "drawable-land-xhdpi\splash.png") 1280 720
Save-Splash (Join-Path $res "drawable-land-xxhdpi\splash.png") 1600 960
Save-Splash (Join-Path $res "drawable-land-xxxhdpi\splash.png") 1920 1280

Write-Host "icons and splash generated"
