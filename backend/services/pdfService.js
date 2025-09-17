// const puppeteer = require('puppeteer');

// class PDFService {
//   async generateQuizPDF(quiz, questions) {
//     let browser;
//     try {
//       browser = await puppeteer.launch({ 
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//       });
//       const page = await browser.newPage();

//       // Generate HTML content for the quiz
//       const htmlContent = this.generateQuizHTML(quiz, questions);
      
//       await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
//       const pdfBuffer = await page.pdf({
//         format: 'A4',
//         printBackground: true,
//         margin: {
//           top: '20mm',
//           right: '20mm',
//           bottom: '20mm',
//           left: '20mm'
//         }
//       });

//       return pdfBuffer;
//     } catch (error) {
//       console.error('PDF generation error:', error);
//       throw new Error('Failed to generate PDF');
//     } finally {
//       if (browser) {
//         await browser.close();
//       }
//     }
//   }

//   generateQuizHTML(quiz, questions) {
//     const currentDate = new Date().toLocaleDateString();
    
//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>${quiz.title}</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           text-align: center;
//           border-bottom: 2px solid #667eea;
//           padding-bottom: 20px;
//           margin-bottom: 30px;
//         }
//         .quiz-title {
//           font-size: 24px;
//           font-weight: bold;
//           color: #667eea;
//           margin-bottom: 10px;
//         }
//         .quiz-info {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 20px;
//           font-size: 14px;
//           color: #666;
//         }
//         .question {
//           margin-bottom: 25px;
//           padding: 15px;
//           border: 1px solid #e0e0e0;
//           border-radius: 8px;
//           background-color: #f9f9f9;
//         }
//         .question-number {
//           font-weight: bold;
//           color: #667eea;
//           margin-bottom: 10px;
//         }
//         .question-text {
//           margin-bottom: 15px;
//           font-size: 16px;
//         }
//         .options {
//           margin-left: 20px;
//         }
//         .option {
//           margin-bottom: 8px;
//           padding: 5px 0;
//         }
//         .option-label {
//           font-weight: bold;
//           margin-right: 10px;
//         }
//         .instructions {
//           background-color: #e3f2fd;
//           padding: 15px;
//           border-radius: 8px;
//           margin-bottom: 30px;
//           border-left: 4px solid #2196f3;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 12px;
//           color: #666;
//           border-top: 1px solid #e0e0e0;
//           padding-top: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="quiz-title">${quiz.title}</div>
//         <div class="quiz-info">
//           <span><strong>Subject:</strong> ${quiz.subject || 'N/A'}</span>
//           <span><strong>Topic:</strong> ${quiz.topic || 'N/A'}</span>
//           <span><strong>Difficulty:</strong> ${quiz.difficulty || 'N/A'}</span>
//           <span><strong>Date:</strong> ${currentDate}</span>
//         </div>
//       </div>

//       <div class="instructions">
//         <h3>Instructions:</h3>
//         <ul>
//           <li>Read each question carefully before answering</li>
//           <li>Choose the best answer for each question</li>
//           <li>Time Limit: ${quiz.timeLimit || 30} minutes</li>
//           <li>Total Questions: ${questions.length}</li>
//           ${quiz.passingScore ? `<li>Passing Score: ${quiz.passingScore}%</li>` : ''}
//         </ul>
//       </div>

//       ${questions.map((question, index) => `
//         <div class="question">
//           <div class="question-number">Question ${index + 1}:</div>
//           <div class="question-text">${question.question}</div>
//           <div class="options">
//             ${question.options.map((option, optIndex) => `
//               <div class="option">
//                 <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
//                 ${option.text || ''}
//                 ${option.imageURL ? `<br><img src="${option.imageURL}" style="max-width: 200px; height: auto; margin-top: 5px;">` : ''}
//               </div>
//             `).join('')}
//           </div>
//         </div>
//       `).join('')}

//       <div class="footer">
//         <p>Generated on ${currentDate} | Total Questions: ${questions.length}</p>
//       </div>
//     </body>
//     </html>
//     `;
//   }
// }

// module.exports = new PDFService();








const puppeteer = require('puppeteer');
const path = require('path');

class PDFService {
  async generateQuizPDF(quiz, questions) {
    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Generate HTML content
      const htmlContent = this.generateHTMLContent(quiz, questions);
      
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '50px',
          right: '50px',
          bottom: '50px',
          left: '50px'
        },
        printBackground: true
      });
      
      await browser.close();
      
      return pdfBuffer;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  generateHTMLContent(quiz, questions) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2c5282;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2c5282;
            margin: 0;
            font-size: 24px;
          }
          .header p {
            color: #4a5568;
            margin: 5px 0 0 0;
          }
          .quiz-info {
            margin-bottom: 30px;
          }
          .quiz-info p {
            margin: 5px 0;
          }
          .question {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .question-number {
            font-weight: bold;
            color: #2d3748;
          }
          .question-text {
            margin: 10px 0;
          }
          .options {
            margin-left: 20px;
          }
          .option {
            margin: 5px 0;
          }
          .answer-space {
            margin: 15px 0;
            border: 1px dashed #ccc;
            padding: 10px;
            min-height: 100px;
          }
          .marks {
            font-style: italic;
            color: #718096;
            font-size: 12px;
          }
          .explanation {
            font-style: italic;
            color: #718096;
            font-size: 11px;
            margin-top: 10px;
            border-left: 3px solid #e2e8f0;
            padding-left: 10px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
          }
          @media print {
            .question {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EDUQUEST ACADEMY</h1>
          <p>Quality Education for Tomorrow's Leaders</p>
        </div>
        
        <div class="quiz-info">
          <h2>${quiz.title}</h2>
          <p><strong>Subject:</strong> ${quiz.subject}</p>
          ${quiz.topic ? `<p><strong>Topic:</strong> ${quiz.topic}</p>` : ''}
          <p><strong>Difficulty:</strong> ${quiz.difficulty}</p>
          ${quiz.timeLimit > 0 ? `<p><strong>Time Limit:</strong> ${quiz.timeLimit} minutes</p>` : ''}
          ${quiz.passingScore > 0 ? `<p><strong>Passing Score:</strong> ${quiz.passingScore}%</p>` : ''}
          ${quiz.description ? `<p><strong>Description:</strong> ${quiz.description}</p>` : ''}
        </div>
        
        ${questions.map((question, index) => `
          <div class="question">
            <div class="question-number">Q${index + 1}.</div>
            <div class="question-text">${question.question}</div>
            <div class="marks">[${question.marks} mark${question.marks !== 1 ? 's' : ''}]</div>
            
            ${['Multiple Choice', 'True/False'].includes(question.questionType) && question.options && question.options.length > 0 ? `
              <div class="options">
                ${question.options.map((option, optIndex) => `
                  <div class="option">
                    ${String.fromCharCode(65 + optIndex)}. ${option.text || ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${!['Multiple Choice', 'True/False'].includes(question.questionType) ? `
              <div class="answer-space">
                <p><strong>Answer:</strong></p>
                <br><br><br><br><br>
              </div>
            ` : ''}
            
            ${question.explanation ? `
              <div class="explanation">
                <strong>Explanation:</strong> ${question.explanation}
              </div>
            ` : ''}
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleDateString()} | Created by: ${quiz.user?.name || 'Teacher'}</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new PDFService();
