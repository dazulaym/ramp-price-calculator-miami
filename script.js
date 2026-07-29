const DEFAULT_SETTINGS = {
  newRampPricePerSqft: 58,
  usedRampDiscountPercent: 15,
  purchaseInstallPerSqft: 6,
  minimumPurchaseInstall: 250,
  monthlyRentalPerSqft: 6,
  rentalInstallPerSqft: 6,
  minimumRentalInstall: 250,
  rentalRemovalPerSqft: 4,
  minimumRentalRemoval: 150,
  depositPercent: 50,
  adminPin: "1010"
};

const SETTINGS_KEY = "rampCalculatorSettingsV2";
let settings = loadSettings();

let signatureHasInk = false;
let signatureContext = null;
let signatureDrawing = false;
let signatureLastPoint = null;

const $ = (id) => document.getElementById(id);
const fields = {
  customerName: $("customerName"),
  customerAddress: $("customerAddress"),
  consultantName: $("consultantName"),
  rampLength: $("rampLength"),
  p55: $("platform55"),
  p54: $("platform54"),
  p44: $("platform44"),
  notes: $("quoteNotes")
};

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function numberValue(element) {
  const value = Number.parseFloat(element.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function wholeValue(element) {
  return Math.floor(numberValue(element));
}

function money(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function selectedType() {
  return document.querySelector('input[name="quoteType"]:checked').value;
}

function calculate() {
  const rampLength = numberValue(fields.rampLength);
  const p55 = wholeValue(fields.p55);
  const p54 = wholeValue(fields.p54);
  const p44 = wholeValue(fields.p44);

  const squareFeet =
    rampLength * 3 +
    p55 * 25 +
    p54 * 20 +
    p44 * 16;

  const newRampPrice = squareFeet * settings.newRampPricePerSqft;
  const usedRate = settings.newRampPricePerSqft * (1 - settings.usedRampDiscountPercent / 100);
  const usedRampPrice = squareFeet * usedRate;

  const purchaseInstallation = squareFeet > 0
    ? Math.max(squareFeet * settings.purchaseInstallPerSqft, settings.minimumPurchaseInstall)
    : 0;

  const newTotal = newRampPrice + purchaseInstallation;
  const usedTotal = usedRampPrice + purchaseInstallation;

  const monthlyRental = squareFeet * settings.monthlyRentalPerSqft;
  const rentalInstallation = squareFeet > 0
    ? Math.max(squareFeet * settings.rentalInstallPerSqft, settings.minimumRentalInstall)
    : 0;
  const rentalRemoval = squareFeet > 0
    ? Math.max(squareFeet * settings.rentalRemovalPerSqft, settings.minimumRentalRemoval)
    : 0;
  const rentalFirstPayment = monthlyRental * 3 + rentalInstallation + rentalRemoval;

  const results = {
    rampLength, p55, p54, p44, squareFeet,
    newRampPrice, purchaseInstallation, newTotal,
    usedRate, usedRampPrice, usedTotal,
    monthlyRental, rentalInstallation, rentalRemoval, rentalFirstPayment
  };

  updateScreen(results);
  return results;
}

function getSelectedQuote(results) {
  const type = selectedType();

  if (type === "used") {
    return {
      type,
      name: "Used Ramp Purchase",
      total: results.usedTotal,
      lines: [
        ["Used Ramp Price", results.usedRampPrice],
        ["Installation", results.purchaseInstallation]
      ]
    };
  }

  if (type === "rental") {
    return {
      type,
      name: "Ramp Rental",
      total: results.rentalFirstPayment,
      lines: [
        ["First 3 Months", results.monthlyRental * 3],
        ["Installation", results.rentalInstallation],
        ["Removal", results.rentalRemoval]
      ],
      ongoing: results.monthlyRental
    };
  }

  return {
    type: "new",
    name: "New Ramp Purchase",
    total: results.newTotal,
    lines: [
      ["New Ramp Price", results.newRampPrice],
      ["Installation", results.purchaseInstallation]
    ]
  };
}

function updateScreen(results) {
  $("totalSquareFeet").textContent = results.squareFeet.toLocaleString("en-US", { maximumFractionDigits: 2 });
  $("newRampPrice").textContent = money(results.newRampPrice);
  $("newInstallation").textContent = money(results.purchaseInstallation);
  $("newTotal").textContent = money(results.newTotal);

  $("usedRampPrice").textContent = money(results.usedRampPrice);
  $("usedInstallation").textContent = money(results.purchaseInstallation);
  $("usedTotal").textContent = money(results.usedTotal);
  $("usedDiscountDisplay").textContent = settings.usedRampDiscountPercent;

  $("monthlyRental").textContent = money(results.monthlyRental);
  $("rentalInstallation").textContent = money(results.rentalInstallation);
  $("rentalRemoval").textContent = money(results.rentalRemoval);
  $("rentalFirstPayment").textContent = money(results.rentalFirstPayment);
  $("ongoingRental").textContent = money(results.monthlyRental);

  const quote = getSelectedQuote(results);
  const deposit = quote.total * settings.depositPercent / 100;
  const balance = quote.total - deposit;

  $("selectedOption").textContent = quote.name;
  $("selectedTotal").textContent = money(quote.total);
  $("depositPercentLabel").textContent = `${settings.depositPercent}% Deposit Required`;
  $("depositAmount").textContent = money(deposit);
  $("remainingBalance").textContent = money(balance);
}

function quoteSummaryText() {
  const results = calculate();
  const quote = getSelectedQuote(results);
  const deposit = quote.total * settings.depositPercent / 100;
  const balance = quote.total - deposit;

  const detailLines = quote.lines.map(([label, value]) => `- ${label}: ${money(value)}`).join("\n");
  const ongoing = quote.type === "rental"
    ? `\n- Ongoing Monthly Payment (Month 4+): ${money(quote.ongoing)}`
    : "";

  return `101 Mobility of Miami - Ramp Quote

Customer: ${fields.customerName.value || ""}
Installation Address: ${fields.customerAddress.value || ""}
Mobility Consultant: ${fields.consultantName.value || ""}
Ramp Measurements:
- Total Ramp Length: ${results.rampLength} linear ft
- 5 x 5 Platforms: ${results.p55}
- 5 x 4 Platforms: ${results.p54}
- 4 x 4 Platforms: ${results.p44}
- Total Square Feet: ${results.squareFeet}

Selected Option: ${quote.name}
${detailLines}
- Quote Total: ${money(quote.total)}
- ${settings.depositPercent}% Deposit Required: ${money(deposit)}
- Remaining Balance: ${money(balance)}${ongoing}

Notes:
${fields.notes.value || "None"}`;
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(quoteSummaryText());
    $("statusMessage").textContent = "Quote summary copied.";
  } catch {
    $("statusMessage").textContent = "Unable to copy. Please try again.";
  }
}

function cleanFileName(value) {
  return (value || "Ramp-Quote").replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-");
}


function setupSignaturePad() {
  const canvas = $("signatureCanvas");
  if (!canvas) return;

  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    let savedImage = null;
    if (signatureHasInk && canvas.width && canvas.height) {
      savedImage = canvas.toDataURL("image/png");
    }

    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));

    signatureContext = canvas.getContext("2d");
    signatureContext.scale(ratio, ratio);
    signatureContext.lineWidth = 2.2;
    signatureContext.lineCap = "round";
    signatureContext.lineJoin = "round";
    signatureContext.strokeStyle = "#303438";

    if (savedImage) {
      const image = new Image();
      image.onload = () => {
        signatureContext.drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = savedImage;
    }
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top
    };
  }

  function start(event) {
    event.preventDefault();
    signatureDrawing = true;
    signatureLastPoint = pointFromEvent(event);
  }

  function move(event) {
    if (!signatureDrawing || !signatureContext) return;
    event.preventDefault();

    const point = pointFromEvent(event);
    signatureContext.beginPath();
    signatureContext.moveTo(signatureLastPoint.x, signatureLastPoint.y);
    signatureContext.lineTo(point.x, point.y);
    signatureContext.stroke();

    signatureLastPoint = point;
    signatureHasInk = true;
  }

  function stop(event) {
    if (event) event.preventDefault();
    signatureDrawing = false;
    signatureLastPoint = null;
  }

  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
  canvas.addEventListener("pointerleave", stop);

  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(resizeCanvas);
}

