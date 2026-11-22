/* Kandungan pembelajaran untuk kanak-kanak 4 tahun.
   Rujuk RESEARCH.md untuk sebab setiap pilihan. */
window.DATA = {
  nombor: ["kosong", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "lapan", "sembilan", "sepuluh"],

  bendaKira: [
    { e: "🍎", n: "epal" }, { e: "🐟", n: "ikan" }, { e: "⭐", n: "bintang" },
    { e: "🎈", n: "belon" }, { e: "🐥", n: "anak ayam" }, { e: "🚗", n: "kereta" },
    { e: "🌸", n: "bunga" }, { e: "🍌", n: "pisang" }, { e: "🐞", n: "kumbang" },
    { e: "🥚", n: "telur" }
  ],

  warna: [
    { id: "merah", c: "#E53935" }, { id: "biru", c: "#1E88E5" },
    { id: "kuning", c: "#FDD835" }, { id: "hijau", c: "#43A047" },
    { id: "oren", c: "#FB8C00" }, { id: "ungu", c: "#8E24AA" },
    { id: "merah jambu", c: "#F48FB1" }, { id: "coklat", c: "#8D6E63" },
    { id: "hitam", c: "#263238" }, { id: "putih", c: "#FFFFFF" }
  ],
  // Tahap 3: objek sebenar -> warna
  warnaBenda: [
    { e: "🍌", n: "pisang", w: "kuning" }, { e: "🍓", n: "strawberi", w: "merah" },
    { e: "🥦", n: "brokoli", w: "hijau" }, { e: "🍊", n: "oren", w: "oren" },
    { e: "🍇", n: "anggur", w: "ungu" }, { e: "🐳", n: "ikan paus", w: "biru" },
    { e: "🍅", n: "tomato", w: "merah" }, { e: "🐸", n: "katak", w: "hijau" },
    { e: "🌞", n: "matahari", w: "kuning" }, { e: "🥕", n: "lobak merah", w: "oren" },
    { e: "🍆", n: "terung", w: "ungu" }, { e: "🐷", n: "babi kecil", w: "merah jambu" },
    { e: "🐻", n: "beruang", w: "coklat" }, { e: "☁️", n: "awan", w: "putih" }
  ],

  bentuk: [
    { id: "bulatan" }, { id: "segi empat sama" }, { id: "segi tiga" },
    { id: "segi empat tepat" }, { id: "bintang" }, { id: "hati" }, { id: "bujur" }
  ],

  huruf: [
    ["A", "ayam", "🐔"], ["B", "buku", "📖"], ["C", "cawan", "☕"], ["D", "dadu", "🎲"],
    ["E", "epal", "🍎"], ["F", "feri", "⛴️"], ["G", "gajah", "🐘"], ["H", "harimau", "🐯"],
    ["I", "ikan", "🐟"], ["J", "jam", "⏰"], ["K", "kucing", "🐱"], ["L", "lembu", "🐮"],
    ["M", "monyet", "🐵"], ["N", "nanas", "🍍"], ["O", "oren", "🍊"], ["P", "pisang", "🍌"],
    ["Q", "Quran", "📗"], ["R", "rumah", "🏠"], ["S", "semut", "🐜"], ["T", "tembikai", "🍉"],
    ["U", "ular", "🐍"], ["V", "van", "🚐"], ["W", "wau", "🪁"], ["X", "xilofon", "🎶"],
    ["Y", "yoyo", "🪀"], ["Z", "zirafah", "🦒"]
  ],

  haiwan: [
    // Tahap 1: haiwan ladang
    [
      { e: "🐮", n: "lembu", f: "Lembu berbunyi moo! Lembu beri kita susu." },
      { e: "🐔", n: "ayam", f: "Ayam berbunyi kokok! Ayam bertelur." },
      { e: "🐐", n: "kambing", f: "Kambing berbunyi mbek! Kambing suka makan rumput." },
      { e: "🦆", n: "itik", f: "Itik berbunyi kuek kuek! Itik pandai berenang." },
      { e: "🐱", n: "kucing", f: "Kucing berbunyi meow! Kucing suka tidur." },
      { e: "🐴", n: "kuda", f: "Kuda berlari laju!" }
    ],
    // Tahap 2: haiwan hutan
    [
      { e: "🐯", n: "harimau", f: "Harimau Malaya hidup di hutan kita!" },
      { e: "🐘", n: "gajah", f: "Gajah ada belalai yang panjang." },
      { e: "🐵", n: "monyet", f: "Monyet suka memanjat pokok dan makan pisang." },
      { e: "🦒", n: "zirafah", f: "Zirafah ada leher yang sangat panjang." },
      { e: "🦁", n: "singa", f: "Singa mengaum dengan kuat!" },
      { e: "🐍", n: "ular", f: "Ular tiada kaki. Ular menjalar." }
    ],
    // Tahap 3: haiwan laut
    [
      { e: "🐠", n: "ikan", f: "Ikan bernafas di dalam air." },
      { e: "🐢", n: "penyu", f: "Penyu bertelur di pantai." },
      { e: "🐙", n: "sotong", f: "Sotong ada lapan kaki!" },
      { e: "🦀", n: "ketam", f: "Ketam berjalan mengiring." },
      { e: "🐳", n: "ikan paus", f: "Ikan paus sangat besar!" },
      { e: "🐬", n: "ikan lumba-lumba", f: "Ikan lumba-lumba suka melompat." }
    ]
  ],

  bendaSaiz: [
    { e: "🐘", n: "gajah" }, { e: "🍎", n: "epal" }, { e: "🚌", n: "bas" },
    { e: "🐶", n: "anjing" }, { e: "🏀", n: "bola" }, { e: "🌳", n: "pokok" },
    { e: "🐮", n: "lembu" }, { e: "🧸", n: "patung beruang" }
  ],

  bendaCorak: ["🍎", "🍌", "🍇", "⭐", "🌙", "🐮", "🐱", "🚗", "🎈", "🌸", "🔵", "🟥"],

  bendaMemori: [
    { e: "🐮", n: "lembu" }, { e: "🐱", n: "kucing" }, { e: "🍎", n: "epal" },
    { e: "⭐", n: "bintang" }, { e: "🚗", n: "kereta" }, { e: "🌈", n: "pelangi" },
    { e: "🐟", n: "ikan" }, { e: "🍌", n: "pisang" }, { e: "🎈", n: "belon" },
    { e: "🐘", n: "gajah" }
  ],

  pelekat: ["🦄", "🐬", "🦋", "🌈", "🚀", "⭐", "🍭", "🎈", "🐢", "🦁", "🐼", "🐙",
            "🌻", "🍉", "🚂", "🏰", "🎨", "🦖", "🐝", "🍩", "🧸", "🌙", "🐳", "🦒"],

  avatar: ["🐮", "🐱", "🐶", "🐰", "🐻", "🐼", "🦊", "🐸", "🐯", "🐵"],

  pujian: ["Pandai!", "Hebat!", "Bagus sekali!", "Betul!", "Syabas!", "Wah, bijaknya!", "Terbaik!"],
  cubaLagi: ["Cuba lagi ya.", "Hampir! Cuba lagi.", "Tak apa, cuba sekali lagi."]
};
