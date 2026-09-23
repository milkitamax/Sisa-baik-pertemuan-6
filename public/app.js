async function muatPenawaran() {
  const container = document.querySelector("#daftar-penawaran");
  container.innerHTML = "<p>Memuat...</p>";

  try {
    const response = await fetch("/api/penawaran");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message || "Gagal memuat penawaran.");
    }

    container.innerHTML = "";

    payload.data.forEach((item) => {
      const article = document.createElement("article");

      article.innerHTML = `
        <h3>${item.nama}</h3>
        <p>Penyedia: ${item.penyedia}</p>
        <p>Harga: Rp${item.hargaPenawaran.toLocaleString("id-ID")}</p>
        <p>Stok: ${item.stok} ${item.satuan}</p>
        <button data-id="${item.id}">Pesan 1</button>
      `;

      article.querySelector("button").addEventListener("click", () => {
        document.querySelector("#form-pesanan").dataset.penawaranId = item.id;
        document.querySelector("#hasil-pesanan").textContent =
          `Penawaran dipilih: ${item.nama}`;
      });

      container.appendChild(article);
    });
  } catch (error) {
    container.innerHTML = `<p>${error.message}</p>`;
  }
}

async function kirimPesanan(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const penawaranId = Number(form.dataset.penawaranId);
  const namaPemesan = document.querySelector("#nama-pemesan").value;

  if (!penawaranId) {
    document.querySelector("#hasil-pesanan").textContent =
      "Pilih penawaran terlebih dahulu.";
    return;
  }

  const response = await fetch("/api/pesanan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      namaPemesan,
      items: [
        {
          penawaranId,
          kuantitas: 1
        }
      ]
    })
  });

  const payload = await response.json();

  document.querySelector("#hasil-pesanan").textContent =
    JSON.stringify(payload, null, 2);

  if (response.ok) {
    await muatPenawaran();
  }
}

document
  .querySelector("#form-pesanan")
  .addEventListener("submit", kirimPesanan);

muatPenawaran();