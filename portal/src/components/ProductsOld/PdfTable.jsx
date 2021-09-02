import QRCode from "qrcode-svg";
import html2pdf from "html2pdf.js";
import moment from "moment";

const PdfTable = ({ list = [], header = "" }) => {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  const tableHeader = `<thead>
    <tr>
      <th>Số thứ tự</>
      <th>Bài viết</th>
      <th>Mã QR</th>
      <th>Link bài viết</th>
    </tr>
  </thead>`;
  const tbody = document.createElement("tbody");
  list.forEach((e, i) => {
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    const th4 = document.createElement("th");
    const qrSvg = new QRCode({
      content: e.qr,
      width: 100,
      height: 100,
    }).svg();
    const divSvg = document.createElement("div");
    divSvg.innerHTML = qrSvg;
    th1.textContent = i + 1;
    th2.textContent = e.news_title;
    th3.appendChild(divSvg);
    th4.innerHTML = `<a href=${e.qr}>${e.qr}</a>`;
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tbody.appendChild(tr);
  });
  table.innerHTML = tableHeader;
  table.appendChild(tbody);

  table.querySelectorAll("td, th").forEach((e) => {
    e.style.border = "1px solid #000000";
    e.style.textAlign = "center";
  });

  const divHeader = document.createElement("div");
  divHeader.style.width = "100%";
  divHeader.style.textAlign = "center";
  const h1 = document.createElement("h3");
  h1.textContent = `QRCode - ${header}`;
  divHeader.appendChild(h1);

  const pdf = document.createElement("div");
  pdf.style.width = "100%";
  pdf.appendChild(divHeader);
  pdf.appendChild(table);

  const name = `${moment().format("YYYY-MM-DD")}.${moment().format("HHMMSS")}`;

  const worker = html2pdf()
    .from(pdf)
    .save(name + ".pdf");
  return table;
};

export default PdfTable;
