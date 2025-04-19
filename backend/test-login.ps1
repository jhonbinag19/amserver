# Test Login Endpoint
$body = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Testing login endpoint..."
Write-Host "Sending request to: http://localhost:3001/api/auth/login"
Write-Host "With body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -ContentType "application/json" -Body $body
    Write-Host "Login successful!"
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body:"
        Write-Host $responseBody
    }
} 