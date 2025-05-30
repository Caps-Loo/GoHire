// pdfGenerator.js
const puppeteer = require("puppeteer");
const pool = require("../config/db"); // Import koneksi database

const createPDF = async (applicant, status) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const logoUrl = "http://localhost:3000/uploads/Logo.png";

  try {
    // Query database untuk mendapatkan detail pekerjaan berdasarkan job_id
    const [jobResult] = await pool.execute("SELECT * FROM jobs WHERE id = ?", [applicant.job_id]);
    
    if (jobResult && jobResult.length > 0) {
      const jobDetails = jobResult[0];
      jobTitle = jobDetails.title;
      salary = jobDetails.salary;
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
  }

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; }
          h1 { color: ${status === "accepted" ? "#2E8B57" : "#D32F2F"}; text-align: center; }
          .container { border: 2px solid #ddd; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .company-header { text-align: center; margin-bottom: 20px; }
          .company-header img { width: 120px; }
          .details { font-size: 16px; line-height: 1.6; }
          .highlight { font-weight: bold; color: #1E88E5; }
          .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
          .signature { margin-top: 40px; text-align: right; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="company-header">
            <img src="${logoUrl}" alt="Company Logo">
            <p>PT. GoHire - Software & Recruitment</p>
          </div>
          
          <h1>${status === "accepted" ? "🎉 Selamat! Anda Diterima!" : "❌ Maaf, Anda Ditolak"}</h1>
          
          <div class="details">
            <p><span class="highlight">Nama:</span> ${applicant.name}</p>
            <p><span class="highlight">Email:</span> ${applicant.email}</p>
            <p><span class="highlight">Posisi:</span> ${jobTitle}</p>
            <p><span class="highlight">Lokasi:</span> Jakarta Selatan</p>
            <p><span class="highlight">Gaji:</span> ${salary}</p>   
            <p><span class="highlight">Status:</span> ${status === "accepted" ? "Diterima ✅" : "Ditolak ❌"}</p>
          </div>

          <div class="signature">
            <p>Hormat kami,</p>
            <p><strong>HR Manager</strong></p>
            <p>PT. GoHire</p>
          </div>
        </div>

        <div class="footer">
          <p>© 2025 GoHire. Semua Hak Dilindungi.</p>
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });

  await browser.close();
  return pdfBuffer;
};

module.exports = createPDF;