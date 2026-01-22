# ⚡ SecVolt: Autonomous Cyber-Defense Platform for Critical EV Infrastructure

![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-blueviolet.svg)
![Security](https://img.shields.io/badge/Security-Hybrid%20IDS-red.svg)
![Integrity](https://img.shields.io/badge/Integrity-Blockchain%20Backed-success.svg)
![Protocol](https://img.shields.io/badge/Protocol-OCPP%201.6%20Simulation-blue.svg)

> **"Güvenli Şarj, Güvenli Şebeke."**
> SecVolt, Elektrikli Araç (EV) şarj ekosistemini hedef alan siber-fiziksel saldırıları tespit etmek, izole etmek ve değişmez bir şekilde kayıt altına almak için tasarlanmış yeni nesil bir **Güvenlik Operasyon Merkezi (SOC)** simülasyonudur.

---

## 🌍 Proje Vizyonu ve Kapsam

Elektrikli araçların yaygınlaşmasıyla birlikte, Şarj İstasyonları (EVSE) ve Merkezi Yönetim Sistemleri (CSMS) arasındaki veri trafiği, **Smart Grid (Akıllı Şebeke)** güvenliğinin en zayıf halkası haline gelmiştir. Geleneksel güvenlik duvarları, protokol içine gizlenmiş manipülasyonları yakalamakta yetersiz kalmaktadır.

**SecVolt**, bu açığı kapatmak için geliştirilmiştir. Sistemimiz, **OCPP (Open Charge Point Protocol)** trafiğini analiz ederek, şebekeyi hem finansal kayıplara (Enerji Hırsızlığı) hem de fiziksel hasarlara (Yangın/Patlama riski) karşı korur.

---

## 🧠 Core Engine: Hibrit IDS Mimarisi

SecVolt, tek bir tespit yöntemine güvenmez. Saldırıları %99.9 doğrulukla yakalamak için **Çift Katmanlı Savunma (Dual-Layer Defense)** mimarisini kullanır:

### 1. Deterministik Katman (Rule-Based IDS)
Bilinen saldırı imzalarını ve fiziksel limit aşımlarını mikrosaniyeler içinde tespit eder.
* **Voltaj Dalgalanma Analizi:** Şebeke standartlarının (220V ±%10) dışına çıkan anomalileri yakalar.
* **Akım Sınırı Denetimi:** Kablo ve donanım kapasitesini aşan (örn: >64A) ani yüklenmeleri (DoS) anında bloke eder.

### 2. Davranışsal Katman (Simulated ML Engine)
Daha sinsi ve karmaşık saldırıları tespit eder.
* **Enerji Tüketim Korelasyonu:** "Şarj Ediyor" statüsünde olmasına rağmen akım çekmeyen veya çok düşük akım çeken (0.1A) istasyonları analiz eder. Bu, **FDI (False Data Injection)** tabanlı enerji hırsızlığını ifşa eder.
* **Anomaly Scoring:** Her veri paketi için 0-100 arasında bir "Risk Skoru" hesaplar.

---

## ⛓️ Blockchain Destekli "Tamper-Proof" Loglama

Siber güvenlikte en büyük sorunlardan biri, saldırganın izlerini silmek için log dosyalarını değiştirmesidir. SecVolt bu riski **Blockchain Teknolojisi** ile ortadan kaldırır.

* **SHA-256 Hash Chaining:** Tespit edilen her saldırı kaydı, kendinden önceki kaydın dijital parmak izini (Hash) içerir.
* **Değiştirilemezlik (Immutability):** Geçmişe dönük tek bir byte'lık değişiklik bile tüm zincirin matematiksel doğrulamasını bozar (Broken Chain).
* **Adli Bilişim (Forensics):** Sistem yöneticileri, saldırı anındaki verilerin bütünlüğünden %100 emin olabilirler.

---

## 🛡️ SteVe Entegrasyonu ve Ağ İzolasyonu

SecVolt, sadece tek bir cihazı değil, tüm şarj ağını koruyan bir **Orkestrasyon Katmanı** olarak çalışır. Endüstri standardı açık kaynaklı CSMS yazılımı **SteVe**'in yönetim mantığını simüle eder.

* **Karantina Protokolü:** Saldırı tespit edilen istasyon (örn: CP-001) ağdan mantıksal olarak izole edilir (Blocked Status).
* **Süreklilik:** Saldırı altındaki cihaz kapatılırken, yanındaki diğer istasyonlar (CP-002, CP-003) güvenle hizmet vermeye devam eder. Bu, tüm şebekenin çökmesini engeller.

---

## 🌪️ Simüle Edilen Saldırı Vektörleri

Proje kapsamında, gerçek dünyada en sık karşılaşılan iki kritik senaryo simüle edilmiştir:

| Saldırı Tipi | Teknik Tanım | Hedef & Etki | SecVolt Yanıtı |
| :--- | :--- | :--- | :--- |
| **Energy Theft (FDI)** | **False Data Injection** | Sayaç verilerini manipüle ederek (0.1A gösterip 32A çekmek) faturadan kaçınmak. | Yapay zeka motoru, güç/statü uyumsuzluğunu tespit eder ve oturumu sonlandırır. |
| **Denial of Service (DoS)** | **Overcurrent Stress** | İstasyona kapasitesinin üzerinde (120A+) yük bindirerek sigortaları attırmak veya yangın çıkarmak. | Kural tabanlı motor, milisaniyeler içinde akımı keser ve istasyonu "Faulted" moda alır. |

---

## 📊 Dashboard ve Görselleştirme Teknolojisi

Sistemin beyni Python (FastAPI) olsa da, yüzü modern web teknolojileridir.

* **Real-Time Telemetry:** WebSocket benzeri veri akışı ile voltaj, akım ve güç (kW) değerleri saniyelik olarak grafiklere dökülür.
* **Network Map:** 6 istasyonlu bir şarj parkının kuş bakışı canlı durumu.
* **Cyber-Defense UI:** Operatörün dikkatini en kritik olaylara çeken "Dark Mode" odaklı, yüksek kontrastlı arayüz tasarımı.

<img width="471" height="520" alt="Ekran Resmi 2026-01-22 23 39 34" src="https://github.com/user-attachments/assets/5983a94e-a9e4-415f-9f78-080ac3d4ef6d" />
<img width="1800" height="1039" alt="Ekran Resmi 2026-01-22 23 39 59" src="https://github.com/user-attachments/assets/85fd18f9-cf78-43dd-b337-75660acd1596" />
<img width="1800" height="1040" alt="Ekran Resmi 2026-01-22 23 40 58" src="https://github.com/user-attachments/assets/d633249e-344b-4f38-97e5-3a54adb7131b" />
<img width="1255" height="346" alt="Ekran Resmi 2026-01-22 23 41 14" src="https://github.com/user-attachments/assets/112e6380-8c44-480f-ae72-d3b944036a76" />
<img width="1800" height="1042" alt="Ekran Resmi 2026-01-22 23 41 25" src="https://github.com/user-attachments/assets/93b4cde2-a65f-4dbf-a365-409e720e1f47" />

---

## 🏗️ Teknik Mimari Diyagramı

```mermaid
graph TD
    subgraph "External World"
        Attacker[Saldırgan / Hacker]
        Kaggle[Kaggle Gerçek Veri Seti]
    end

    subgraph "SecVolt Core (Backend)"
        Simulator[Data Stream & Attack Injector]
        IDS[Hybrid IDS Engine]
        Blockchain[Blockchain Logger]
    end

    subgraph "Control Plane (Frontend)"
        Dashboard[Live Monitoring Dashboard]
        SteveMap[SteVe Network Monitor]
    end

    Kaggle -->|Raw Data| Simulator
    Attacker -.->|Inject Anomaly| Simulator
    Simulator -->|Telemetry| IDS
    IDS -->|Threat Detection| Blockchain
    IDS -->|Block Signal| SteveMap
    Simulator -->|Stream| Dashboard
    Blockchain -->|Audit Logs| Dashboard



