[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $InputPptx,

    [Parameter(Mandatory = $true)]
    [string] $OutputPptx,

    [ValidateRange(500, 3000)]
    [int] $DurationMs = 900
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourcePath = [System.IO.Path]::GetFullPath($InputPptx)
$destinationPath = [System.IO.Path]::GetFullPath($OutputPptx)
if (-not [System.IO.File]::Exists($sourcePath)) {
    throw "Input PowerPoint file not found: $sourcePath"
}
if ([System.StringComparer]::OrdinalIgnoreCase.Equals($sourcePath, $destinationPath)) {
    throw 'Use a different output path so the original export stays intact.'
}
if ([System.IO.File]::Exists($destinationPath)) {
    throw "Output already exists: $destinationPath"
}

$destinationDirectory = [System.IO.Path]::GetDirectoryName($destinationPath)
if (-not [System.IO.Directory]::Exists($destinationDirectory)) {
    [void][System.IO.Directory]::CreateDirectory($destinationDirectory)
}
$temporaryPath = Join-Path $destinationDirectory ('.morph-' + [Guid]::NewGuid().ToString('N') + '.tmp')

$presentationNamespace = 'http://schemas.openxmlformats.org/presentationml/2006/main'
$markupCompatibilityNamespace = 'http://schemas.openxmlformats.org/markup-compatibility/2006'
$morphNamespace = 'http://schemas.microsoft.com/office/powerpoint/2015/09/main'
$p14Namespace = 'http://schemas.microsoft.com/office/powerpoint/2010/main'
$xmlNamespace = 'http://www.w3.org/2000/xmlns/'

function Set-XmlPrefix($Element, [string] $Prefix, [string] $NamespaceUri) {
    $attribute = $Element.OwnerDocument.CreateAttribute('xmlns', $Prefix, $script:xmlNamespace)
    $attribute.Value = $NamespaceUri
    [void]$Element.Attributes.Append($attribute)
}

$sourceArchive = $null
$destinationArchive = $null
$destinationStream = $null
$slideCount = 0
$updatedCount = 0

try {
    $sourceArchive = [System.IO.Compression.ZipFile]::OpenRead($sourcePath)
    $destinationStream = [System.IO.File]::Open(
        $temporaryPath,
        [System.IO.FileMode]::CreateNew,
        [System.IO.FileAccess]::ReadWrite,
        [System.IO.FileShare]::None
    )
    $destinationArchive = [System.IO.Compression.ZipArchive]::new(
        $destinationStream,
        [System.IO.Compression.ZipArchiveMode]::Create,
        $false
    )

    foreach ($sourceEntry in $sourceArchive.Entries) {
        $destinationEntry = $destinationArchive.CreateEntry(
            $sourceEntry.FullName,
            [System.IO.Compression.CompressionLevel]::Optimal
        )
        $destinationEntry.LastWriteTime = $sourceEntry.LastWriteTime
        $destinationEntry.ExternalAttributes = $sourceEntry.ExternalAttributes

        $sourceEntryStream = $sourceEntry.Open()
        $destinationEntryStream = $destinationEntry.Open()
        try {
            if ($sourceEntry.FullName -match '^ppt/slides/slide(?<number>\d+)\.xml$') {
                $slideNumber = [int]$Matches['number']
                $slideCount++
                if ($slideNumber -gt 1) {
                    $slideDocument = [System.Xml.XmlDocument]::new()
                    $slideDocument.PreserveWhitespace = $true
                    $slideDocument.Load($sourceEntryStream)

                    $namespaces = [System.Xml.XmlNamespaceManager]::new($slideDocument.NameTable)
                    $namespaces.AddNamespace('p', $presentationNamespace)
                    $namespaces.AddNamespace('mc', $markupCompatibilityNamespace)

                    $slide = $slideDocument.DocumentElement
                    if ($slide.NamespaceURI -ne $presentationNamespace -or $slide.LocalName -ne 'sld') {
                        throw "Unexpected slide XML root in $($sourceEntry.FullName)."
                    }

                    foreach ($alternateContent in @($slide.SelectNodes('./mc:AlternateContent', $namespaces))) {
                        if ($alternateContent.SelectSingleNode('.//p:transition', $namespaces)) {
                            [void]$slide.RemoveChild($alternateContent)
                        }
                    }
                    foreach ($transition in @($slide.SelectNodes('./p:transition', $namespaces))) {
                        [void]$slide.RemoveChild($transition)
                    }

                    $alternate = $slideDocument.CreateElement('mc', 'AlternateContent', $markupCompatibilityNamespace)
                    Set-XmlPrefix $alternate 'mc' $markupCompatibilityNamespace
                    $choice = $slideDocument.CreateElement('mc', 'Choice', $markupCompatibilityNamespace)
                    $choice.SetAttribute('Requires', 'p159')
                    Set-XmlPrefix $choice 'p159' $morphNamespace

                    $morphTransition = $slideDocument.CreateElement('p', 'transition', $presentationNamespace)
                    Set-XmlPrefix $morphTransition 'p' $presentationNamespace
                    $morphTransition.SetAttribute('spd', 'slow')
                    Set-XmlPrefix $morphTransition 'p14' $p14Namespace
                    $duration = $slideDocument.CreateAttribute('p14', 'dur', $p14Namespace)
                    $duration.Value = [string]$DurationMs
                    [void]$morphTransition.Attributes.Append($duration)
                    $morph = $slideDocument.CreateElement('p159', 'morph', $morphNamespace)
                    $morph.SetAttribute('option', 'byObject')
                    [void]$morphTransition.AppendChild($morph)
                    [void]$choice.AppendChild($morphTransition)
                    [void]$alternate.AppendChild($choice)

                    $fallback = $slideDocument.CreateElement('mc', 'Fallback', $markupCompatibilityNamespace)
                    $fallbackTransition = $slideDocument.CreateElement('p', 'transition', $presentationNamespace)
                    Set-XmlPrefix $fallbackTransition 'p' $presentationNamespace
                    $fallbackTransition.SetAttribute('spd', 'slow')
                    $fade = $slideDocument.CreateElement('p', 'fade', $presentationNamespace)
                    [void]$fallbackTransition.AppendChild($fade)
                    [void]$fallback.AppendChild($fallbackTransition)
                    [void]$alternate.AppendChild($fallback)

                    $anchor = $slide.SelectSingleNode('./p:clrMapOvr', $namespaces)
                    if (-not $anchor) {
                        $anchor = $slide.SelectSingleNode('./p:cSld', $namespaces)
                    }
                    if (-not $anchor) {
                        throw "Could not find the slide content anchor in $($sourceEntry.FullName)."
                    }
                    [void]$slide.InsertAfter($alternate, $anchor)

                    $slideBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($slideDocument.OuterXml)
                    $destinationEntryStream.Write($slideBytes, 0, $slideBytes.Length)
                    $updatedCount++
                }
                else {
                    $sourceEntryStream.CopyTo($destinationEntryStream)
                }
            }
            else {
                $sourceEntryStream.CopyTo($destinationEntryStream)
            }
        }
        finally {
            $sourceEntryStream.Dispose()
            $destinationEntryStream.Dispose()
        }
    }

    if ($slideCount -lt 2) {
        throw 'The PowerPoint file must contain at least two slides.'
    }
    if ($updatedCount -ne ($slideCount - 1)) {
        throw "Morph was added to $updatedCount of $($slideCount - 1) expected slides."
    }

    $destinationArchive.Dispose()
    $destinationArchive = $null
    $destinationStream.Dispose()
    $destinationStream = $null
    [System.IO.File]::Move($temporaryPath, $destinationPath)
    $temporaryPath = $null
    Write-Output "Added Morph transitions to slides 2–${slideCount}: $destinationPath"
    Write-Output 'For the smoothest result, export the slides as editable PowerPoint objects; flattened slides only transition as images.'
}
finally {
    if ($destinationArchive) { $destinationArchive.Dispose() }
    if ($destinationStream) { $destinationStream.Dispose() }
    if ($sourceArchive) { $sourceArchive.Dispose() }
    if ($temporaryPath -and [System.IO.File]::Exists($temporaryPath)) {
        [System.IO.File]::Delete($temporaryPath)
    }
}
