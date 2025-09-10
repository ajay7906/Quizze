const puppeteer = require('puppeteer');

class PDFService {
  async generateQuizPDF(quiz, questions) {
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();

      // Generate HTML content for the quiz
      const htmlContent = this.generateQuizHTML(quiz, questions);
      
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      return pdfBuffer;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  generateQuizHTML(quiz, questions) {
    const currentDate = new Date().toLocaleDateString();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${quiz.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #667eea;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .quiz-title {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        .quiz-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;
        }
        .question {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .question-number {
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        .question-text {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .options {
          margin-left: 20px;
        }
        .option {
          margin-bottom: 8px;
          padding: 5px 0;
        }
        .option-label {
          font-weight: bold;
          margin-right: 10px;
        }
        .instructions {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
          border-left: 4px solid #2196f3;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="quiz-title">${quiz.title}</div>
        <div class="quiz-info">
          <span><strong>Subject:</strong> ${quiz.subject || 'N/A'}</span>
          <span><strong>Topic:</strong> ${quiz.topic || 'N/A'}</span>
          <span><strong>Difficulty:</strong> ${quiz.difficulty || 'N/A'}</span>
          <span><strong>Date:</strong> ${currentDate}</span>
        </div>
      </div>

      <div class="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Read each question carefully before answering</li>
          <li>Choose the best answer for each question</li>
          <li>Time Limit: ${quiz.timeLimit || 30} minutes</li>
          <li>Total Questions: ${questions.length}</li>
          ${quiz.passingScore ? `<li>Passing Score: ${quiz.passingScore}%</li>` : ''}
        </ul>
      </div>

      ${questions.map((question, index) => `
        <div class="question">
          <div class="question-number">Question ${index + 1}:</div>
          <div class="question-text">${question.question}</div>
          <div class="options">
            ${question.options.map((option, optIndex) => `
              <div class="option">
                <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
                ${option.text || ''}
                ${option.imageURL ? `<br><img src="${option.imageURL}" style="max-width: 200px; height: auto; margin-top: 5px;">` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div class="footer">
        <p>Generated on ${currentDate} | Total Questions: ${questions.length}</p>
      </div>
    </body>
    </html>
    `;
  }
}

module.exports = new PDFService();
