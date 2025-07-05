// مفاتيح التخزين
const LS_USERS = "vetlab_users";
const LS_SETTINGS = "vetlab_settings";
const LS_ENTRIES = "vetlab_entries";

// استدعاء العناصر
const welcomeScreen = document.getElementById("welcomeScreen");
const loginScreen = document.getElementById("loginScreen");
const mainContainer = document.getElementById("mainContainer");

const startBtn = document.getElementById("startBtn");
const loginBtn = document.getElementById("loginBtn");

const loginUserInput = document.getElementById("loginUser");
const loginPassInput = document.getElementById("loginPass");
const errorMsg = document.getElementById("errorMsg");

const currentUserNameSpan = document.getElementById("currentUserName");

const btnLogout = document.getElementById("btnLogout");

const btnInput = document.getElementById("btnInput");
const btnViewEntries = document.getElementById("btnViewEntries");
const btnClients = document.getElementById("btnClients");
const btnUsers = document.getElementById("btnUsers");
const btnSettings = document.getElementById("btnSettings");

const sectionInput = document.getElementById("sectionInput");
const sectionView = document.getElementById("sectionView");
const sectionClients = document.getElementById("sectionClients");
const sectionUsers = document.getElementById("sectionUsers");
const sectionSettings = document.getElementById("sectionSettings");

const tableEntriesBody = document.getElementById("tableEntriesBody");
const tableClientsBody = document.getElementById("tableClientsBody");
const tableUsersBody = document.getElementById("tableUsersBody");

const inputDate = document.getElementById("inputDate");
const inputLocation = document.getElementById("inputLocation");
const inputAnimalType = document.getElementById("inputAnimalType");
const inputSampleType = document.getElementById("inputSampleType");
const inputTestType = document.getElementById("inputTestType");
const inputResult = document.getElementById("inputResult");
const inputInspector = document.getElementById("inputInspector");
const inputClientName = document.getElementById("inputClientName");
const inputClientPhone = document.getElementById("inputClientPhone");
const inputClientAddress = document.getElementById("inputClientAddress");
const inputMessage = document.getElementById("inputMessage");

const userModal = document.getElementById("userModal");
const closeUserModal = document.getElementById("closeUserModal");
const userForm = document.getElementById("userForm");
const userModalTitle = document.getElementById("userModalTitle");
const userUsernameInput = document.getElementById("userUsername");
const userFullNameInput = document.getElementById("userFullName");
const userPasswordInput = document.getElementById("userPassword");
const userRoleSelect = document.getElementById("userRole");

let currentUser = null;

let users = JSON.parse(localStorage.getItem(LS_USERS)) || [];
let settings = JSON.parse(localStorage.getItem(LS_SETTINGS)) || {
  locations: ["مسلخ غياثي", "سوق الظفرة", "مسلخ ليوا"],
  animalTypes: ["غنم", "بقر", "جمال"],
  sampleTypes: ["دم", "براز", "بول"],
  testTypes: ["PCR", "ELISA", "مزرعة"],
  results: ["سلبية", "إيجابية"],
  primaryColor: "#27ae60",
  logoURL: "default-logo.png"
};
let entries = JSON.parse(localStorage.getItem(LS_ENTRIES)) || [];

let editingUserIndex = -1;

function saveUsers() {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function saveSettings() {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
}

function saveEntries() {
  localStorage.setItem(LS_ENTRIES, JSON.stringify(entries));
}

function showSection(section) {
  [sectionInput, sectionView, sectionClients, sectionUsers, sectionSettings].forEach(s => s.style.display = "none");
  section.style.display = "block";
}

function displayError(msg) {
  errorMsg.textContent = msg;
}

function clearError() {
  errorMsg.textContent = "";
}

function toggleAdminButtons(show) {
  document.querySelectorAll(".admin-only").forEach(btn => {
    btn.style.display = show ? "inline-block" : "none";
  });
}

function updateUIColors() {
  document.documentElement.style.setProperty("--primary-color", settings.primaryColor);
  document.querySelector("header").style.backgroundColor = settings.primaryColor;
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.style.borderColor = settings.primaryColor;
  });
  document.querySelectorAll(".btn").forEach(btn => {
    btn.style.backgroundColor = settings.primaryColor;
  });
  const logoImg = document.getElementById("logoImg");
  if (logoImg) logoImg.src = settings.logoURL;
}

