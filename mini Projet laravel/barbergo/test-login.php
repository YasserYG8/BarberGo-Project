<?php
$data = ['email' => 'jane.client@example.com', 'password' => 'password'];
$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/api/auth/login', false, $context);
echo "Response: " . $result . "\n";
echo "Headers: " . print_r($http_response_header, true) . "\n";
