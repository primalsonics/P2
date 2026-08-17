<?php
/**
 * contact.php — handles the portfolio contact form.
 *
 * This file only runs on a host that executes PHP (it will NOT run on
 * GitHub Pages — see README.md for hosting options). It:
 *   1. Validates and sanitises the incoming JSON payload
 *   2. Tries to email the submission via PHP's mail()
 *   3. Always logs a backup copy to php/submissions.log, in case mail()
 *      isn't configured on your host (very common on shared hosting)
 */

header("Content-Type: application/json");

// ----- Basic config — edit these for your own deployment -----
$ownerEmail = "hello@example.com";      // <-- replace with your real email
$siteName   = "Daniel Murimi Njiraini Portfolio";

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

// Read JSON body
$rawInput = file_get_contents("php://input");
$payload  = json_decode($rawInput, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request format."]);
    exit;
}

// ----- Sanitise + validate -----
function clean($value) {
    return trim(htmlspecialchars(strip_tags($value ?? ""), ENT_QUOTES, "UTF-8"));
}

$name    = clean($payload["name"] ?? "");
$email   = clean($payload["email"] ?? "");
$subject = clean($payload["subject"] ?? "");
$message = clean($payload["message"] ?? "");

$errors = [];
if ($name === "")    $errors[] = "Name is required.";
if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "A valid email is required.";
if ($subject === "") $errors[] = "Subject is required.";
if ($message === "") $errors[] = "Message is required.";

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => implode(" ", $errors)]);
    exit;
}

// ----- Always log a backup copy first (so nothing is ever lost) -----
$logLine = sprintf(
    "[%s] %s <%s> — %s — %s\n",
    date("Y-m-d H:i:s"),
    $name,
    $email,
    $subject,
    str_replace(["\r", "\n"], " ", $message)
);
@file_put_contents(__DIR__ . "/submissions.log", $logLine, FILE_APPEND | LOCK_EX);

// ----- Attempt to send an email notification -----
$mailSubject = "[$siteName] $subject";
$mailBody = "New message from your portfolio site:\n\n" .
            "Name: $name\n" .
            "Email: $email\n\n" .
            "Message:\n$message\n";

$headers = "From: \"$siteName\" <no-reply@" . ($_SERVER["HTTP_HOST"] ?? "localhost") . ">\r\n" .
           "Reply-To: $email\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = @mail($ownerEmail, $mailSubject, $mailBody, $headers);

// Even if mail() fails (common on hosts without a configured mail server),
// the submission is already safely logged above, so we still report success
// to the user — the message has been captured, not lost.
echo json_encode([
    "success" => true,
    "mailed"  => $mailSent,
    "message" => "Message received — thank you.",
]);
