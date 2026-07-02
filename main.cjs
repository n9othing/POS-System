const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// دروستکردنی داتابەیسەکە بە ناوی aram_shop.db لەناو لاپتۆپەکەت
const db = new sqlite3.Database('aram_shop.db', (err) => {
  if (err) {
    console.error('کێشە هەیە لە کردنەوەی داتابەیسەکە: ', err);
  }
});

// دروستکردنی خشتەی فرۆشتنەکان
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      totalRevenue INTEGER,
      totalOrders INTEGER,
      date TEXT
    )
  `);
});

function createWindow () {
  // دروستکردنی پەنجەرەی بەرنامەکە
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // خوێندنەوەی ڕیاکتەکەت
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ئەمە ئەو بەشە نوێیەیە کە داتای ڕۆژەکە لە ڕیاکتەوە وەردەگرێت و دەیخاتە ناو داتابەیسەکەوە
ipcMain.on('save-end-of-day', (event, data) => {
  const today = new Date().toISOString().split('T')[0]; // بەرواری ئەمڕۆ دروست دەکات
  const { totalRevenue, totalOrders } = data;

  // خستنە ناو خشتەی sales لە داتابەیسەکەی SQLite
  db.run(
    `INSERT INTO sales (totalRevenue, totalOrders, date) VALUES (?, ?, ?)`,
    [totalRevenue, totalOrders, today],
    function(err) {
      if (err) {
        console.error('کێشە لە خەزنکردن:', err);
        // ناردنەوەی وەڵام بۆ ڕیاکت کە کێشە هەیە
        event.reply('save-end-of-day-reply', { success: false, error: err.message });
      } else {
        console.log(`خەزنکرا: داهات ${totalRevenue}, وەسڵەکان ${totalOrders}, بەروار ${today}`);
        // ناردنەوەی وەڵام بۆ ڕیاکت کە بە سەرکەوتوویی خەزن بوو
        event.reply('save-end-of-day-reply', { success: true });
      }
    }
  );
});