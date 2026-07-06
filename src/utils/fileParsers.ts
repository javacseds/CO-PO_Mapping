// Utility to load external scripts dynamically for browser-side file parsing
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

// Extract text from standard TXT files
export function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string || '');
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

// Extract text from PDF files using client-side PDF.js
export async function parsePdfFile(file: File): Promise<string> {
  try {
    // Dynamically load PDF.js from cdnjs
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
    
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      throw new Error('PDF.js library failed to initialize.');
    }
    
    // Set up worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            reject(new Error('Failed to read file as ArrayBuffer.'));
            return;
          }
          
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error('PDF parsing setup failed:', error);
    throw new Error('Failed to parse PDF. Please ensure you are online to load the PDF parser script, or copy-paste the syllabus text instead.');
  }
}

// Extract text from DOCX files using client-side Mammoth.js
export async function parseDocxFile(file: File): Promise<string> {
  try {
    // Dynamically load Mammoth.js from cdnjs
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    
    const mammoth = (window as any).mammoth;
    if (!mammoth) {
      throw new Error('Mammoth.js library failed to initialize.');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            reject(new Error('Failed to read file as ArrayBuffer.'));
            return;
          }
          
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value || '');
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error('DOCX parsing setup failed:', error);
    throw new Error('Failed to parse Word Document. Please ensure you are online to load the Word parser script, or copy-paste the syllabus text instead.');
  }
}

// Combined parser routers
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return parseTxtFile(file);
    case 'pdf':
      return parsePdfFile(file);
    case 'docx':
      return parseDocxFile(file);
    default:
      throw new Error(`Unsupported file type: .${extension}. Please upload a .txt, .pdf, or .docx file.`);
  }
}
