import React from 'react';

const Settings = ({ settings, updateSettings }) => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <div>
        <label>Enable Timer:</label>
        <input
          type="checkbox"
          checked={settings.enableTimer}
          onChange={(e) => updateSettings({ ...settings, enableTimer: e.target.checked })}
        />
      </div>
      <div>
        <label>Difficulty:</label>
        <select
          value={settings.difficulty}
          onChange={(e) => updateSettings({ ...settings, difficulty: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
