<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Connect - Authentication</title>
    <style>
        body {
            background-color: #0d0f18;
            color: #00f0ff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            box-sizing: border-box;
        }
        .auth-container {
            width: 100%;
            max-width: 400px;
            background: #121526;
            border: 2px solid #ff2a85;
            box-shadow: 0 0 15px rgba(255, 42, 133, 0.4);
            border-radius: 12px;
            padding: 25px;
            box-sizing: border-box;
        }
        h2 {
            text-align: center;
            color: #ff2a85;
            margin-bottom: 20px;
            text-shadow: 0 0 8px rgba(255, 42, 133, 0.6);
        }
        .tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            border-bottom: 1px solid #00f0ff;
            padding-bottom: 10px;
        }
        .tabs button {
            background: none;
            border: none;
            color: #8a8d9f;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
        .tabs button.active {
            color: #ff2a85;
            text-shadow: 0 0 5px rgba(255, 42, 133, 0.8);
            border-bottom: 2px solid #ff2a85;
            padding-bottom: 4px;
        }
        .form-group {
            display: none;
        }
        .form-group.active {
            display: block;
        }
        input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            background: #1a1e33;
            border: 1px solid #00f0ff;
            color: #fff;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        }
        input:focus {
            outline: none;
            border-color: #ff2a85;
            box-shadow: 0 0 8px rgba(255, 42, 133, 0.5);
        }
        .btn-submit {
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            background: linear-gradient(45deg, #ff2a85, #7928ca);
            border: none;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(255, 42, 133, 0.5);
        }
        .btn-submit:active {
            transform: scale(0.98);
        }
        .error-msg {
            color: #ff4d4d;
            font-size: 13px;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <div class="auth-container">
        <h2>TASK CONNECT</h2>
        
        <div class="tabs">
            <button id="tab-signup-btn" class="active" onclick="switchAuthTab('signup')">Sign Up</button>
            <button id="tab-login-btn" onclick="switchAuthTab('login')">Login</button>
        </div>

        <!-- SIGN UP FORM -->
        <div id="form-signup" class="form-group active">
            <input type="text" id="su-name" placeholder="Full Name" required>
            <input type="email" id="su-email" placeholder="Email Address" required>
            <input type="password" id="su-password" placeholder="Password" required>
            <button class="btn-submit" onclick="handleRegister()">Create Account</button>
        </div>

        <!-- LOGIN FORM -->
        <div id="form-login" class="form-group">
            <input type="email" id="li-email" placeholder="Email Address" required>
            <input type="password" id="li-password" placeholder="Password" required>
            <button class="btn-submit" onclick="handleLogin()">Login to App</button>
        </div>

        <div id="auth-error" class="error-msg"></div>
    </div>

    <script>
        function switchAuthTab(tab) {
            document.getElementById('auth-error').innerText = '';
            if(tab === 'signup') {
                document.getElementById('form-signup').classList.add('active');
                document.getElementById('form-login').classList.remove('active');
                document.getElementById('tab-signup-btn').classList.add('active');
                document.getElementById('tab-login-btn').classList.remove('active');
            } else {
                document.getElementById('form-login').classList.add('active');
                document.getElementById('form-signup').classList.remove('active');
                document.getElementById('tab-login-btn').classList.add('active');
                document.getElementById('tab-signup-btn').classList.remove('active');
            }
        }

        // Simple unique device ID generator for fraud prevention
        function getDeviceId() {
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) {
                deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
                localStorage.setItem('device_id', deviceId);
            }
            return deviceId;
        }

        async function handleRegister() {
            const name = document.getElementById('su-name').value;
            const email = document.getElementById('su-email').value;
            const password = document.getElementById('su-password').value;
            const deviceId = getDeviceId();

            if(!name || !email || !password) {
                document.getElementById('auth-error').innerText = 'Please fill all fields!';
                return;
            }

            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, deviceId })
                });
                const data = await res.json();
                if(res.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Account created successfully!');
                    window.location.href = 'dashboard.html'; // Aage main app par jayega
                } else {
                    document.getElementById('auth-error').innerText = data.error || 'Registration failed';
                }
            } catch(e) {
                document.getElementById('auth-error').innerText = 'Network error occurred';
            }
        }

        async function handleLogin() {
            const email = document.getElementById('li-email').value;
            const password = document.getElementById('li-password').value;

            if(!email || !password) {
                document.getElementById('auth-error').innerText = 'Please enter email and password!';
                return;
            }

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if(res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html'; // Login ke baad main app par jayega
                } else {
                    document.getElementById('auth-error').innerText = data.error || 'Login failed';
                }
            } catch(e) {
                document.getElementById('auth-error').innerText = 'Network error occurred';
            }
        }
    </script>
</body>
</html>