function clearSignature() {
  const canvas = $("signatureCanvas");
  if (!canvas || !signatureContext) return;
  const rect = canvas.getBoundingClientRect();
  signatureContext.clearRect(0, 0, rect.width, rect.height);
  signatureHasInk = false;
}

function signatureImageData() {
  const canvas = $("signatureCanvas");
  return signatureHasInk && canvas ? canvas.toDataURL("image/png") : null;
}

async function loadImageAsDataUrl(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function generatePdf() {
  const results = calculate();

  if (results.squareFeet <= 0) {
    $("statusMessage").textContent = "Enter ramp measurements before generating the PDF.";
    return;
  }

  if (!window.jspdf) {
    $("statusMessage").textContent = "PDF library did not load. Check the internet connection and try again.";
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });

  const green = [132, 189, 0];
  const navy = [37, 55, 70];
  const charcoal = [75, 79, 84];
  const muted = [100, 106, 111];
  const lightGreen = [247, 250, 243];
  const border = [214, 220, 210];
  const left = 36;
  const right = 576;
  const pageWidth = 612;
  const selected = selectedType();

  let logoData = null;
  try {
    logoData = await loadImageAsDataUrl("101-mobility-logo.png");
  } catch (error) {
    console.warn(error);
  }

  function checkbox(x, y, checked) {
    doc.setDrawColor(...charcoal);
    doc.setLineWidth(0.9);
    doc.rect(x, y, 10, 10);
    if (checked) {
      doc.setLineWidth(1.5);
      doc.line(x + 2, y + 5, x + 4.5, y + 8);
      doc.line(x + 4.5, y + 8, x + 9, y + 2);
    }
  }

  function textOrLine(value) {
    return value && value.trim() ? value.trim() : "________________________";
  }

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 70, "F");

  if (logoData) {
    doc.addImage(logoData, "PNG", left, 18, 150, 32);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text("101 MOBILITY", left, 39);
  }

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RAMP QUOTE", 202, 40);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.text("101 Mobility of Miami  |  (754) 333-3894", right, 24, { align: "right" });
  doc.text("19555 Northeast 10th Avenue, Miami, FL 33179", right, 38, { align: "right" });
  doc.text("101mobility.com/miami", right, 52, { align: "right" });

  // Customer / ramp details in compact two-column block
  let y = 91;
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("CUSTOMER INFORMATION", left, y);
  doc.text("RAMP CONFIGURATION", 318, y);
  doc.setDrawColor(...green);
  doc.setLineWidth(1.4);
  doc.line(left, y + 5, 292, y + 5);
  doc.line(318, y + 5, right, y + 5);

  y += 20;
  doc.setFontSize(8.2);

  const customerRows = [
    ["Customer:", textOrLine(fields.customerName.value)],
    ["Address:", textOrLine(fields.customerAddress.value)],
    ["Consultant:", textOrLine(fields.consultantName.value)],
    ["Date:", new Date().toLocaleDateString("en-US")]
  ];

  customerRows.forEach(([label, value], index) => {
    const rowY = y + index * 15;
    doc.setFont("helvetica", "bold");
    doc.text(label, left, rowY);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(value, 185);
    doc.text(wrapped[0], 92, rowY);
  });

  const configRows = [
    [`Ramp Length: ${results.rampLength} linear ft`, `5 x 5: ${results.p55}`],
    [`5 x 4: ${results.p54}`, `4 x 4: ${results.p44}`],
    [`Total Square Feet: ${results.squareFeet.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, ""]
  ];

  configRows.forEach((row, index) => {
    const rowY = y + index * 18;
    doc.setFont(index === 2 ? "helvetica" : "helvetica", index === 2 ? "bold" : "normal");
    doc.text(row[0], 318, rowY);
    if (row[1]) doc.text(row[1], 475, rowY);
  });

  // Pricing choices - three equal columns
  y = 179;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("CUSTOMER OPTION SELECTION", left, y);
  doc.setDrawColor(...green);
  doc.line(left, y + 5, right, y + 5);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.3);
  doc.setTextColor(...muted);
  doc.text("Check the preferred option. The calculator selection is pre-marked and may be changed by hand.", left, y);

  y += 13;
  const gap = 8;
  const cardWidth = (right - left - gap * 2) / 3;
  const cardHeight = 142;

  const cards = [
    {
      type: "new",
      title: "NEW PURCHASE",
      rows: [
        ["Ramp", results.newRampPrice],
        ["Installation", results.purchaseInstallation]
      ],
      totalLabel: "TOTAL",
      total: results.newTotal,
      note: ""
    },
    {
      type: "used",
      title: "USED PURCHASE",
      rows: [
        ["Ramp", results.usedRampPrice],
        ["Installation", results.purchaseInstallation]
      ],
      totalLabel: "TOTAL",
      total: results.usedTotal,
      note: `${settings.usedRampDiscountPercent}% material discount`
    },
    {
      type: "rental",
      title: "RENTAL",
      rows: [
        ["First 3 months", results.monthlyRental * 3],
        ["Installation", results.rentalInstallation],
        ["Removal", results.rentalRemoval]
      ],
      totalLabel: "FIRST PAYMENT",
      total: results.rentalFirstPayment,
      note: `Month 4+: ${money(results.monthlyRental)}/mo`
    }
  ];

  cards.forEach((card, index) => {
    const x = left + index * (cardWidth + gap);

    doc.setFillColor(...lightGreen);
    doc.setDrawColor(...border);
    doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, "FD");

    checkbox(x + 10, y + 11, selected === card.type);

    doc.setTextColor(...charcoal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.text(card.title, x + 27, y + 20);

    let rowY = y + 47;
    doc.setFontSize(7.8);

    card.rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, x + 10, rowY);
      doc.setFont("helvetica", "bold");
      doc.text(money(value), x + cardWidth - 10, rowY, { align: "right" });
      rowY += 17;
    });

    const totalY = y + 112;
    doc.setDrawColor(200, 205, 198);
    doc.line(x + 10, totalY - 9, x + cardWidth - 10, totalY - 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(card.totalLabel, x + 10, totalY);
    doc.setTextColor(...green);
    doc.setFontSize(9.5);
    doc.text(money(card.total), x + cardWidth - 10, totalY, { align: "right" });

    if (card.note) {
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.text(card.note, x + 10, y + 132);
    }
  });

  // Deposit table for all options
  y += cardHeight + 16;
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`${settings.depositPercent}% DEPOSIT REQUIRED`, left, y);
  doc.setDrawColor(...green);
  doc.line(left, y + 5, right, y + 5);
  y += 18;

  const depositData = [
    ["New Purchase", results.newTotal],
    ["Used Purchase", results.usedTotal],
    ["Rental", results.rentalFirstPayment]
  ];

  const depColumnWidth = (right - left) / 3;
  depositData.forEach(([name, total], index) => {
    const x = left + index * depColumnWidth;
    const deposit = total * settings.depositPercent / 100;
    doc.setFillColor(index % 2 ? 248 : 244, 247, 242);
    doc.rect(x, y, depColumnWidth, 42, "F");
    doc.setTextColor(...charcoal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.6);
    doc.text(name, x + 10, y + 15);
    doc.setTextColor(...green);
    doc.setFontSize(11);
    doc.text(money(deposit), x + depColumnWidth - 10, y + 30, { align: "right" });
  });

  y += 56;

  // Notes, compact
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("NOTES", left, y);
  doc.setDrawColor(...green);
  doc.line(left, y + 5, right, y + 5);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  const noteText = fields.notes.value.trim() || "No additional notes.";
  const notes = doc.splitTextToSize(noteText, right - left);
  doc.text(notes.slice(0, 3), left, y);
  y += Math.max(24, Math.min(notes.length, 3) * 9) + 7;

  // Approval copy
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("CUSTOMER APPROVAL", left, y);
  doc.setDrawColor(...green);
  doc.line(left, y + 5, right, y + 5);
  y += 17;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.1);
  const approval =
    `I approve the option checked above and authorize 101 Mobility of Miami to proceed. ` +
    `I understand that a ${settings.depositPercent}% deposit based on the selected option is required to approve this quote and begin scheduling or ordering. ` +
    `Final installation is subject to site verification, product availability, applicable permits, and the written terms of this quote.`;
  const approvalLines = doc.splitTextToSize(approval, right - left);
  doc.text(approvalLines, left, y);
  y += approvalLines.length * 8.3 + 12;

  // Signature area
  const signatureData = signatureImageData();
  const printedName = $("signaturePrintedName").value.trim();
  const signatureDate = $("signatureDate").value
    ? new Date(`${$("signatureDate").value}T12:00:00`).toLocaleDateString("en-US")
    : "";

  const signatureBoxWidth = 315;
  const signatureBoxHeight = 70;

  doc.setDrawColor(150, 155, 158);
  doc.rect(left, y, signatureBoxWidth, signatureBoxHeight);

  if (signatureData) {
    doc.addImage(signatureData, "PNG", left + 8, y + 5, signatureBoxWidth - 16, 46);
  } else {
    doc.setTextColor(175, 178, 180);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Customer signature", left + 10, y + 34);
  }

  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Customer Digital Signature", left + 7, y + signatureBoxHeight - 7);

  const infoX = left + signatureBoxWidth + 18;
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.text("Printed Name:", infoX, y + 16);
  doc.setFont("helvetica", "normal");
  doc.text(printedName || "____________________", infoX, y + 30);

  doc.setFont("helvetica", "bold");
  doc.text("Approval Date:", infoX, y + 48);
  doc.setFont("helvetica", "normal");
  doc.text(signatureDate || "____________________", infoX, y + 62);

  // Footer
  doc.setTextColor(...muted);
  doc.setFontSize(6.5);
  doc.text(
    "This estimate is subject to final site verification, product availability, applicable permits, and written terms.",
    pageWidth / 2,
    774,
    { align: "center" }
  );

  const file = cleanFileName(fields.customerName.value || "Ramp-Quote");
  doc.save(`${file}.pdf`);
  $("statusMessage").textContent = "One-page PDF quote generated.";
}

function resetForm() {
  Object.values(fields).forEach(field => field.value = "");
  document.querySelector('input[name="quoteType"][value="new"]').checked = true;
  $("signaturePrintedName").value = "";
  $("signatureDate").value = "";
  clearSignature();
  $("statusMessage").textContent = "";
  calculate();
}

function showPinDialog() {
  $("pinInput").value = "";
  $("pinError").textContent = "";
  $("pinDialog").showModal();
  setTimeout(() => $("pinInput").focus(), 50);
}

function populateSettingsForm() {
  $("settingNewRate").value = settings.newRampPricePerSqft;
  $("settingUsedDiscount").value = settings.usedRampDiscountPercent;
  $("settingInstallRate").value = settings.purchaseInstallPerSqft;
  $("settingMinimumInstall").value = settings.minimumPurchaseInstall;
  $("settingRentalRate").value = settings.monthlyRentalPerSqft;
  $("settingRentalInstallRate").value = settings.rentalInstallPerSqft;
  $("settingMinimumRentalInstall").value = settings.minimumRentalInstall;
  $("settingRentalRemovalRate").value = settings.rentalRemovalPerSqft;
  $("settingMinimumRentalRemoval").value = settings.minimumRentalRemoval;
  $("settingDepositPercent").value = settings.depositPercent;
  $("settingAdminPin").value = settings.adminPin;
}

function saveSettingsFromForm() {
  settings = {
    newRampPricePerSqft: numberValue($("settingNewRate")),
    usedRampDiscountPercent: numberValue($("settingUsedDiscount")),
    purchaseInstallPerSqft: numberValue($("settingInstallRate")),
    minimumPurchaseInstall: numberValue($("settingMinimumInstall")),
    monthlyRentalPerSqft: numberValue($("settingRentalRate")),
    rentalInstallPerSqft: numberValue($("settingRentalInstallRate")),
    minimumRentalInstall: numberValue($("settingMinimumRentalInstall")),
    rentalRemovalPerSqft: numberValue($("settingRentalRemovalRate")),
    minimumRentalRemoval: numberValue($("settingMinimumRentalRemoval")),
    depositPercent: numberValue($("settingDepositPercent")),
    adminPin: $("settingAdminPin").value.trim() || DEFAULT_SETTINGS.adminPin
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  calculate();
  $("statusMessage").textContent = "Admin settings saved on this device.";
}

document.querySelectorAll("input, textarea").forEach(element => {
  if (!element.id.startsWith("setting") && element.id !== "pinInput") {
    element.addEventListener("input", calculate);
  }
});
document.querySelectorAll('input[name="quoteType"]').forEach(element => element.addEventListener("change", calculate));

$("copyButton").addEventListener("click", copySummary);
$("pdfButton").addEventListener("click", generatePdf);
$("resetButton").addEventListener("click", resetForm);
$("clearSignatureButton").addEventListener("click", clearSignature);
$("settingsButton").addEventListener("click", showPinDialog);

let titleTapCount = 0;
let titleTapTimer;
$("appTitle").addEventListener("click", () => {
  titleTapCount += 1;
  clearTimeout(titleTapTimer);
  titleTapTimer = setTimeout(() => titleTapCount = 0, 1500);
  if (titleTapCount >= 5) {
    titleTapCount = 0;
    showPinDialog();
  }
});

$("pinForm").addEventListener("submit", event => {
  event.preventDefault();
  if ($("pinInput").value === settings.adminPin) {
    $("pinDialog").close();
    populateSettingsForm();
    $("settingsDialog").showModal();
  } else {
    $("pinError").textContent = "Incorrect PIN.";
  }
});

$("settingsForm").addEventListener("submit", event => {
  event.preventDefault();
  saveSettingsFromForm();
  $("settingsDialog").close();
});

$("restoreDefaults").addEventListener("click", () => {
  settings = { ...DEFAULT_SETTINGS };
  localStorage.removeItem(SETTINGS_KEY);
  populateSettingsForm();
  calculate();
});

setupSignaturePad();
calculate();
