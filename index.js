<!-- TASKS SECTION -->
<div id="sec-tasks" class="section">
    <div class="cyber-card">
        <h4>All Available Tasks (Social, Gaming, Math & Spin)</h4>
        <p style="font-size: 12px; color: #8a8d9f;">Complete tasks from YouTube, TikTok, Instagram, Twitter, Telegram, Gaming, Math puzzles, and Spin Wheel!</p>
        <div id="tasks-container">Loading tasks...</div>
    </div>
</div>

<!-- ADMIN SECTION (Task Creation with Categories) -->
<div id="sec-admin" class="section">
    <div class="cyber-card" style="border-color: #ff2a85;">
        <h4 style="color: #ff2a85;">Admin Panel - Create Any Task</h4>
        <input type="text" id="new-task-title" placeholder="Task Title (e.g., Follow Twitter / Spin Wheel)">
        <select id="new-task-cat" style="width: 100%; padding: 10px; margin: 8px 0; background: #1a1e33; border: 1px solid #00f0ff; color: #fff; border-radius: 6px;">
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="Telegram">Telegram</option>
            <option value="Gaming">Gaming</option>
            <option value="Math">Math Task</option>
            <option value="Spin">Spin Wheel</option>
        </select>
        <input type="number" id="new-task-reward" placeholder="Reward Points">
        <input type="text" id="new-task-link" placeholder="Task Link URL (or #)">
        <button class="action-btn" onclick="adminCreateTask()" style="margin-top: 5px;">Create Task</button>
    </div>
</div>