function fillSelect(selectElem, options) {
  selectElem.innerHTML = "";
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    selectElem.appendChild(option);
  });
}

function fillAllSelects() {
  fillSelect(inputLocation, settings.locations);
  fillSelect(inputAnimalType, settings.animalTypes);
  fillSelect(inputSampleType, settings.sampleTypes);
  fillSelect(inputTestType, settings.testTypes);
  fillSelect(inputResult, settings.results);
}

function fillSettingsInputs() {
  document.getElementById("locationOptions").value = settings.locations.join(", ");
  document.getElementById("animalTypeOptions").value = settings.animalTypes.join(", ");
  document.getElementById("sampleTypeOptions").value = settings.sampleTypes.join(", ");
  document.getElementById("testTypeOptions").value = settings.testTypes.join(", ");
  document.getElementById("resultOptions").value = settings.results.join(", ");
  document.getElementById("primaryColorPicker").value = settings.primaryColor;
  document.getElementById("logoURLInput").value = settings.logoURL;
}

function loadUsersTable() {
  tableUsersBody.innerHTML = "";
  users.forEach((user, i) => {
    const tr = document.createElement("tr");

    const tdUsername = document.createElement("td");
    tdUsername.textContent = user.username;
    tr.appendChild(tdUsername);

    const tdFullName = document.createElement("td");
    tdFullName.textContent = user.fullName;
    tr.appendChild(tdFullName);

    const tdRole = document.createElement("td");
    tdRole.textContent = user.role === "admin" ? "مسؤول" : "مستخدم";
    tr.appendChild(tdRole);

    const tdActions = document.createElement("td");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "تعديل";
    btnEdit.className = "btn";
    btnEdit.style.marginLeft = "5px";
    btnEdit.addEventListener("click", () => openEditUserModal(i));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "حذف";
    btnDelete.className = "btn";
    btnDelete.style.marginLeft = "5px";
    btnDelete.addEventListener("click", () => deleteUser(i));

    tdActions.appendChild(btnEdit);
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdActions);

    tableUsersBody.appendChild(tr);
  });
}

function openEditUserModal(index) {
  editingUserIndex = index;
  const user = users[index];
  userModalTitle.textContent = "تعديل مستخدم";
  userUsernameInput.value = user.username;
  userFullNameInput.value = user.fullName;
  userPasswordInput.value = "";
  userRoleSelect.value = user.role;
  userModal.style.display = "flex";
}

function deleteUser(index) {
  if (!confirm("هل تريد حذف المستخدم؟")) return;
  users.splice(index, 1);
  saveUsers();
  loadUsersTable();
  if (currentUser && users.length === 0) {
    // لا يوجد مستخدمون بعد الحذف، عد للترحيب
    logout(true);
  }
}

function openAddUserModal() {
  editingUserIndex = -1;
  userModalTitle.textContent = "إضافة مستخدم جديد";
  userUsernameInput.value = "";
  userFullNameInput.value = "";
  userPasswordInput.value = "";
  userRoleSelect.value = "user";
  userModal.style.display = "flex";
}

function validateUserForm() {
  if (!userUsernameInput.value.trim()) {
    alert("يرجى إدخال اسم المستخدم");
    return false;
  }
  if (!userFullNameInput.value.trim()) {
    alert("يرجى إدخال الاسم الكامل");
    return false;
  }
  if (editingUserIndex === -1 && !userPasswordInput.value) {
    alert("يرجى إدخال كلمة المرور");
    return false;
  }
  return true;
}

