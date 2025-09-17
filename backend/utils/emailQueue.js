const { sendStudentCredentials } = require('./emailTemplates');
const { sendEmail } = require('./emailService');

class EmailQueue {
  constructor() {
    this.queue = [];
    this.errorQueue = [];
    this.isProcessing = false;
    this.rateLimit = 2000; // 2 seconds between emails (2 emails per second max)
    this.maxRetries = 3;
  }

  // Add email to queue
  addToQueue(emailData) {
    this.queue.push({
      ...emailData,
      attempts: 0,
      addedAt: new Date()
    });
    this.processQueue();
  }

  // Process the queue
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const emailData = this.queue[0];
      
      try {
        await sendStudentCredentials(
          emailData.to, 
          emailData.studentName, 
          emailData.email, 
          emailData.password
        );
        
        // Email sent successfully, remove from queue
        this.queue.shift();
        
        // Wait for rate limiting
        await new Promise(resolve => setTimeout(resolve, this.rateLimit));
        
      } catch (error) {
        console.error(`Failed to send email to ${emailData.to}:`, error);
        
        // Move to error queue if max retries reached
        if (emailData.attempts >= this.maxRetries) {
          this.errorQueue.push(this.queue.shift());
          console.error(`Max retries reached for ${emailData.to}, moved to error queue`);
        } else {
          // Increment attempts and wait before retrying
          this.queue[0].attempts++;
          console.log(`Will retry ${emailData.to} in 30 seconds (attempt ${emailData.attempts})`);
          
          // Move to end of queue for retry after delay
          this.queue.push(this.queue.shift());
          await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds before next try
        }
      }
    }
    
    this.isProcessing = false;
    
    // Process error queue if there are items
    if (this.errorQueue.length > 0) {
      this.processErrorQueue();
    }
  }

  // Process error queue (for manual review)
  processErrorQueue() {
    console.error(`${this.errorQueue.length} emails failed to send after multiple attempts:`);
    this.errorQueue.forEach(item => {
      console.error(`- ${item.to}: ${item.studentName} (${item.email})`);
    });
    
    // In a real application, you might want to save these to a database for manual intervention
  }
}

// Create a singleton instance
const emailQueue = new EmailQueue();

module.exports = emailQueue;