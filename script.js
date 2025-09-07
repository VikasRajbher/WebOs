const desktop = document.getElementById('desktop');
const template = document.getElementById('window-template');
const contextMenu = document.getElementById('context-menu');
let zIndex = 1;

let folderCount = 0;
const maxFolders = 9;
const folders = [];

const folderIcon = "https://cdn-icons-png.flaticon.com/512/715/715676.png";
const explorerIcon = "https://cdn-icons-png.flaticon.com/512/715/715686.png";

/* ================= Folder Functions ================= */
function createFolder(name = "", isExplorer = false) {
  if(folderCount >= maxFolders) {
    alert("Maximum 9 folders allowed");
    return;
  }

  if(!name) {
    name = prompt("Enter folder name:") || "New Folder";
  }

  const icon = document.createElement('div');
  icon.className = 'icon';

  const img = document.createElement('img');
  img.src = isExplorer ? explorerIcon : folderIcon;
  icon.appendChild(img);

  const span = document.createElement('span');
  span.innerText = name;
  icon.appendChild(span);

  icon.style.top = Math.random() * 300 + 'px';
  icon.style.left = Math.random() * 500 + 'px';
  desktop.appendChild(icon);

  icon.addEventListener('mousedown', dragIcon);

  // Double-click opens dummy window
  icon.addEventListener('dblclick', () => openWindow(icon));

  // Right-click delete (except Explorer)
  if(!isExplorer){
    icon.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if(confirm(`Delete folder "${span.innerText}"?`)){
        desktop.removeChild(icon);
        folderCount--;
      }
    });
  }

  folders.push(icon);
  folderCount++;
}

/* ================= Drag Function ================= */
function dragIcon(e){
  const icon = e.currentTarget;
  const shiftX = e.clientX - icon.getBoundingClientRect().left;
  const shiftY = e.clientY - icon.getBoundingClientRect().top;

  function moveAt(pageX, pageY){
    icon.style.left = pageX - shiftX + 'px';
    icon.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(e){
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.onmouseup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
  };
  icon.ondragstart = () => false;
}

/* ================= Open Dummy Window ================= */
function openWindow(icon){
  const win = template.cloneNode(true);
  win.classList.remove('hidden');
  win.style.zIndex = ++zIndex;
  win.querySelector('.window-title').innerText = icon.querySelector('span').innerText;
  win.querySelector('.window-content').innerText = `This is a dummy window for "${icon.querySelector('span').innerText}"`;

  win.querySelector('.close-btn').addEventListener('click', () => {
    desktop.removeChild(win);
  });

  const header = win.querySelector('.window-header');
  header.onmousedown = (e) => {
    const shiftX = e.clientX - win.getBoundingClientRect().left;
    const shiftY = e.clientY - win.getBoundingClientRect().top;

    function moveAt(pageX, pageY){
      win.style.left = pageX - shiftX + 'px';
      win.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e){
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };

  win.ondragstart = () => false;
  desktop.appendChild(win);
}

/* ================= Taskbar ================= */
const datetime = document.getElementById('datetime');
setInterval(() => {
  const now = new Date();
  datetime.innerText = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
}, 1000);

// Battery
const batteryEl = document.getElementById('battery');
if(navigator.getBattery){
  navigator.getBattery().then(battery => {
    function updateBattery(){
      batteryEl.innerText = `Battery: ${Math.round(battery.level*100)}%`;
    }
    updateBattery();
    battery.addEventListener('levelchange', updateBattery);
  });
}

/* ================= Desktop Right-Click Menu ================= */
desktop.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.style.left = e.pageX + 'px';
  contextMenu.style.top = e.pageY + 'px';
  contextMenu.classList.remove('hidden');
});

document.addEventListener('click', () => {
  contextMenu.classList.add('hidden');
});

// Menu actions
document.getElementById('new-folder').addEventListener('click', () => createFolder());
document.getElementById('change-wallpaper').addEventListener('click', () => {
  const url = prompt("Enter wallpaper URL:");
  if(url) desktop.style.backgroundImage = `url('${url}')`;
});
document.getElementById('refresh').addEventListener('click', () => {
  folders.forEach(f => {
    f.style.top = Math.random() * 300 + 'px';
    f.style.left = Math.random() * 500 + 'px';
  });
});

/* ================= Initialize Folders ================= */
createFolder("Explorer", true);
['Documents','Pictures','Music','Videos','Downloads'].forEach(f => createFolder(f));
