import type { MappingDocument } from '../context/MappingContext';


// 1. Generate Plain Markdown Table
export function generateMarkdownTable(doc: MappingDocument): string {
  const activePOs = doc.programOutcomes;
  const activePSOs = doc.psoEnabled ? doc.psos : [];
  
  // Headers
  let headerRow = `| CO/PO | ` + activePOs.map(po => po.id).join(' | ');
  if (activePSOs.length > 0) {
    headerRow += ` | ` + activePSOs.map(pso => pso.id).join(' | ');
  }
  headerRow += ` |`;

  // Divider
  let dividerRow = `|:---|` + activePOs.map(() => ':---:').join('|');
  if (activePSOs.length > 0) {
    dividerRow += `|` + activePSOs.map(() => ':---:').join('|');
  }
  dividerRow += `|`;

  // Data rows
  const dataRows = doc.courseOutcomes
    .filter(co => co.description.trim() !== '')
    .map(co => {
      let row = `| **${co.id}** | ` + activePOs.map(po => doc.matrix[co.id]?.[po.id] || '-').join(' | ');
      if (activePSOs.length > 0) {
        row += ` | ` + activePSOs.map(pso => doc.matrix[co.id]?.[pso.id] || '-').join(' | ');
      }
      row += ` |`;
      return row;
    });

  return [headerRow, dividerRow, ...dataRows].join('\n');
}

// Helper to calculate PO and PSO column averages
export function calculateAverages(doc: MappingDocument) {
  const pos: Record<string, string> = {};
  const psos: Record<string, string> = {};
  const activeCOs = doc.courseOutcomes.filter(co => co.description.trim() !== '');

  doc.programOutcomes.forEach(po => {
    let sum = 0;
    let count = 0;
    activeCOs.forEach(co => {
      const val = doc.matrix[co.id]?.[po.id];
      if (typeof val === 'number') {
        sum += val;
        count++;
      }
    });
    pos[po.id] = count > 0 ? (sum / count).toFixed(2) : '';
  });

  if (doc.psoEnabled) {
    doc.psos.forEach(pso => {
      let sum = 0;
      let count = 0;
      activeCOs.forEach(co => {
        const val = doc.matrix[co.id]?.[pso.id];
        if (typeof val === 'number') {
          sum += val;
          count++;
        }
      });
      psos[pso.id] = count > 0 ? (sum / count).toFixed(2) : '';
    });
  }

  return { pos, psos };
}

// 2. Generate Styled HTML Table for Clipboard pasting
export function generateHTMLTable(doc: MappingDocument, includeStyles = true): string {
  const activePOs = doc.programOutcomes;
  const activePSOs = doc.psoEnabled ? doc.psos : [];
  const activeCOs = doc.courseOutcomes.filter(co => co.description.trim() !== '');

  const tableStyle = includeStyles 
    ? 'style="border-collapse: collapse; border: 1px solid #000000; font-family: \'Times New Roman\', Times, serif; font-size: 14px; margin: 10px 0; color: #000000; width: 100%;"' 
    : '';
  const thStyle = includeStyles 
    ? 'style="border: 1px solid #000000; background-color: #ffffff; padding: 10px; text-align: center; font-weight: bold; color: #000000; font-family: \'Times New Roman\', Times, serif;"' 
    : '';
  const tdStyle = includeStyles 
    ? 'style="border: 1px solid #000000; padding: 10px; text-align: center; font-weight: bold; color: #000000; background-color: #ffffff; font-family: \'Times New Roman\', Times, serif;"' 
    : '';

  let html = `<table ${tableStyle}>\n<thead>\n<tr>\n`;
  html += `<th ${thStyle}>CO/PO</th>\n`;
  activePOs.forEach(po => {
    html += `<th ${thStyle} title="${po.name}">${po.id}</th>\n`;
  });
  activePSOs.forEach(pso => {
    html += `<th ${thStyle} title="${pso.name}">${pso.id}</th>\n`;
  });
  html += `</tr>\n</thead>\n<tbody>\n`;

  activeCOs.forEach(co => {
    html += `<tr>\n`;
    html += `<td ${tdStyle}>${co.id}</td>\n`;
    
    activePOs.forEach(po => {
      const val = doc.matrix[co.id]?.[po.id] || '-';
      html += `<td ${tdStyle}>${val}</td>\n`;
    });

    activePSOs.forEach(pso => {
      const val = doc.matrix[co.id]?.[pso.id] || '-';
      html += `<td ${tdStyle}>${val}</td>\n`;
    });
    
    html += `</tr>\n`;
  });

  html += `</tbody>\n</table>`;
  return html;
}

