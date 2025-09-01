export interface PdfParseResult {
  success: boolean;
  candidateEmail?: string;
  error?: string;
}

/**
 * Calls the PDF parser Firebase Function to extract candidate email from PDF
 * @param pdfUrl - The Firebase Storage URL of the uploaded PDF
 * @param uid - The user ID for logging purposes
 * @returns Promise<PdfParseResult>
 */
export async function parsePdfForEmail(pdfUrl: string, uid: string): Promise<PdfParseResult> {
  try {
    const response = await fetch('https://parsepdfforemail-fvtj5v3sya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfUrl,
        uid,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to parse PDF',
    };
  }
} 