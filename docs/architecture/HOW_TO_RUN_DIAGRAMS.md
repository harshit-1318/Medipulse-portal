# 🚀 MediPulse Architecture — How to Run & View Diagrams

यह गाइड आपको सभी 7 आर्किटेक्चर फ़्लोज़ और इंटरएक्टिव डायग्राम्स को अपने सिस्टम पर चलाने, ब्राउज़र में खोलने और लोकल सर्वर पर होस्ट करने के सभी कमांड्स प्रदान करता है।

---

## ⚡ 1. त्वरित कमांड (PowerShell One-Liners)

अपने टर्मिनल (PowerShell / Command Prompt) में प्रोजेक्ट रूट `D:\New projects\1 MediPulse` से सीधे रन करें:

### 🌟 सभी डायग्राम्स एक साथ खोलने के लिए (Open All 7 Diagrams at Once)
```powershell
Get-ChildItem -Recurse -Filter "*architecture.html" docs/architecture | ForEach-Object { Start-Process $_.FullName }
```

---

### 📌 अलग-अलग फ़्लो खोलने के कमांड्स (Individual Flow Commands)

| फ़्लो | कमांड (PowerShell) | विवरण |
| :--- | :--- | :--- |
| **00. Global Overview** | `Start-Process "docs\architecture\medipulse-architecture.html"` | पूरा हाई-लेवल आर्किटेक्चर मॉडल |
| **01. Login & Auth Flow** | `Start-Process "docs\architecture\01-login-flow\login-architecture.html"` | HMAC-SHA256, Cookies & Edge Proxy |
| **02. Multi-Site Routing** | `Start-Process "docs\architecture\02-multi-site-flow\multi-site-architecture.html"` | Multi-Tenant Header Interceptor Flow |
| **03. SurveyJS Intake** | `Start-Process "docs\architecture\03-survey-flow\survey-architecture.html"` | SurveyJS Creator, Runner & Lead Conversion |
| **04. Orders Lifecycle** | `Start-Process "docs\architecture\04-orders-flow\orders-architecture.html"` | TanStack Table, Order Params & Transition |
| **05. Dual-Endpoint Customer** | `Start-Process "docs\architecture\05-customer-flow\customer-architecture.html"` | Dual-Endpoint Routing & BIGINT ID Fix |
| **06. Docman Jobs** | `Start-Process "docs\architecture\06-docman-flow\docman-architecture.html"` | Asynchronous Document Processing Pipeline |
| **07. Real-Time Activity Log** | `Start-Process "docs\architecture\07-activity-log-flow\activity-log-architecture.html"` | Non-blocking Audit Logging & Deduplication |

---

## 🌐 2. लोकल वेब सर्वर पर रन करने के कमांड्स (Serve via HTTP Server)

यदि आप सभी फ़ाइलों को लोकल पोर्ट (उदा. `http://localhost:3333`) पर ब्राउज़ करना चाहते हैं:

### विकल्प A: Node.js / npx serve (सर्वश्रेष्ठ एवं आसान)
```bash
npx serve docs/architecture -p 3333
```
ब्राउज़र में खोलें: 👉 `http://localhost:3333`

### विकल्प B: Node.js / npx http-server
```bash
npx http-server docs/architecture -p 3333 -o
```

### विकल्प C: Python 3 (बिना npm के)
```bash
python -m http.server 3333 -d docs/architecture
```

---

## 🖱️ 3. Windows File Explorer से डबल-क्लिक करके खोलना (No-Code GUI)

1. अपने कीबोर्ड पर `Win + E` दबाएं और इस पाथ पर जाएं:
   ```
   D:\New projects\1 MediPulse\docs\architecture
   ```
2. किसी भी फ़ोल्डर में जाएं (उदा. `01-login-flow`, `04-orders-flow`).
3. उस फ़ोल्डर की `.html` फ़ाइल पर **Double Click** करें। यह सीधे आपके डिफ़ॉल्ट ब्राउज़र (Chrome / Edge / Firefox) में खुल जाएगी!

---

## 🔄 4. Git कमांड्स (Sync & Push to Remote)

अपने आर्किटेक्चर डॉक्युमेंट्स को Git पर मैनेज करने के कमांड्स:

### वर्तमान स्थिति चेक करने के लिए
```bash
git status
```

### रिमोट GitHub रिपॉजिटरी पर पुश करने के लिए
```bash
git push origin main
```

### हाल के कमिट्स देखने के लिए
```bash
git log -1 --stat
```

---

## 🧪 5. संबंधित प्रोजेक्ट कमांड्स (Testing & Dev Server)

| कमांड | कार्य |
| :--- | :--- |
| `npm run dev` | MediPulse Next.js 16 डेवलपमेंट सर्वर चलाएं (`http://localhost:3000`) |
| `npm test` | Vitest के सभी 159 टेस्ट सुइट्स रन करें (870 पास टेस्ट) |
| `npm run lint` | TypeScript टाइप चेकिंग चलाएं |
