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

const $ = (id) => document.getElementById(id);
const fields = {
  customerName: $("customerName"),
  customerAddress: $("customerAddress"),
  consultantName: $("consultantName"),
  quoteNumber: $("quoteNumber"),
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
Quote Number: ${fields.quoteNumber.value || ""}

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
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const green = [141, 198, 63];
  const charcoal = [75, 79, 84];
  const muted = [100, 106, 111];
  const lightGreen = [245, 249, 239];
  const left = 54;
  const right = 558;
  let y = 46;

  const selected = selectedType();

  function checkbox(x, yPos, checked = false) {
    doc.setDrawColor(...charcoal);
    doc.setLineWidth(1);
    doc.rect(x, yPos - 9, 12, 12);
    if (checked) {
      doc.setLineWidth(1.7);
      doc.line(x + 2, yPos - 3, x + 5, yPos);
      doc.line(x + 5, yPos, x + 10, yPos - 7);
    }
  }

  function optionBox(title, type, lines, total, extraLine = "") {
    const checked = selected === type;
    const boxHeight = 78 + (lines.length * 18) + (extraLine ? 16 : 0);

    doc.setFillColor(...lightGreen);
    doc.setDrawColor(220, 224, 218);
    doc.roundedRect(left, y, right - left, boxHeight, 6, 6, "FD");

    checkbox(left + 14, y + 24, checked);

    doc.setTextColor(...charcoal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, left + 34, y + 24);

    let rowY = y + 46;
    doc.setFontSize(9);

    lines.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, left + 14, rowY);
      doc.setFont("helvetica", "bold");
      doc.text(money(value), right - 14, rowY, { align: "right" });
      rowY += 18;
    });

    doc.setDrawColor(205, 210, 205);
    doc.line(left + 14, rowY - 8, right - 14, rowY - 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(type === "rental" ? "First Payment" : "Total", left + 14, rowY + 6);
    doc.setTextColor(...green);
    doc.text(money(total), right - 14, rowY + 6, { align: "right" });
    doc.setTextColor(...charcoal);

    if (extraLine) {
      rowY += 20;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(extraLine, left + 14, rowY);
    }

    y += boxHeight + 10;
  }

  // Header
  doc.setFillColor(...charcoal);
  doc.rect(0, 0, 612, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("101 MOBILITY", left, 42);
  doc.setTextColor(...green);
  doc.setFontSize(14);
  doc.text("Ramp Quote", left, 67);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("101 Mobility of Miami | (754) 333-3894", right, 42, { align: "right" });
  doc.text("19555 Northeast 10th Avenue, Miami, FL 33179", right, 59, { align: "right" });
  doc.text("101mobility.com/miami", right, 76, { align: "right" });

  y = 120;
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER INFORMATION", left, y);
  doc.setDrawColor(...green);
  doc.setLineWidth(2);
  doc.line(left, y + 6, right, y + 6);

  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const info = [
    ["Customer Name", fields.customerName.value || ""],
    ["Installation Address", fields.customerAddress.value || ""],
    ["Mobility Consultant", fields.consultantName.value || ""],
    ["Quote Number", fields.quoteNumber.value || ""],
    ["Quote Date", new Date().toLocaleDateString("en-US")]
  ];

  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, left, y);
    doc.setFont("helvetica", "normal");
    const displayValue = value || "____________________________";
    const wrapped = doc.splitTextToSize(displayValue, 370);
    doc.text(wrapped, 165, y);
    y += Math.max(18, wrapped.length * 12);
  });

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RAMP CONFIGURATION", left, y);
  doc.line(left, y + 6, right, y + 6);

  y += 27;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Ramp Length: ${results.rampLength} linear ft`, left, y);
  doc.text(`5 x 5 Platforms: ${results.p55}`, 250, y);
  doc.text(`5 x 4 Platforms: ${results.p54}`, 405, y);
  y += 18;
  doc.text(`4 x 4 Platforms: ${results.p44}`, left, y);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Square Feet: ${results.squareFeet.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    250,
    y
  );

  y += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER OPTION SELECTION", left, y);
  doc.line(left, y + 6, right, y + 6);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  doc.text(
    "Please check the preferred option below. The option selected in the calculator is pre-marked but may be changed by hand.",
    left,
    y
  );
  doc.setTextColor(...charcoal);
  y += 16;

  optionBox(
    "NEW RAMP PURCHASE",
    "new",
    [
      ["New Ramp Price", results.newRampPrice],
      ["Installation", results.purchaseInstallation]
    ],
    results.newTotal
  );

  optionBox(
    "USED RAMP PURCHASE",
    "used",
    [
      ["Used Ramp Price", results.usedRampPrice],
      ["Installation", results.purchaseInstallation]
    ],
    results.usedTotal,
    `${settings.usedRampDiscountPercent}% discount from new ramp material price.`
  );

  optionBox(
    "RAMP RENTAL",
    "rental",
    [
      ["First 3 Months", results.monthlyRental * 3],
      ["Installation", results.rentalInstallation],
      ["Removal", results.rentalRemoval]
    ],
    results.rentalFirstPayment,
    `Ongoing monthly payment beginning Month 4: ${money(results.monthlyRental)}`
  );

  // Deposit section based on the option currently selected in the calculator.
  const selectedQuote = getSelectedQuote(results);
  const deposit = selectedQuote.total * settings.depositPercent / 100;
  const balance = selectedQuote.total - deposit;

  if (y > 590) {
    doc.addPage();
    y = 54;
  }

  doc.setFillColor(...green);
  doc.roundedRect(left, y, right - left, 72, 6, 6, "F");
  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `${settings.depositPercent}% DEPOSIT FOR THE OPTION SELECTED ABOVE`,
    left + 14,
    y + 22
  );
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Calculator selection: ${selectedQuote.name}`,
    left + 14,
    y + 40
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(money(deposit), right - 14, y + 26, { align: "right" });
  doc.setFontSize(9);
  doc.text(`Remaining balance: ${money(balance)}`, right - 14, y + 49, { align: "right" });
  y += 92;

  if (fields.notes.value.trim()) {
    doc.setTextColor(...charcoal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("NOTES", left, y);
    doc.line(left, y + 6, right, y + 6);
    y += 25;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const notes = doc.splitTextToSize(fields.notes.value.trim(), right - left);
    doc.text(notes, left, y);
    y += notes.length * 12 + 16;
  }

  if (y > 610) {
    doc.addPage();
    y = 54;
  }

  doc.setTextColor(...charcoal);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER APPROVAL", left, y);
  doc.line(left, y + 6, right, y + 6);
  y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const approval =
    `I approve the option checked above and authorize 101 Mobility of Miami to proceed. ` +
    `I understand that a ${settings.depositPercent}% deposit is required to approve the quote and begin scheduling or ordering. ` +
    `The deposit amount will be based on the option selected above. Final installation is subject to site verification and the terms stated in this quote.`;

  const approvalLines = doc.splitTextToSize(approval, right - left);
  doc.text(approvalLines, left, y);
  y += approvalLines.length * 12 + 32;

  doc.setDrawColor(...charcoal);
  doc.line(left, y, 350, y);
  doc.line(410, y, right, y);
  doc.setFontSize(9);
  doc.text("Customer Signature", left, y + 15);
  doc.text("Date", 410, y + 15);

  y += 52;
  doc.line(left, y, 350, y);
  doc.line(410, y, right, y);
  doc.text("Printed Name", left, y + 15);
  doc.text("Mobility Consultant", 410, y + 15);

  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(
    "This quote is an estimate and is subject to final site verification, product availability, applicable permits, and written terms.",
    306,
    758,
    { align: "center" }
  );

  const file = cleanFileName(fields.quoteNumber.value || fields.customerName.value || "Ramp-Quote");
  doc.save(`${file}.pdf`);
  $("statusMessage").textContent = "PDF quote generated.";
}

function resetForm() {
  Object.values(fields).forEach(field => field.value = "");
  document.querySelector('input[name="quoteType"][value="new"]').checked = true;
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

calculate();
