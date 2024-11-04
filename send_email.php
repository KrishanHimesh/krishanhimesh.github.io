<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "krishanhimesh@gmail.com";
    $subject = "Contact Form Submission from " . $name;
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('Your message has been sent successfully!'); window.location.href = 'contact.html';</script>";
    } else {
        echo "<script>alert('Failed to send your message. Please try again later.'); window.location.href = 'contact.html';</script>";
    }
} else {
    echo "<script>alert('Invalid request.'); window.location.href = 'contact.html';</script>";
}
?>
