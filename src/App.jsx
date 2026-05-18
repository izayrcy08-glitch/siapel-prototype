import { useEffect, useMemo, useState } from "react";
import { DATA_PEGAWAI } from "./dataPegawai";
import { QRCodeSVG } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

function HalamanPegawai() {
  const [search, setSearch] = useState("");
  const [hasilScan, setHasilScan] = useState("");

  const filteredPegawai = DATA_PEGAWAI.filter((pegawai) =>
    pegawai.nama.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setHasilScan(decodedText);
        scanner.clear().catch(() => {});
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Halaman Pegawai
      </h1>
      <p>Prototype SIAPEL — Absensi Pegawai</p>

      <div
        id="reader"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      {hasilScan && (
        <div
          style={{
            backgroundColor: "#d1fae5",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#065f46", marginBottom: "10px" }}>
            ✅ Absensi Berhasil
          </h2>
          <p>{hasilScan}</p>
          <p>QR berhasil diverifikasi dan absensi telah dicatat.</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Cari nama pegawai..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginTop: "20px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {search && (
        <div style={{ marginTop: "20px" }}>
          {filteredPegawai.map((pegawai) => (
            <div
              key={pegawai.id}
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            >
              <strong>{pegawai.nama}</strong>
              <p>{pegawai.jabatan}</p>
              <small>{pegawai.bidang}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HalamanAdmin() {
  const [qrValue, setQrValue] = useState("");
  const [countdown, setCountdown] = useState(15);

  const generateQR = () => {
    const kodeBaru = `SIAPEL-${Date.now()}`;
    setQrValue(kodeBaru);
  };

  useEffect(() => {
    generateQR();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateQR();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Halaman Admin
      </h1>
      <p>QR Absensi Realtime</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "20px",
          marginTop: "20px",
        }}
      >
        <QRCodeSVG value={qrValue} size={250} />
      </div>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        Refresh QR dalam: {countdown} detik
      </p>
      <small>{qrValue}</small>
    </div>
  );
}

function HalamanPimpinan() {
  const totalPegawai = DATA_PEGAWAI.length;
  const totalHadir = 3;
  const persentase = Math.round((totalHadir / totalPegawai) * 100);

  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Dashboard Pimpinan
      </h1>
      <p>Monitoring realtime absensi pegawai SIAPEL</p>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "20px", marginTop: "20px" }}>
        <h2>Total Pegawai</h2>
        <p style={{ fontSize: "42px", fontWeight: "bold" }}>{totalPegawai}</p>
      </div>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "20px", marginTop: "20px" }}>
        <h2>Total Hadir</h2>
        <p style={{ fontSize: "42px", fontWeight: "bold" }}>{totalHadir}</p>
      </div>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "20px", marginTop: "20px" }}>
        <h2>Persentase Hadir</h2>
        <p style={{ fontSize: "42px", fontWeight: "bold" }}>{persentase}%</p>
      </div>
    </div>
  );
}

export default function App() {
  // 1. Ambil role dari URL saat pertama kali halaman dimuat
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("role") || "pegawai";
    }
    return "pegawai";
  });

  // 2. Fungsi untuk mengubah role tanpa perlu reload halaman (anti-crash)
  const pindahRole = (roleBaru) => {
    setRole(roleBaru);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("role", roleBaru);
      window.history.pushState({}, "", url);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        color: "#1e3a5f",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
        paddingBottom: "100px",
      }}
    >
      {/* Kondisional rendering berdasarkan state role */}
      {role === "pegawai" && <HalamanPegawai />}
      {role === "admin" && <HalamanAdmin />}
      {role === "pimpinan" && <HalamanPimpinan />}

      {/* Navigasi tombol di bawah */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button onClick={() => pindahRole("pegawai")} style={buttonStyle}>
          Pegawai
        </button>
        <button onClick={() => pindahRole("admin")} style={buttonStyle}>
          Admin
        </button>
        <button onClick={() => pindahRole("pimpinan")} style={buttonStyle}>
          Pimpinan
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 20px",
  cursor: "pointer",
  fontSize: "16px",
};