function saveUserForm() {
  if (!validateUserForm()) return;

  const username = userUsernameInput.value.trim();
  const fullName = userFullNameInput.value.trim();
  const password = userPasswordInput.value;
  const role = userRoleSelect.value;

  if (editingUserIndex === -1) {
    // إضافة جديد
    if (users.some(u => u.username === username)) {
      alert("اسم المستخدم موجود مسبقاً.");
      return;
    }
    users.push({ username, fullName, password, role });
  } else {
    // تعديل
    const user = users[editingUserIndex];
    if (user.username !== username && users.some(u => u.username === username)) {
      alert("اسم المستخدم موجود مسبقاً.");
      return;
    }
    user.username = username;
    user.fullName = fullName;
    if (password) user.password = password;
    user.role = role;
  }
  saveUsers();
  loadUsersTable();
  userModal.style.display = "none";

  if (users.length === 1) {
    // بعد إضافة أول مستخدم، نعود لشاشة الدخول
    logout(true);
  }
}

function logout(hideLoginScreen = false) {
  currentUser = null;
  currentUserNameSpan.textContent = "المستخدم";
  mainContainer.style.display = "none";
  // إذا هناك مستخدمون موجودون نعرض شاشة تسجيل الدخول
  if (users.length > 0 && !hideLoginScreen) {
    loginScreen.classList.add("active-screen");
    welcomeScreen.classList.remove("active-screen");
  } else {
    // لا يوجد مستخدمون، العودة لشاشة الترحيب
    welcomeScreen.classList.add("active-screen");
    loginScreen.classList.remove("active-screen");
  }
  clearError();
  // إخفاء الأقسام الرئيسية
  showSection(null);
}

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    displayError("اسم المستخدم أو كلمة المرور غير صحيحة");
    return false;
  }
  currentUser = user;
  return true;
}

function showMainScreen() {
  welcomeScreen.classList.remove("active-screen");
  loginScreen.classList.remove("active-screen");
  mainContainer.style.display = "flex";
  currentUserNameSpan.textContent = currentUser.fullName;

  toggleAdminButtons(currentUser.role === "admin");
  showSection(sectionInput);
  fillAllSelects();
  fillSettingsInputs();
}

function addEntry(entry) {
  entries.push(entry);
  saveEntries();
}

function renderEntriesTable() {
  tableEntriesBody.innerHTML = "";
  entries.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.location}</td>
      <td>${e.animalType}</td>
      <td>${e.sampleType}</td>
      <td>${e.testType}</td>
      <td style="color:${e.result === "إيجابية" ? "red" : "green"}">${e.result}</td>
      <td>${e.date}</td>
      <td>${e.inspector}</td>
      <td>${e.clientName}</td>
      <td>${e.clientPhone}</td>
      <td>${e.clientAddress}</td>
    `;
    tableEntriesBody.appendChild(tr);
  });
}

function renderClientsTable() {
  tableClientsBody.innerHTML = "";
  const clientsMap = {};
  entries.forEach(e => {
    if (!clientsMap[e.clientPhone]) {
      clientsMap[e.clientPhone] = { name: e.clientName, phone: e.clientPhone, address: e.clientAddress };
    }
  });
  Object.values(clientsMap).forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.address}</td>
    `;
    tableClientsBody.appendChild(tr);
  });
}

function initDefaultUserIfNeeded() {
  if (users.length === 0) {
    // لا يوجد مستخدمين، ندخل تلقائياً كمسؤول افتراضي (بدون كلمة مرور)
    currentUser = {
      username: "admin",
      fullName: "المسؤول الافتراضي",
      role: "admin"
    };
    showMainScreen();
    welcomeScreen.classList.remove("active-screen");
  }
}

startBtn.addEventListener("click", () => {
  if (users.length === 0) {
    // الدخول مباشرة بدون تسجيل (المسؤول الافتراضي)
    initDefaultUserIfNeeded();
  } else {
    // عرض شاشة تسجيل الدخول
    welcomeScreen.classList.remove("active-screen");
    loginScreen.classList.add("active-screen");
  }
});

