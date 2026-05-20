import React, { useState, useEffect, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  navy:    '#1e3a5f',
  navyD:   '#132847',
  navyL:   '#2a4f7f',
  sky:     '#3b82f6',
  green:   '#22c55e',
  greenD:  '#16a34a',
  amber:   '#f59e0b',
  red:     '#ef4444',
  bg:      '#f0f4f8',
  bgCard:  '#ffffff',
  text:    '#0f172a',
  textSub: '#64748b',
  border:  '#e2e8f0',
  mono:    "'DM Mono', monospace",
}

const css = {
  btn: (bg, color = '#fff', extra = {}) => ({
    background: bg, color, border: 'none', borderRadius: 10,
    padding: '12px 20px', fontFamily: 'inherit', fontSize: 15,
    fontWeight: 700, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all .15s', width: '100%', ...extra,
  }),
  card: (extra = {}) => ({
    background: T.bgCard, borderRadius: 14, padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,.08)', ...extra,
  }),
}

// ─── DATA PEGAWAI ─────────────────────────────────────────────────────────────
const assignBidang = (jabatan) => {
  if (!jabatan) return 'Umum'
  const j = jabatan.toLowerCase()
  if (j.includes('kepala dinas')) return 'Pimpinan'
  if (j.includes('sekretaris')) return 'Sekretariat'
  if (j.includes('bina marga')) return 'Bina Marga'
  if (j.includes('cipta karya')) return 'Cipta Karya'
  if (j.includes('tata ruang') || j.includes('penata ruang')) return 'Tata Ruang'
  if (j.includes('sumber daya air') || j.includes('pengairan') || j.includes('irigasi')) return 'Sumber Daya Air'
  if (j.includes('jasa konstruksi')) return 'Jasa Konstruksi'
  if (j.includes('tata kota')) return 'Tata Kota'
  return 'Umum'
}

