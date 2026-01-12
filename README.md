# PomoWall - Pomodoro Timer with Site Blocking

A Chrome extension that helps you stay focused during Pomodoro sessions by blocking distracting websites with an automatic timer and visual progress indicator.

## ✨ Features

- **Pomodoro Timer**: Classic Pomodoro Technique with 3 sessions
  - 25-minute Focus sessions
  - 5-minute Short breaks
  - 15-minute Long breaks
- **Website Blocking**: Automatically blocks selected websites during focus sessions
- **Persistent State**: Timer state is maintained even when the popup is closed
- **Easy Management**: Simple interface to add and remove blocked sites
- **Material Design**: Clean, modern UI with Google Material Icons

## 🚀 Installation

1. Clone this repository: 
   ```bash
   git clone https://github.com/johhhnnnnyyyyy/PomoWall---Pomodoro-Timer-with-Site-Blocking.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the cloned repository folder
5. The PomoWall extension should now appear in your Chrome toolbar! 

## 📖 Usage

### Starting a Pomodoro Session

1. Click on the PomoWall extension icon in your Chrome toolbar
2. Select your desired session type:
   - **Focus** (25 minutes) - For concentrated work
   - **Short Break** (5 minutes) - Quick rest between sessions
   - **Long Break** (15 minutes) - Extended break after multiple sessions
3. Click the play/pause button to start the timer
4. During focus sessions, your blocked sites will be inaccessible

### Managing Blocked Sites

1. Click the settings icon (gear) in the extension popup
2. Enter the website you want to block in the input field (e.g., `youtube.com`, `facebook.com`)
3. Press Enter to add the site to your blocked list
4. Click the delete icon next to any site to remove it from the blocked list

### Navigation

- Use the **left/right arrows** to switch between session types (when timer is not running)
- Use the **settings icon** to access the blocked sites management page
- Use the **reset icon** to restart the current session
- Use the **back arrow** to return from settings to the timer view

## 🛠️ Technical Details

- **Manifest V3** - Latest Chrome extension format
- **JavaScript** - Core functionality
- **HTML/CSS** - User interface
- **Chrome APIs**: 
  - `storage` - Persistent data storage
  - `alarms` - Background timer management
  - `notifications` - Session completion alerts
  - `declarativeNetRequest` - Website blocking functionality

## 🖼️ Screenshots

<img width="396" height="647" alt="focus" src="https://github.com/user-attachments/assets/30fbd7b0-4733-41ad-b37e-900d515b2707" />
<img width="398" height="648" alt="shortBreak" src="https://github.com/user-attachments/assets/55045187-d964-466d-aac0-ef885c6c32c8" />
<img width="395" height="641" alt="longBreak" src="https://github.com/user-attachments/assets/5ac643df-b9ed-4de4-b741-7926ab488caf" />
<img width="398" height="648" alt="shortBreak" src="https://github.com/user-attachments/assets/e99d5e7b-25ec-441b-9d73-7747a46a94c0" />

## 🔧 Permissions Explained

- **storage**: Save your blocked sites list and timer preferences
- **alarms**: Run the timer in the background
- **notifications**: Alert you when sessions complete
- **declarativeNetRequest**:  Block specified websites during focus sessions
- **host_permissions**: Required to block websites across all domains

*Built with ❤️ to help you beat procrastination and boost productivity* :)