// 3. Multi-Format Clipboard Copier
export async function copyTableToClipboard(
  doc: MappingDocument, 
  type: 'html' | 'markdown' | 'word' | 'excel' | 'rtf'
): Promise<boolean> {
  try {
    const markdown = generateMarkdownTable(doc);
    const htmlTable = generateHTMLTable(doc, true);
    
    if (type === 'markdown') {
      await navigator.clipboard.writeText(markdown);
      return true;
    }

    // Wrap in standard HTML headers to ensure styles carry over to MS Office
    const richHTML = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { border: 1px solid #94a3b8; background-color: #f1f5f9; padding: 8px; text-align: center; }
          td { border: 1px solid #cbd5e1; padding: 6px; text-align: center; }
        </style>
      </head>
      <body>
        ${htmlTable}
      </body>
      </html>
    `;

    const blobText = new Blob([markdown], { type: 'text/plain' });
    const blobHtml = new Blob([richHTML], { type: 'text/html' });

    // Use ClipboardItem to load both plain text and rich HTML
    const clipboardItem = new ClipboardItem({
      'text/plain': blobText,
      'text/html': blobHtml
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    // Fallback to text copy
    try {
      const markdown = generateMarkdownTable(doc);
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch (_) {
      return false;
    }
  }
}

// 4. Trigger Direct File Downloads (CSV)
export function exportToCSV(doc: MappingDocument) {
  const activePOs = doc.programOutcomes;
  const activePSOs = doc.psoEnabled ? doc.psos : [];
  const activeCOs = doc.courseOutcomes.filter(co => co.description.trim() !== '');

  // Headers
  const headers = ['CO/PO', ...activePOs.map(po => po.id), ...activePSOs.map(pso => pso.id)];
  
  const rows = activeCOs.map(co => {
    return [
      co.id,
      ...activePOs.map(po => doc.matrix[co.id]?.[po.id] || '-'),
      ...activePSOs.map(pso => doc.matrix[co.id]?.[pso.id] || '-')
    ];
  });

  const csvContent = [headers, ...rows]
    .map(r => r.map(val => `"${val}"`).join(','))
    .join('\n');

  downloadFile(csvContent, `${doc.subjectCode || 'CO_PO'}_Mapping.csv`, 'text/csv;charset=utf-8;');
}

// 5. Export to Excel (re-named HTML format compatible with Excel loading)
export function exportToExcel(doc: MappingDocument) {
  const htmlTable = generateHTMLTable(doc, true);
  const metadataHtml = `
    <h3 style="font-family: 'Times New Roman', Times, serif; margin: 0 0 5px;">Subject Mapping Report</h3>
    <table style="font-family: 'Times New Roman', Times, serif; font-size: 12px; margin-bottom: 20px; border-collapse: collapse;">
      <tr><td><b>Subject:</b></td><td>${doc.subjectName}</td><td><b>Code:</b></td><td>${doc.subjectCode}</td></tr>
      <tr><td><b>Dept:</b></td><td>${doc.department}</td><td><b>Faculty:</b></td><td>${doc.facultyName}</td></tr>
      <tr><td><b>Regulation:</b></td><td>${doc.regulation}</td><td><b>Academic Year:</b></td><td>${doc.academicYear}</td></tr>
    </table>
    <h3 style="font-family: 'Times New Roman', Times, serif; font-weight: bold; margin: 10px 0 5px;">MAPPING OF CO’S& PO’S:</h3>
  `;

  const excelWrapper = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>CO-PO Mapping</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      ${metadataHtml}
      ${htmlTable}
    </body>
    </html>
  `;

  downloadFile(excelWrapper, `${doc.subjectCode || 'CO_PO'}_Mapping.xls`, 'application/vnd.ms-excel');
}

// 6. Export to Word (styled HTML wrap that MS Word loads as native tables)
export function exportToWord(doc: MappingDocument) {
  const htmlTable = generateHTMLTable(doc, true);
  
  // Format Course Outcomes list for cover-sheet
  const cosList = doc.courseOutcomes
    .filter(co => co.description.trim() !== '')
    .map(co => `<p style="margin: 4px 0; font-size: 11pt;"><b>${co.id}:</b> ${co.description}</p>`)
    .join('');

  const wordWrapper = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>CO-PO Mapping Sheet</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; padding: 20px; color: #000000; }
        h2 { color: #000000; font-size: 18pt; border-bottom: 2px solid #000000; padding-bottom: 5px; }
        h3 { color: #000000; font-size: 14pt; margin-top: 20px; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; font-family: 'Times New Roman', Times, serif; }
        th { border: 1px solid #000000; background-color: #ffffff; padding: 8px; text-align: center; font-weight: bold; color: #000000; }
        td { border: 1px solid #000000; padding: 6px; text-align: center; font-weight: bold; color: #000000; background-color: #ffffff; }
      </style>
    </head>
    <body>
      <h2>CO–PO and CO–PSO Mapping Report</h2>
      
      <table style="border: 0; width: 100%; margin-bottom: 20px;">
        <tr style="border: 0;"><td style="border: 0; text-align: left; width: 15%;"><b>Subject Name:</b></td><td style="border: 0; text-align: left;">${doc.subjectName}</td></tr>
        <tr style="border: 0;"><td style="border: 0; text-align: left;"><b>Subject Code:</b></td><td style="border: 0; text-align: left;">${doc.subjectCode}</td></tr>
        <tr style="border: 0;"><td style="border: 0; text-align: left;"><b>Department:</b></td><td style="border: 0; text-align: left;">${doc.department}</td></tr>
        <tr style="border: 0;"><td style="border: 0; text-align: left;"><b>Faculty Name:</b></td><td style="border: 0; text-align: left;">${doc.facultyName}</td></tr>
        <tr style="border: 0;"><td style="border: 0; text-align: left;"><b>Credits:</b></td><td style="border: 0; text-align: left;">${doc.credits}</td></tr>
        <tr style="border: 0;"><td style="border: 0; text-align: left;"><b>Regulation:</b></td><td style="border: 0; text-align: left;">${doc.regulation}</td></tr>
      </table>

      <h3>Course Outcomes</h3>
      ${cosList}

      <h3>MAPPING OF CO’S& PO’S:</h3>
      ${htmlTable}

      <p style="margin-top: 50px; font-size: 10pt; color: #64748b; text-align: right;">Report generated via OBE-MapAI.</p>
    </body>
    </html>
  `;

  downloadFile(wordWrapper, `${doc.subjectCode || 'CO_PO'}_Mapping_Report.doc`, 'application/msword');
}

// Low-level helper to trigger browser download
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