const rawPegawai = [
  { nama: "RODY ST., M.I.P", nip: "196907101995031004", golongan: "IV/b", jabatan: "Kepala Dinas" },
  { nama: "ALHAMDANI UMAR ST, M.S.", nip: "198003082005011010", golongan: "IV/b", jabatan: "Sekretaris Dinas" },
  { nama: "PATRIA S.T., M.S.", nip: "197307202005011007", golongan: "IV/a", jabatan: "Kepala Bidang Bina Marga" },
  { nama: "IGNASIUS S.T", nip: "197610072007011007", golongan: "IV/a", jabatan: "Kepala Bidang Cipta Karya" },
  { nama: "ZERO SOTA ROSADI S.Kep.Ns", nip: "197210241993031005", golongan: "IV/a", jabatan: "Kepala Bidang Sumber Daya Air" },
  { nama: "MUJIBURRAHMAN S.P", nip: "197402042007011012", golongan: "III/d", jabatan: "Penata Ruang Muda" },
  { nama: "MARIA HELMIDA ST", nip: "197304092006042015", golongan: "III/d", jabatan: "Pengadministrasi Umum" },
  { nama: "ERIANTONI IWANATA S HUT", nip: "198204252006041008", golongan: "III/d", jabatan: "Analis Cipta Karya" },
  { nama: "SEKRENING S.ST", nip: "197007091994031004", golongan: "III/d", jabatan: "Penata Kelola Bina Marga" },
  { nama: "WARNO, S.ST., M.Sos.", nip: "197411161994031003", golongan: "III/d", jabatan: "Penata Bina Marga Muda" },
  { nama: "SUTIKNO S.Hut", nip: "197408071994031005", golongan: "III/d", jabatan: "Penata Ruang Muda" },
  { nama: "FORTIS TAUFIK SELNITI BUDI S.ST", nip: "197306191994031008", golongan: "III/d", jabatan: "Analis Jasa Konstruksi" },
  { nama: "SUBIYANTORO ST., M.T.", nip: "198107312008041002", golongan: "IV/a", jabatan: "Kepala Sub Bagian Bina Marga" },
  { nama: "SUHERMAN ST", nip: "197411152008011016", golongan: "III/d", jabatan: "Penata Kelola Bina Marga" },
  { nama: "ARSETO ADY NUGROHO S.T", nip: "198112182008041001", golongan: "III/d", jabatan: "Analis Cipta Karya" },
  { nama: "RONY SURYADI ST", nip: "197605122009011003", golongan: "III/d", jabatan: "Penata Bina Marga" },
  { nama: "ROY LANDI WOPA HOSANG S.T", nip: "198104032010011013", golongan: "III/d", jabatan: "Analis Sumber Daya Air" },
  { nama: "HARIS HARIYADI S.T", nip: "198102152011011003", golongan: "III/d", jabatan: "Kepala Seksi Bina Marga" },
  { nama: "MIRA APRIYANTINADA S.T", nip: "198004272011012008", golongan: "III/d", jabatan: "Analis Cipta Karya" },
  { nama: "RAHAYU DWI MUMPUNI S.T", nip: "198110192011012005", golongan: "III/d", jabatan: "Penata Ruang Muda" },
  { nama: "ROBY CHAHYADI ST", nip: "197911102010011010", golongan: "III/d", jabatan: "Analis Bina Marga" },
  { nama: "PURYANI S.T., M.T.", nip: "197102172014061001", golongan: "III/c", jabatan: "Penata Bina Marga" },
  { nama: "ALFIAN NUR A.Md", nip: "197505171998031005", golongan: "III/c", jabatan: "Penata Kelola Sumber Daya Air" },
  { nama: "FETRIS SUGIAN ST", nip: "198007192014031001", golongan: "III/c", jabatan: "Pengawas Bina Marga" },
  { nama: "MUHAMMAD EKSAN S.E", nip: "197207212007011015", golongan: "III/c", jabatan: "Analis Keuangan Sekretariat" },
  { nama: "TRI UTAMI HANDAYANI, SE", nip: "199103212015032003", golongan: "III/c", jabatan: "Analis Sekretariat" },
  { nama: "YANO ADMAWIJAYA ST", nip: "198501012006041007", golongan: "III/c", jabatan: "Kepala Seksi Cipta Karya" },
  { nama: "ASMUNI", nip: "197208021993031009", golongan: "III/b", jabatan: "Penata Kelola Perkantoran" },
  { nama: "IMBAI", nip: "196909121997031006", golongan: "III/b", jabatan: "Petugas Verifikasi Keuangan" },
  { nama: "ABDUL WILDAN", nip: "197010201998031003", golongan: "III/b", jabatan: "Pengawas Bina Marga" },
  { nama: "AGUS PATRIADI S.A.P.", nip: "197708192006041006", golongan: "III/b", jabatan: "Penata Kelola Kepegawaian" },
  { nama: "AHMAD SAPUTRA S.E.", nip: "197509182008011014", golongan: "III/b", jabatan: "Penata Keuangan" },
  { nama: "IBNU WARDANI S.E", nip: "197910092008011022", golongan: "III/b", jabatan: "Pengelola Keuangan Sekretariat" },
  { nama: "KUSHARYADI S A.Md", nip: "198101302011011004", golongan: "III/b", jabatan: "Pengawas Bina Marga" },
  { nama: "NUR ARIFIN S.E", nip: "198202082009011004", golongan: "III/a", jabatan: "Analis Keuangan" },
  { nama: "HADRIANOOR S.T.", nip: "198001112007011010", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "JOAN MARTHEN BADJADJI A.Md", nip: "197703062007011015", golongan: "III/a", jabatan: "Analis Sumber Daya Air" },
  { nama: "ELDIANA HERIYANIE A.Md", nip: "197511282007012007", golongan: "III/a", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "PASKADIME TURAY S.T.", nip: "198709242022031002", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "FRIEDMAN TARIDA MARPAUNG S.T", nip: "198809232022031001", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "FRANSISCO RAMA RIO S.T.", nip: "199303302022031001", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "YANESAR HAWILEY S.T.", nip: "199401222022031002", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "HENGKI PRADANA S.T", nip: "199308062022031001", golongan: "III/a", jabatan: "Penata Bina Marga" },
  { nama: "AGIL PAHLEVI ALHAZMI S.T", nip: "199503132022031002", golongan: "III/a", jabatan: "Analis Sumber Daya Air" },
  { nama: "PERMANA ADI PUTERA S.T.", nip: "199401202022031001", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "LEDY DAYANA S. PUTES S.T.", nip: "199607292022032001", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "YOSUA LAMA LEWA S.T", nip: "199612142022031001", golongan: "III/a", jabatan: "Penata Bina Marga" },
  { nama: "SYAHRYAN DHARMA AJI S.T.", nip: "199705022022031001", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ANNISA NURUL HIDAYAH S.T.", nip: "199807162022032001", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "OLVA DWI FAUJI HANDAYANI S.P.W.K.", nip: "199709072022032001", golongan: "III/a", jabatan: "Penata Ruang Pertama" },
  { nama: "KRISTUANTO NUGROHO SAPUTRO S.P.W.K", nip: "199211282014031001", golongan: "III/a", jabatan: "Penata Ruang Pertama" },
  { nama: "EDI ERIANTO", nip: "198203282008011007", golongan: "III/a", jabatan: "Analis Keuangan" },
  { nama: "DELTAYANA", nip: "197110102007012022", golongan: "III/a", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "RUSLINE", nip: "197407072007012016", golongan: "III/a", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "NOVA ARDONO, S.M", nip: "197311162012121001", golongan: "III/a", jabatan: "Pengelola Aset" },
  { nama: "CECE SYAPUTRA", nip: "197710132008011017", golongan: "III/a", jabatan: "Pengawas Bina Marga" },
  { nama: "LINA RAHMAWATI", nip: "197708272007012006", golongan: "III/a", jabatan: "Pengadministrasi Umum" },
  { nama: "YAYAT ULANTARI", nip: "198010152007012007", golongan: "III/a", jabatan: "Pengadministrasi Umum" },
  { nama: "ANTON SUJARWADI", nip: "197703032007011017", golongan: "III/a", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "RADEN RORO NIKEN GAYATRI WOELANSARI", nip: "197311222008012006", golongan: "III/a", jabatan: "Pengadministrasi Umum" },
  { nama: "MARGIANTO", nip: "197703232008011016", golongan: "III/a", jabatan: "Analis Jalan Bina Marga" },
  { nama: "SUKARIA, S.T.", nip: "197810312008011007", golongan: "III/a", jabatan: "Pengawas Bina Marga" },
  { nama: "OCTANI INDRIAWATI", nip: "198010012008012018", golongan: "III/a", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "GEZALI", nip: "197302042007011015", golongan: "II/d", jabatan: "Pengadministrasi Umum" },
  { nama: "HENRI LUKAS", nip: "197101172007011014", golongan: "II/d", jabatan: "Juru Operasi Sumber Daya Air" },
  { nama: "SALIANSYAH", nip: "197407052007011026", golongan: "II/d", jabatan: "Caraka I" },
  { nama: "SUPRIADI", nip: "197404012009011006", golongan: "II/d", jabatan: "Juru Operasi dan Pemeliharaan" },
  { nama: "EMMY SUTANTY", nip: "197905152010012017", golongan: "II/d", jabatan: "Pengadministrasi Umum" },
  { nama: "ARLINAWATI", nip: "197807042009012002", golongan: "II/d", jabatan: "Juru Operasi Sekretariat" },
  { nama: "LAMBAK", nip: "198301302008011012", golongan: "II/d", jabatan: "Teknisi Keciptakaryaan" },
  { nama: "SAIDI", nip: "197905132007011007", golongan: "II/c", jabatan: "Juru Pengairan" },
  { nama: "SENGHO MARGONO", nip: "197707072012121002", golongan: "II/c", jabatan: "Pengemudi" },
  { nama: "SUGIHERTONO", nip: "196908142006041009", golongan: "II/c", jabatan: "Pengamat Perairan Sumber Daya Air" },
  { nama: "BUDIMAN", nip: "197506102007011020", golongan: "II/a", jabatan: "Juru Pengairan" },
  { nama: "ABDUL ROHMAN", nip: "197903122008011023", golongan: "II/a", jabatan: "Pengawas Irigasi" },
  { nama: "SUKARDI", nip: "198312222012121002", golongan: "I/c", jabatan: "Caraka I" },
  { nama: "FERDI DWI ARIYANTO", nip: "200301252025061004", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "RAHMAN", nip: "199310092025061001", golongan: "II/a", jabatan: "Petugas Operasi Bina Marga" },
  { nama: "RISTA TAZKIAH", nip: "200210032025062006", golongan: "II/a", jabatan: "Petugas Operasi Bina Marga" },
  { nama: "YAMES GUANDA", nip: "200307052025061002", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "RUDI GUNAWAN", nip: "199308182025061006", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "MUHAMMAD RENDRA NATA", nip: "200107022025061003", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "AMIRA MAYA HAFIZA", nip: "200108172025062013", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "YOGIANOR", nip: "200004132025061006", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "AINUL YUDA", nip: "199907142025061007", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "MUHAMMAD ARIFIN", nip: "199101022025061002", golongan: "II/a", jabatan: "Teknisi Bina Marga" },
  { nama: "APRI ANUGRAH WIJAYA", nip: "199604062025061004", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "ZAINUDIN", nip: "199703162025061003", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "IVANA ANGELITA", nip: "200207142025062005", golongan: "II/a", jabatan: "Petugas Sekretariat" },
  { nama: "MUHAMMAD ALFARIZI PRASETIA", nip: "200107182025061005", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "ADI PRASETYO", nip: "200005212025061006", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "AHMAD RAIHAN ZACKY", nip: "200406212025061002", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "POPY WANDA APRILIA", nip: "200604212025062003", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "YULIANTO", nip: "199207272025061002", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "DEFRI JUNIANDA ARIF", nip: "199306242025061002", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "HARIYANTO RAHARJO", nip: "199503082025061007", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "AKHMAD FADILAH", nip: "199611152025061005", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "SALEHA", nip: "200504172025062001", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "INDRIANI", nip: "200209152025062008", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "ACHMAD ARIEF SETIAWAN", nip: "200206112025061004", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "RAJUL RAJABI", nip: "200010182025061003", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "FAHRURRAZI", nip: "199612012025061006", golongan: "II/a", jabatan: "Petugas Operasi Bina Marga" },
  { nama: "HARSA PURNAMA", nip: "199004292025061004", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "USAMAH", nip: "199311022025061003", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "RASYID SHIDDIQ", nip: "200009232025061008", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "RISKA AULIA RAHMAN", nip: "199612242025061009", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "MITA LESTARI", nip: "200111282025062012", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "JULIAN IQBAL NUGRAHA", nip: "200207232025061005", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "YOEL PRATAMA", nip: "200409112025061003", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "BAGUS JOKO KRISDYANTO", nip: "199609012025061008", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "NEFHA KRISTILA", nip: "200301082025062003", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "ARISMA NOVIANA PUTRI", nip: "199611192025062009", golongan: "II/a", jabatan: "Petugas Operasi Sekretariat" },
  { nama: "YUSAFAT TRI BERIANTO", nip: "200110062025061004", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "MUHAMMAD HAJIANOR SHODIQIN", nip: "199903222025061007", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "SA'ADAH", nip: "200508292025062001", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "FIRMAN BUDIMULIA", nip: "200103262025061011", golongan: "II/a", jabatan: "Petugas Bina Marga" },
  { nama: "DAVID HARNO PRASETYA", nip: "199502172025061007", golongan: "II/a", jabatan: "Operator Alat Berat" },
  { nama: "HERLIZA PUTRI PERDANA A.Md.T.", nip: "199906062025062020", golongan: "II/c", jabatan: "Penata Bina Marga" },
  { nama: "ANDI SETYAWAN RAMADANI A.Md.T", nip: "200012042025061005", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "JOSS SCUD QADHAFIE A.Md.", nip: "199102092025061002", golongan: "II/c", jabatan: "Analis Bina Marga" },
  { nama: "NOR KHALISA A.Md.T", nip: "200112022025062007", golongan: "II/c", jabatan: "Penata Bina Marga" },
  { nama: "HENI ARTATI BR MUNTE A.Md.T", nip: "199804092025062011", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "ADELIA PEBRIYANTI A.Md.T", nip: "200102112025062020", golongan: "II/c", jabatan: "Penata Bina Marga" },
  { nama: "YUSUF ARDYAN SETYA PRADANA AMd.T", nip: "200108032025061009", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "ETI MUSYAROFAH A.Md", nip: "199610142025062009", golongan: "II/c", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "DANIEL KAHARAP TARIP A.Md.T.", nip: "200206122025061005", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "ANITA SURYANINGSIH A.Md", nip: "199310192025062006", golongan: "II/c", jabatan: "Pengadministrasi Umum" },
  { nama: "ERWIN AGUNG SANTOSO A.Md", nip: "199007082025061005", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "BETI MAHARANI A.Md.T.", nip: "200201312025062010", golongan: "II/c", jabatan: "Penata Bina Marga" },
  { nama: "A. M. NUR ADIB KURNIAWAN RASYID A.Md.T.", nip: "200006232025061011", golongan: "II/c", jabatan: "Teknisi Bina Marga" },
  { nama: "SELVI ARDIANI A.Md.", nip: "199506112025062005", golongan: "II/c", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "CHRISTIN SEPTALITA SILALAHI A.md", nip: "198909062025062002", golongan: "II/c", jabatan: "Pengadministrasi Sekretariat" },
  { nama: "ADITYA BUANA FIQRI S.T", nip: "200102202025061005", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "FADHLI S.Tr.T", nip: "200004222025061005", golongan: "III/a", jabatan: "Pengawas Bina Marga" },
  { nama: "KRISNA CRISTA MAHENDRA S.T", nip: "200007262025061002", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "GABRIELLA OCTAVIRIA NOORMALIA HETRANI PUTRI S.Ars.", nip: "199310052025062006", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "SAHRUL RAMADANI S.T.", nip: "199912172025061005", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "NADYA FARAH PRADITA S.Stat", nip: "199906112025062007", golongan: "III/a", jabatan: "Analis Sekretariat" },
  { nama: "GUSTIAN S.T.", nip: "200105262025061004", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "HARY CHRISTIAN ANUGRAHNU, S.Ars", nip: "199611152025061001", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "CINDERELLA SUZANNA CAROLYNDA S.Ars", nip: "200101292025062008", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "DESI RAHMADANA S.T.", nip: "199912122025062009", golongan: "III/a", jabatan: "Penata Bina Marga" },
  { nama: "MARIATUL KARIMAH S.T.", nip: "200203112025062008", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ESTER KLAUDIA TAMARA S.T.", nip: "200107292025062005", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "PRA SETIAWAN SILAEN S.T.", nip: "199611132025061006", golongan: "III/a", jabatan: "Analis Sumber Daya Air" },
  { nama: "VIDYA RESTU WIJAYA S.T.", nip: "199810062025061006", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "MUHAMAD RIZKI S.T.", nip: "199905082025061009", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "JOSUA ORIESTA SALOMO S.T.", nip: "200001242025061012", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ZAIN SAPUTRA S.T", nip: "199803032025061007", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "ADJIE DWI SULISTYONO S.Stat", nip: "200103292025061006", golongan: "III/a", jabatan: "Analis Sekretariat" },
  { nama: "BENEDICTUS PASCHAL ARYO SETYA S.Ars", nip: "200203292025061003", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "M. FACHTUR REZA S.T.", nip: "199912042025061011", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ERIANTY NUR APRILIANA S.T.", nip: "199704062025062004", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ROBI S.T", nip: "199408142025061008", golongan: "III/a", jabatan: "Teknisi Sarana Bina Marga" },
  { nama: "STEVANY ALIZA KHAIRANI S.T.", nip: "200004042025062008", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "NOVRINDO GABRIEL PANARA TARUNG S.T", nip: "200011152025061007", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "FANDRI S.T.", nip: "199604152025061006", golongan: "III/a", jabatan: "Pengawas Bina Marga" },
  { nama: "AGUSTULUSNU S.T", nip: "199508052025061006", golongan: "III/a", jabatan: "Pengawas Bina Marga" },
  { nama: "DEDE CHRISFANI S.Kom", nip: "199812012025061005", golongan: "III/a", jabatan: "Analis Sistem Informasi" },
  { nama: "AMALIA SETIARINI S.Ars", nip: "200204232025062007", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "LIUS KAHARAP BION INSO S.T.", nip: "198911242025061001", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "KARINA PANGAMIANI S.T.", nip: "200306032025062002", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "HENDI KRISTIAN S.Ars", nip: "199802192025061002", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "FITRI DEVI S.T.", nip: "200012262025062006", golongan: "III/a", jabatan: "Penata Tata Ruang" },
  { nama: "INTAN ARDILLA S.H", nip: "200201312025062009", golongan: "III/a", jabatan: "Pranata Hukum" },
  { nama: "ISNAN NURUL AKBAR S.T.", nip: "199709232025061010", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "SHAHIFA INDIRA EFFENDI S.Kom", nip: "200201152025062010", golongan: "III/a", jabatan: "Analis Sistem Informasi" },
  { nama: "MUHAMMAD PUJIADI ANGGARA PRAMANA PUTRA MANDALIKA S.Ars", nip: "200107312025061009", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "PANJI KUSNENDAR MZ S.T.", nip: "199407192025061006", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ANDREAS ADI NUGROHO S.Kom.", nip: "199710222025061006", golongan: "III/a", jabatan: "Analis Sistem Informasi" },
  { nama: "USWATUN HASANAH S.T.", nip: "200208272025062003", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "IVAN KLIWON RICARDO S.T.", nip: "200102232025061005", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "INDAH FAJERI MEUTIA SAPUTRI S.T", nip: "199909222025062016", golongan: "III/a", jabatan: "Analis Sumber Daya Air" },
  { nama: "TUNJUNG DWIJAYANTI S.Ars", nip: "200010032025062006", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "MUHAMMAD HAFIZHIR RIDHA S.T.", nip: "200010162025061006", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "FAISAL MIFTAHUL HUDA S.T.", nip: "199508142025061004", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ETY JULI ANDRIANITA S.T", nip: "199607192025062003", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "HENDRA NOVIANTARA S.T.", nip: "200103212025061004", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "DWI LESTARI S.Ars", nip: "199706152025062006", golongan: "III/a", jabatan: "Teknisi Cipta Karya" },
  { nama: "FEDRIAN SYAHPUTRA S.T", nip: "199404022025061003", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "YUZTIRA WANAGITA S.Ars", nip: "199708042025062010", golongan: "III/a", jabatan: "Analis Cipta Karya" },
  { nama: "SALSABILA S.T", nip: "200105092025062012", golongan: "III/a", jabatan: "Teknisi Bina Marga" },
  { nama: "NOOR MAULIDA SARI S.T.", nip: "199806162025062011", golongan: "III/a", jabatan: "Analis Bina Marga" },
  { nama: "ANDRIANO ST", nip: "197111102006041026", golongan: "III/d", jabatan: "Kepala Bidang Tata Ruang" },
  { nama: "MUHAMMAD OKTA FAHRIZAN NOOR ST", nip: "198110222010011023", golongan: "III/d", jabatan: "Kepala Seksi Tata Ruang" },
  { nama: "DEDI S.T", nip: "197407172008011020", golongan: "IV/a", jabatan: "Kepala Bidang Jasa Konstruksi" },
]

const DATA_PEGAWAI = rawPegawai.map((p, i) => ({
  id: i + 1,
  ...p,
  bidang: assignBidang(p.jabatan),
}))

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const LS_QR    = 'siapel_qr_aktif'
const LS_ABSEN = 'siapel_absensi_hari_ini'
const TOTAL    = 186
const QR_TTL   = 15000 // 15 detik

const namaHari  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
const namaBulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const formatTanggal = (d) => {
  const dt = d || new Date()
  return `${namaHari[dt.getDay()]}, ${dt.getDate()} ${namaBulan[dt.getMonth()]} ${dt.getFullYear()}`
}
const formatJam = (d) => {
  const dt = d || new Date()
  return dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
const todayKey = () => new Date().toISOString().slice(0, 10)

const getAbsensi = () => {
  try {
    const raw = localStorage.getItem(LS_ABSEN)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return arr.filter(a => a.tanggal === todayKey())
  } catch { return [] }
}
const saveAbsensi = (arr) => {
  const prev = (() => { try { return JSON.parse(localStorage.getItem(LS_ABSEN) || '[]') } catch { return [] } })()
  const today = prev.filter(a => a.tanggal === todayKey())
  // merge — replace today's
  const other = prev.filter(a => a.tanggal !== todayKey())
  localStorage.setItem(LS_ABSEN, JSON.stringify([...other, ...arr]))
}

const generateQR = () => {
  const ts = Date.now()
  const tokenId = `QR-${ts}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  const value = `SIAPEL-APEL-${ts}`
  const qr = { value, expiredAt: ts + QR_TTL, tokenId }
  localStorage.setItem(LS_QR, JSON.stringify(qr))
  return qr
}
const getActiveQR = () => {
  try { return JSON.parse(localStorage.getItem(LS_QR)) } catch { return null }
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
function NavBar({ role }) {
  const go = (r) => { window.location.search = `?role=${r}` }
  const btn = (r, label, icon) => (
    <button
      key={r}
      onClick={() => go(r)}
      style={{
        flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer',
        background: role === r ? T.navy : 'transparent',
        color: role === r ? '#fff' : T.textSub,
        fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
        borderRadius: 8, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 3, transition: 'all .15s',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  )
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: `1px solid ${T.border}`,
      display: 'flex', padding: '6px 16px 10px',
      zIndex: 100, maxWidth: 480, margin: '0 auto',
      boxShadow: '0 -2px 12px rgba(0,0,0,.08)',
    }}>
      {btn('pegawai', 'Pegawai', '👤')}
      {btn('admin', 'Admin', '🖥️')}
      {btn('pimpinan', 'Pimpinan', '📊')}
    </div>
  )
}

// ─── HALAMAN PEGAWAI ──────────────────────────────────────────────────────────
function HalamanPegawai() {
  const [step, setStep]               = useState(1)
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState([])
  const [selected, setSelected]       = useState(null)
  const [scanStatus, setScanStatus]   = useState(null) // null | 'scanning' | 'success' | 'error' | 'duplicate'
  const [scanMsg, setScanMsg]         = useState('')
  const [scanTime, setScanTime]       = useState('')
  const [cameraErr, setCameraErr]     = useState(false)
  const scannerRef                    = useRef(null)
  const scannerDivId                  = 'siapel-qr-reader'

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(DATA_PEGAWAI.filter(p => p.nama.toLowerCase().includes(q)).slice(0, 5))
  }, [query])

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        try { scannerRef.current.clear() } catch {}
        scannerRef.current = null
      })
    }
  }, [])

  useEffect(() => () => stopScanner(), [stopScanner])

  const startScanner = () => {
    if (!window.Html5Qrcode) {
      setCameraErr(true)
      return
    }
    setScanStatus('scanning')
    const scanner = new window.Html5Qrcode(scannerDivId)
    scannerRef.current = scanner
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        stopScanner()
        handleScanResult(decodedText)
      },
      () => {}
    ).catch(() => {
      stopScanner()
      setCameraErr(true)
      setScanStatus(null)
    })
  }

  const handleScanResult = (text) => {
    const activeQR = getActiveQR()
    if (!activeQR) { setScanStatus('error'); setScanMsg('QR tidak ditemukan. Pastikan layar Admin aktif.'); return }
    if (activeQR.value !== text) { setScanStatus('error'); setScanMsg('QR tidak cocok. Coba scan ulang.'); return }
    if (Date.now() > activeQR.expiredAt) { setScanStatus('error'); setScanMsg('QR sudah kedaluwarsa. Tunggu QR berikutnya.'); return }

    const absensi = getAbsensi()
    const sudahAbsen = absensi.find(a => a.nip === selected.nip)
    if (sudahAbsen) { setScanStatus('duplicate'); setScanMsg('Anda sudah tercatat hadir hari ini.'); return }

    const now = new Date()
    const entry = {
      id: selected.id, nama: selected.nama, nip: selected.nip,
      jabatan: selected.jabatan, golongan: selected.golongan,
      waktuScan: formatJam(now), tanggal: todayKey(),
    }
    saveAbsensi([...absensi, entry])
    setScanTime(formatJam(now))
    setScanStatus('success')
  }

  const reset = () => {
    setStep(1); setQuery(''); setResults([]); setSelected(null)
    setScanStatus(null); setScanMsg(''); setCameraErr(false)
    stopScanner()
  }

  // ── Step 1: Cari Nama ──
  if (step === 1) return (
    <div style={{ padding: '24px 16px 100px', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🏛️</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: -0.5 }}>SIAPEL</div>
        <div style={{ fontSize: 13, color: T.textSub, fontWeight: 500 }}>Absensi Apel Digital</div>
        <div style={{
          display: 'inline-block', marginTop: 8, padding: '4px 12px',
          background: T.bg, borderRadius: 20, fontSize: 12, color: T.textSub, fontWeight: 600,
        }}>
          {formatTanggal()}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: 18, pointerEvents: 'none',
        }}>🔍</span>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ketik nama Anda..."
          style={{
            width: '100%', padding: '14px 14px 14px 44px',
            border: `2px solid ${query ? T.navy : T.border}`,
            borderRadius: 12, fontSize: 16, fontFamily: 'inherit',
            outline: 'none', background: '#fff', color: T.text,
            transition: 'border-color .2s',
          }}
        />
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.1)' }}>
          {results.map((p, i) => (
            <div
              key={p.id}
              onClick={() => { setSelected(p); setStep(2) }}
              style={{
                padding: '14px 16px',
                borderBottom: i < results.length - 1 ? `1px solid ${T.border}` : 'none',
                cursor: 'pointer', transition: 'background .1s',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.bg}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: T.navy,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0,
              }}>
                {p.nama.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nama}</div>
                <div style={{ fontSize: 11, color: T.textSub, fontFamily: T.mono, marginTop: 2 }}>{p.nip}</div>
                <div style={{ fontSize: 12, color: T.textSub, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.jabatan}</div>
              </div>
              <span style={{ color: T.textSub, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: T.textSub }}>
          <div style={{ fontSize: 32 }}>🔎</div>
          <div style={{ marginTop: 8 }}>Nama tidak ditemukan</div>
        </div>
      )}

      {!query && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: T.textSub }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👆</div>
          <div style={{ fontWeight: 600 }}>Ketik nama Anda di atas</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Minimal 1 huruf untuk mulai mencari</div>
        </div>
      )}
      <NavBar role="pegawai" />
    </div>
  )

  // ── Step 2: Konfirmasi ──
  if (step === 2) return (
    <div style={{ padding: '24px 16px 100px', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ animation: 'fadeUp .3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.navy }}>Ini kamu?</div>
        </div>

        <div style={{
          ...css.card(), border: `2px solid ${T.navy}`,
          marginBottom: 20, animation: 'fadeUp .3s ease .1s both',
        }}>
          <div style={{
            background: T.navy, borderRadius: 10, padding: '16px',
            marginBottom: 16, textAlign: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 auto 10px',
            }}>
              {selected.nama.charAt(0)}
            </div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>{selected.nama}</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, fontFamily: T.mono, marginTop: 4 }}>{selected.nip}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Jabatan', selected.jabatan],
              ['Golongan', selected.golongan],
              ['Bidang', selected.bidang],
            ].map(([k, v]) => (
              <div key={k} style={{ background: T.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: T.textSub, fontWeight: 600, marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          style={{ ...css.btn(T.green), marginBottom: 10, borderRadius: 12, padding: '14px', fontSize: 16 }}
        >
          ✅ Ya, ini saya
        </button>
        <button
          onClick={reset}
          style={{ ...css.btn('transparent', T.textSub), border: `1px solid ${T.border}`, fontSize: 14 }}
        >
          ← Bukan saya, cari lagi
        </button>
      </div>
      <NavBar role="pegawai" />
    </div>
  )

  // ── Step 3: Scan QR (VERSI BARU ANTI-GAGAL) ──
  if (step === 3) {
    // Pengaman otomatis agar kamera terpanggil setelah halaman siap
    useEffect(() => {
      const timer = setTimeout(() => {
        if (scanStatus !== 'success' && scanStatus !== 'error' && scanStatus !== 'duplicate' && !cameraErr) {
          startScanner();
        }
      }, 400);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div style={{ padding: '24px 16px 100px', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>

        {/* SUCCESS */}
        {scanStatus === 'success' && (
          <div style={{ textAlign: 'center', animation: 'fadeUp .3s ease' }}>
            <div style={{ fontSize: 96, animation: 'checkPop .5s cubic-bezier(.36,.07,.19,.97)', marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: T.green, marginBottom: 8 }}>HADIR</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 4 }}>
              Selamat, {selected.nama.split(' ')[0]}!
            </div>
            <div style={{ color: T.textSub, marginBottom: 4 }}>Absensi Anda berhasil tercatat.</div>
            <div style={{ fontFamily: T.mono, color: T.textSub, fontSize: 13, marginBottom: 28 }}>
              🕐 {scanTime}
            </div>
            <button onClick={reset} style={{ ...css.btn(T.navy), maxWidth: 240, margin: '0 auto' }}>
              Selesai
            </button>
          </div>
        )}

        {/* ERROR / DUPLICATE */}
        {(scanStatus === 'error' || scanStatus === 'duplicate') && (
          <div style={{ textAlign: 'center', animation: 'fadeUp .3s ease' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>{scanStatus === 'duplicate' ? '⚠️' : '❌'}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: scanStatus === 'duplicate' ? T.amber : T.red, marginBottom: 8 }}>
              {scanStatus === 'duplicate' ? 'Sudah Absen' : 'Gagal'}
            </div>
            <div style={{ color: T.textSub, marginBottom: 28, padding: '0 20px' }}>{scanMsg}</div>
            <button
              onClick={() => { setScanStatus(null); setCameraErr(false) }}
              style={{ ...css.btn(T.navy), maxWidth: 240, margin: '0 auto 10px' }}
            >
              Coba Lagi
            </button>
            <button onClick={reset} style={{ ...css.btn('transparent', T.textSub), border: `1px solid ${T.border}`, maxWidth: 240, margin: '0 auto', fontSize: 14 }}>
              Kembali ke Awal
            </button>
          </div>
        )}

        {/* SCAN UI */}
        {!scanStatus && (
          <div style={{ animation: 'fadeUp .3s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: T.textSub, fontWeight: 600, marginBottom: 4 }}>LANGKAH 3 / 3</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.navy, marginBottom: 6 }}>Scan QR Code</div>
              <div style={{ color: T.textSub, fontSize: 14 }}>Arahkan kamera ke QR Code di layar Admin</div>
            </div>

            {/* Pegawai chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20,
              border: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: T.navy,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0,
              }}>{selected.nama.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{selected.nama}</div>
                <div style={{ fontSize: 11, color: T.textSub, fontFamily: T.mono }}>{selected.nip}</div>
              </div>
            </div>

            {/* Camera container */}
            <div style={{
              borderRadius: 16, overflow: 'hidden', background: '#000',
              minHeight: 220,
              marginBottom: 16,
            }}>
              <div id={scannerDivId} style={{ width: '100%' }} />
            </div>

            {/* KOTAK SIMULASI UPLOAD GAMBAR - DIPASANG DI SINI AGAR TETAP MUNCUL SAAT ERROR */}
            <div style={{ background: '#f0f4f8', borderRadius: 12, padding: 14, textAlign: 'center', marginBottom: 16, border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 6 }}>
                🛠️ ALTERNATIF SIMULASI SCAN (ANTI-GAGAL DEMO)
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && window.Html5Qrcode) {
                    const html5QrCode = new window.Html5Qrcode(scannerDivId);
                    html5QrCode.scanFile(file, true)
                      .then(decodedText => {
                        if (typeof stopScanner === 'function') stopScanner();
                        handleScanResult(decodedText);
                      })
                      .catch(() => {
                        alert("QR Code tidak terdeteksi pada gambar. Pastikan file gambar QR Code jelas.");
                      });
                  } else {
                    alert("Sistem pembaca QR belum siap.");
                  }
                }} 
                style={{ fontSize: 12, width: '100%' }}
              />
            </div>

            {cameraErr ? (
              <div style={{
                background: '#fef2f2', border: `1px solid #fecaca`,
                borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 16,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}></div>
                <div style={{ fontWeight: 700, color: T.red, marginBottom: 4 }}>Kamera tidak dapat diakses</div>
                <div style={{ fontSize: 13, color: T.textSub }}>
                  Silakan gunakan kotak alternatif simulasi di atas dengan memasukkan file foto/screenshot QR Code dari menu Admin agar demo tetap berjalan lancar.
                </div>
              </div>
            ) : (
              <button
                onClick={scanStatus === 'scanning' ? stopScanner : startScanner}
                style={{
                  ...css.btn(scanStatus === 'scanning' ? T.red : T.navy),
                  fontSize: 16, padding: '14px',
                }}
              >
                {scanStatus === 'scanning' ? '✖ Tutup Kamera' : '📷 Buka Kamera & Scan QR'}
              </button>
            )}

            <button
              onClick={() => setStep(2)}
              style={{ ...css.btn('transparent', T.textSub), border: `1px solid ${T.border}`, marginTop: 10, fontSize: 14 }}
            >
              ← Kembali
            </button>
          </div>
        )}
        <NavBar role="pegawai" />
      </div>
    );
  }
}

