// Create the HTML structure with JavaScript
document.open();
document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dynamic Site</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        text-align: center;
        margin-top: 20px;
    }
    h1 {
        color: #4CAF50;
    }
    button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
    </style>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p id="greeting">Hello, world!</p>
    <button id="myButton">Click Me</button>

    <script>
    document.getElementById("myButton").addEventListener("click", function() {
        document.getElementById("greeting").textContent = "You clicked the button!";
    });
    </script>
</body>
</html>
`);
document.close();