loginBtn.addEventListener("click", () => {
  clearError();
  const username = loginUserInput.value.trim();
  const password = loginPassInput.value;

  if (!username || !password) {
    displayError("يرجى إدخال اسم المستخدم وكلمة المرور");
    return;
  }

  if (login(username, password)) {
    showMainScreen();
  }
});

btnLogout.addEventListener("click", () => {
  logout();
  loginUserInput.value = "";
  loginPassInput.value = "";
});

// أزرار التنقل
btnInput.addEventListener("click", () => {
  showSection(sectionInput);
  fillAllSelects();
  inputMessage.textContent = "";
});
btnViewEntries.addEventListener("click", () => {
  showSection(sectionView);
  renderEntriesTable();
});
btnClients.addEventListener("click", () => {
  showSection(sectionClients);
  renderClientsTable();
});
btnUsers.addEventListener("click", () => {
  showSection(sectionUsers);
  loadUsersTable();
});
btnSettings.addEventListener("click", () => {
  showSection(sectionSettings);
  fillSettingsInputs();
});

// حفظ الإعدادات
document.getElementById("saveSettings").addEventListener("click", () => {
  settings.locations = document.getElementById("locationOptions").value.split(",").map(s => s.trim()).filter(Boolean);
  settings.animalTypes = document.getElementById("animalTypeOptions").value.split(",").map(s => s.trim()).filter(Boolean);
  settings.sampleTypes = document.getElementById("sampleTypeOptions").value.split(",").map(s => s.trim()).filter(Boolean);
  settings.testTypes = document.getElementById("testTypeOptions").value.split(",").map(s => s.trim()).filter(Boolean);
  settings.results = document.getElementById("resultOptions").value.split(",").map(s => s.trim()).filter(Boolean);
  settings.primaryColor = document.getElementById("primaryColorPicker").value;
  settings.logoURL = document.getElementById("logoURLInput").value.trim() || "default-logo.png";
  saveSettings();
  updateUIColors();
  fillAllSelects();
  alert("تم حفظ الإعدادات");
});

// حفظ إدخال بيانات الفحص
document.getElementById("formInput").addEventListener("submit", e => {
  e.preventDefault();

  const entry = {
    date: inputDate.value,
    location: inputLocation.value,
    animalType: inputAnimalType.value,
    sampleType: inputSampleType.value,
    testType: inputTestType.value,
    result: inputResult.value,
    inspector: inputInspector.value.trim(),
    clientName: inputClientName.value.trim(),
    clientPhone: inputClientPhone.value.trim(),
    clientAddress: inputClientAddress.value.trim()
  };

  addEntry(entry);

  inputMessage.textContent = "تم حفظ البيانات بنجاح";

  // لا نمسح التاريخ والموقع حسب طلبك:
  // لكن نمسح الحقول الأخرى:
  inputAnimalType.selectedIndex = 0;
  inputSampleType.selectedIndex = 0;
  inputTestType.selectedIndex = 0;
  inputResult.selectedIndex = 0;
  inputInspector.value = "";
  inputClientName.value = "";
  inputClientPhone.value = "";
  inputClientAddress.value = "";
});

// مودال المستخدم
document.getElementById("btnAddUser").addEventListener("click", openAddUserModal);
closeUserModal.addEventListener("click", () => { userModal.style.display = "none"; });

userForm.addEventListener("submit", e => {
  e.preventDefault();
  saveUserForm();
});

// إغلاق المودال بالنقر خارجه
window.addEventListener("click", e => {
  if (e.target === userModal) userModal.style.display = "none";
});

// تحديث الألوان عند تحميل الإعدادات
updateUIColors();

// تعيين التاريخ الافتراضي ليوم اليوم في شاشة الإدخال
function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  inputDate.value = today;
}
setDefaultDate();

// عند تحميل الصفحة
window.onload = () => {
  if (users.length === 0) {
    // لا يوجد مستخدم، الدخول مباشرة كمسؤول افتراضي
    initDefaultUserIfNeeded();
  } else {
    // عرض شاشة الترحيب أولاً
    welcomeScreen.classList.add("active-screen");
  }
};