// ─── HALAMAN ADMIN ────────────────────────────────────────────────────────────
function HalamanAdmin() {
  const [qr, setQr]           = useState(() => generateQR())
  const [countdown, setCountdown] = useState(15)
  const [now, setNow]         = useState(new Date())
  const [hadirCount, setHadirCount] = useState(0)

  useEffect(() => {
    const tick = setInterval(() => {
      const nowD = new Date()
      setNow(nowD)
      const remaining = Math.max(0, Math.ceil((qr.expiredAt - Date.now()) / 1000))
      setCountdown(remaining)
      if (remaining <= 0) {
        const newQr = generateQR()
        setQr(newQr)
        setCountdown(15)
      }
    }, 500)
    return () => clearInterval(tick)
  }, [qr])

  useEffect(() => {
    const t = setInterval(() => setHadirCount(getAbsensi().length), 2000)
    setHadirCount(getAbsensi().length)
    return () => clearInterval(t)
  }, [])

  const pct = (countdown / 15) * 100
  const r = 44
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct / 100)
  const timerColor = countdown > 8 ? '#22c55e' : countdown >= 4 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      minHeight: '100vh', background: '#0d1b2a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px 20px 80px',
      fontFamily: 'inherit',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 4 }}>🏛️</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>SIAPEL</div>
        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginBottom: 8 }}>
          Dinas Pekerjaan Umum dan Penataan Ruang — Kabupaten Barito Utara
        </div>
        <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 15, fontWeight: 600 }}>
          {formatTanggal(now)}
        </div>
        <div style={{ color: T.sky, fontSize: 28, fontFamily: T.mono, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>
          {formatJam(now)}
        </div>
      </div>

      {/* QR Box */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: 20,
        boxShadow: '0 0 60px rgba(59,130,246,.3)',
        marginBottom: 24,
      }}>
        <QRCodeSVG value={qr.value} size={220} bgColor="#ffffff" fgColor="#0d1b2a" level="H" />
      </div>

      {/* Countdown Ring */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={timerColor} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={dashOffset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset .4s, stroke .3s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: timerColor, fontFamily: T.mono, lineHeight: 1 }}>
            {countdown}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>detik</span>
        </div>
      </div>

      {/* Counter */}
      <div style={{
        background: 'rgba(255,255,255,.08)', borderRadius: 14,
        padding: '14px 28px', textAlign: 'center', marginBottom: 12,
        border: '1px solid rgba(255,255,255,.1)',
      }}>
        <span style={{ fontSize: 18 }}>✅ </span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Sudah Hadir: </span>
        <span style={{ color: T.green, fontWeight: 800, fontSize: 24, fontFamily: T.mono }}>{hadirCount}</span>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 16 }}> / {TOTAL} pegawai</span>
      </div>

      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, fontFamily: T.mono }}>
        Token: {qr.tokenId}
      </div>

      {/* Nav override for dark bg */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0d1b2a', borderTop: '1px solid rgba(255,255,255,.1)',
        display: 'flex', padding: '6px 16px 10px',
        zIndex: 100, maxWidth: '100%',
      }}>
        {[
          ['pegawai', '👤', 'Pegawai'],
          ['admin', '🖥️', 'Admin'],
          ['pimpinan', '📊', 'Pimpinan'],
        ].map(([r, icon, label]) => (
          <button
            key={r}
            onClick={() => { window.location.search = `?role=${r}` }}
            style={{
              flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
              background: r === 'admin' ? 'rgba(255,255,255,.1)' : 'transparent',
              color: r === 'admin' ? '#fff' : 'rgba(255,255,255,.4)',
              fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
              borderRadius: 8, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── DATA DUMMY SANKSI ───────────────────────────────────────────────────────
// Berdasarkan PP No. 94 Tahun 2021:
// Ringan  : tidak hadir 3–5 hari kerja dalam sebulan → Teguran Lisan / Tertulis
// Sedang  : tidak hadir 6–10 hari kerja → Penundaan KGB / Penurunan Pangkat
// Berat   : tidak hadir 11+ hari kerja  → Pembebasan Jabatan / Pemberhentian
const DUMMY_SANKSI = [
  { nama: 'SALIANSYAH', nip: '197407052007011026', jabatan: 'Caraka I', golongan: 'II/d', bidang: 'Umum',           tidakHadir: 14, bulan: 'Mei 2026' },
  { nama: 'BUDIMAN',    nip: '197506102007011020', jabatan: 'Juru Pengairan', golongan: 'II/a', bidang: 'Sumber Daya Air', tidakHadir: 11, bulan: 'Mei 2026' },
  { nama: 'GEZALI',     nip: '197302042007011015', jabatan: 'Pengadministrasi Umum', golongan: 'II/d', bidang: 'Umum', tidakHadir: 9, bulan: 'Mei 2026' },
  { nama: 'LAMBAK',     nip: '198301302008011012', jabatan: 'Teknisi Keciptakaryaan', golongan: 'II/d', bidang: 'Cipta Karya', tidakHadir: 8, bulan: 'Mei 2026' },
  { nama: 'SUKARDI',    nip: '198312222012121002', jabatan: 'Caraka I', golongan: 'I/c', bidang: 'Umum',             tidakHadir: 7, bulan: 'Mei 2026' },
  { nama: 'HENRI LUKAS', nip: '197101172007011014', jabatan: 'Juru Operasi Sumber Daya Air', golongan: 'II/d', bidang: 'Sumber Daya Air', tidakHadir: 6, bulan: 'Mei 2026' },
  { nama: 'SAIDI',      nip: '197905132007011007', jabatan: 'Juru Pengairan', golongan: 'II/c', bidang: 'Sumber Daya Air', tidakHadir: 5, bulan: 'Mei 2026' },
  { nama: 'SUGIHERTONO', nip: '196908142006041009', jabatan: 'Pengamat Perairan', golongan: 'II/c', bidang: 'Sumber Daya Air', tidakHadir: 4, bulan: 'Mei 2026' },
  { nama: 'EMMY SUTANTY', nip: '197905152010012017', jabatan: 'Pengadministrasi Umum', golongan: 'II/d', bidang: 'Umum', tidakHadir: 4, bulan: 'Mei 2026' },
  { nama: 'IMBAI',      nip: '196909121997031006', jabatan: 'Petugas Verifikasi Keuangan', golongan: 'III/b', bidang: 'Sekretariat', tidakHadir: 3, bulan: 'Mei 2026' },
  { nama: 'SENGHO MARGONO', nip: '197707072012121002', jabatan: 'Pengemudi', golongan: 'II/c', bidang: 'Umum',    tidakHadir: 3, bulan: 'Mei 2026' },
]

const getSanksi = (tidakHadir) => {
  if (tidakHadir >= 11) return { zona: 'Berat', warna: T.red, bg: '#fef2f2', ikon: '🔴', label: 'Pembebasan Jabatan / Pemberhentian' }
  if (tidakHadir >= 6)  return { zona: 'Sedang', warna: T.amber, bg: '#fffbeb', ikon: '🟡', label: 'Penundaan KGB / Penurunan Pangkat' }
  return                       { zona: 'Ringan', warna: '#16a34a', bg: '#f0fdf4', ikon: '🟢', label: 'Teguran Lisan / Tertulis' }
}

// ─── HALAMAN PIMPINAN ─────────────────────────────────────────────────────────
function HalamanPimpinan() {
  const [absensi, setAbsensi] = useState([])
  const [now, setNow]         = useState(new Date())
  const [tab, setTab]         = useState('hadir')

  useEffect(() => {
    const refresh = () => { setAbsensi(getAbsensi()); setNow(new Date()) }
    refresh()
    const t = setInterval(refresh, 3000)
    return () => clearInterval(t)
  }, [])

  const hadir    = absensi.length
  const belum    = TOTAL - hadir
  const pctHadir = Math.round((hadir / TOTAL) * 100)

  const nipHadir  = new Set(absensi.map(a => a.nip))
  const belumData = DATA_PEGAWAI.filter(p => !nipHadir.has(p.nip))
  const hadirData = [...absensi].sort((a, b) => b.waktuScan.localeCompare(a.waktuScan))

  const handleReset = () => {
    if (window.confirm('Reset semua data absensi hari ini? Tindakan ini tidak dapat dibatalkan.')) {
      const prev = (() => { try { return JSON.parse(localStorage.getItem(LS_ABSEN) || '[]') } catch { return [] } })()
      localStorage.setItem(LS_ABSEN, JSON.stringify(prev.filter(a => a.tanggal !== todayKey())))
      setAbsensi([])
    }
  }

  // Ringkasan zona sanksi
  const zonaBerat  = DUMMY_SANKSI.filter(p => p.tidakHadir >= 11)
  const zonaSedang = DUMMY_SANKSI.filter(p => p.tidakHadir >= 6 && p.tidakHadir < 11)
  const zonaRingan = DUMMY_SANKSI.filter(p => p.tidakHadir >= 3 && p.tidakHadir < 6)

  const statCards = [
    { label: 'Hadir', value: hadir, color: T.green, bg: '#f0fdf4', icon: '✅' },
    { label: 'Belum Absen', value: belum, color: T.red, bg: '#fef2f2', icon: '⏳' },
    { label: 'Total', value: TOTAL, color: T.navy, bg: '#eff6ff', icon: '👥' },
    { label: 'Persentase', value: `${pctHadir}%`, color: T.amber, bg: '#fffbeb', icon: '📈' },
  ]

  const tabs = [
    ['hadir',  `✅ Hadir (${hadir})`],
    ['belum',  `⏳ Belum (${belum})`],
    ['sanksi', `⚠️ Sanksi (${DUMMY_SANKSI.length})`],
  ]

  return (
    <div style={{ background: T.bg, minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: T.navy, padding: '20px 16px 24px' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 4 }}>
          🏛️ SIAPEL — Dashboard Pimpinan
        </div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 4 }}>
          Selamat datang,<br />Bapak RODY ST., M.I.P
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: T.mono }}>
          DPUPR Kab. Barito Utara • Update: {formatJam(now)}
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${pctHadir}%`, height: '100%',
              background: T.green, borderRadius: 8, transition: 'width .5s ease',
            }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, marginTop: 4 }}>
            {pctHadir}% kehadiran tercatat hari ini
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 14px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {statCards.map(sc => (
            <div key={sc.label} style={{ background: sc.bg, borderRadius: 12, padding: '14px 16px', border: `1px solid ${sc.color}22` }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{sc.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: sc.color, fontFamily: T.mono, lineHeight: 1 }}>{sc.value}</div>
              <div style={{ fontSize: 12, color: T.textSub, fontWeight: 600, marginTop: 3 }}>{sc.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flexShrink: 0, padding: '10px 12px', border: 'none', borderRadius: 10,
                background: tab === key ? T.navy : '#fff',
                color: tab === key ? '#fff' : T.textSub,
                fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                cursor: 'pointer', transition: 'all .15s',
                boxShadow: tab === key ? 'none' : '0 1px 3px rgba(0,0,0,.06)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: HADIR ── */}
        {tab === 'hadir' && (
          <div style={css.card({ padding: 0, overflow: 'hidden' })}>
            {hadirData.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: T.textSub }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <div>Belum ada pegawai yang absen</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: T.navy }}>
                      {['No', 'Nama', 'NIP', 'Jabatan', 'Jam'].map(h => (
                        <th key={h} style={{ color: '#fff', padding: '10px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hadirData.map((a, i) => (
                      <tr key={a.nip} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 ? T.bg : '#fff' }}>
                        <td style={{ padding: '9px 10px', color: T.textSub }}>{i + 1}</td>
                        <td style={{ padding: '9px 10px', fontWeight: 600, color: T.text }}>{a.nama}</td>
                        <td style={{ padding: '9px 10px', fontFamily: T.mono, color: T.textSub }}>{a.nip}</td>
                        <td style={{ padding: '9px 10px', color: T.textSub, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.jabatan}</td>
                        <td style={{ padding: '9px 10px', fontFamily: T.mono, color: T.green, fontWeight: 700, whiteSpace: 'nowrap' }}>{a.waktuScan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: BELUM ── */}
        {tab === 'belum' && (
          <div style={css.card({ padding: 0, overflow: 'hidden' })}>
            {belumData.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: T.textSub }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, color: T.green }}>Semua pegawai sudah absen!</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#fef2f2' }}>
                      {['No', 'Nama', 'NIP', 'Jabatan', 'Gol'].map(h => (
                        <th key={h} style={{ color: T.red, padding: '10px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {belumData.map((p, i) => {
                      const isPejabat = p.golongan.startsWith('IV')
                      return (
                        <tr key={p.nip} style={{ borderBottom: `1px solid ${T.border}`, background: isPejabat ? '#fff7ed' : (i % 2 ? T.bg : '#fff') }}>
                          <td style={{ padding: '9px 10px', color: T.textSub }}>{i + 1}</td>
                          <td style={{ padding: '9px 10px', fontWeight: isPejabat ? 700 : 500, color: isPejabat ? T.amber : T.text }}>
                            {isPejabat ? '⭐ ' : ''}{p.nama}
                          </td>
                          <td style={{ padding: '9px 10px', fontFamily: T.mono, color: T.textSub }}>{p.nip}</td>
                          <td style={{ padding: '9px 10px', color: T.textSub }}>{p.jabatan}</td>
                          <td style={{ padding: '9px 10px', fontFamily: T.mono, color: T.text }}>{p.golongan}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SANKSI ── */}
        {tab === 'sanksi' && (
          <div>
            {/* Label demo */}
            <div style={{
              background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
              padding: '10px 14px', marginBottom: 16, fontSize: 12,
              color: '#92400e', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <span><strong>Data contoh</strong> — rekap ketidakhadiran bulan Mei 2026 berdasarkan PP No. 94 Tahun 2021</span>
            </div>

            {/* Ringkasan zona */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Zona Berat', count: zonaBerat.length, color: T.red, bg: '#fef2f2', ikon: '🔴', sub: '≥11 hari' },
                { label: 'Zona Sedang', count: zonaSedang.length, color: T.amber, bg: '#fffbeb', ikon: '🟡', sub: '6–10 hari' },
                { label: 'Zona Ringan', count: zonaRingan.length, color: '#16a34a', bg: '#f0fdf4', ikon: '🟢', sub: '3–5 hari' },
              ].map(z => (
                <div key={z.label} style={{ background: z.bg, borderRadius: 12, padding: '12px 10px', textAlign: 'center', border: `1px solid ${z.color}33` }}>
                  <div style={{ fontSize: 20 }}>{z.ikon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: z.color, fontFamily: T.mono }}>{z.count}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: z.color }}>{z.label}</div>
                  <div style={{ fontSize: 10, color: T.textSub }}>{z.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabel detail */}
            <div style={css.card({ padding: 0, overflow: 'hidden' })}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#1e3a5f' }}>
                      {['No', 'Nama', 'Bidang', 'Tdk Hadir', 'Zona', 'Sanksi (PP 94/2021)'].map(h => (
                        <th key={h} style={{ color: '#fff', padding: '10px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_SANKSI.map((p, i) => {
                      const s = getSanksi(p.tidakHadir)
                      return (
                        <tr key={p.nip} style={{ borderBottom: `1px solid ${T.border}`, background: s.bg }}>
                          <td style={{ padding: '9px 10px', color: T.textSub }}>{i + 1}</td>
                          <td style={{ padding: '9px 10px', fontWeight: 600, color: T.text, whiteSpace: 'nowrap' }}>{p.nama}</td>
                          <td style={{ padding: '9px 10px', color: T.textSub, whiteSpace: 'nowrap' }}>{p.bidang}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                            <span style={{
                              background: s.warna, color: '#fff', borderRadius: 6,
                              padding: '2px 8px', fontFamily: T.mono, fontWeight: 700, fontSize: 13,
                            }}>{p.tidakHadir}</span>
                          </td>
                          <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              background: s.bg, color: s.warna, border: `1px solid ${s.warna}55`,
                              borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 11,
                            }}>{s.ikon} {s.zona}</span>
                          </td>
                          <td style={{ padding: '9px 10px', color: s.warna, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{s.label}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tombol reset — dipindah ke sini, lebih rapi */}
            <button
              onClick={handleReset}
              style={{
                ...css.btn('#fef2f2', T.red),
                border: `1px solid #fecaca`,
                marginTop: 20, fontSize: 13,
              }}
            >
              🔄 Reset Data Absensi Hari Ini (untuk testing)
            </button>
          </div>
        )}
      </div>

      <NavBar role="pimpinan" />
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const role = new URLSearchParams(window.location.search).get('role') || 'pegawai'

  // Load html5-qrcode dynamically
  useEffect(() => {
    if (!document.getElementById('html5qrcode-script')) {
      const s = document.createElement('script')
      s.id = 'html5qrcode-script'
      s.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
      document.head.appendChild(s)
    }
  }, [])

  return (
    <div style={{ maxWidth: role === 'admin' ? '100%' : 480, margin: '0 auto', minHeight: '100vh' }}>
      {role === 'pegawai'  && <HalamanPegawai />}
      {role === 'admin'    && <HalamanAdmin />}
      {role === 'pimpinan' && <HalamanPimpinan />}
    </div>
  )
}
