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
const EMBEDDED_LOGO_DATA = "data:image/png;base64,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";
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


function generatePdf() {
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

  const logoData = EMBEDDED_LOGO_DATA;

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
$("pdfButton").addEventListener("click", () => {
  try {
    generatePdf();
  } catch (error) {
    console.error("PDF generation failed:", error);
    $("statusMessage").textContent =
      "PDF could not be generated. Refresh the page and try again. " +
      (error && error.message ? error.message : "");
  }
});
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
