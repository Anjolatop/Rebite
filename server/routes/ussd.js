const express = require('express');
const db = require('../config/database');

const router = express.Router();

// USSD webhook handler
router.post('/hook', async (req, res) => {
  try {
    const { 
      sessionId, 
      serviceCode, 
      phoneNumber, 
      text 
    } = req.body;

    let response = '';

    if (text === '') {
      // Initial menu
      response = `CON Welcome to Rebite Food Rescue!
      
1. View rescued food
2. My Goals
3. My Points
4. Gift / Donate
5. Place Order
6. Help`;

    } else {
      const textArray = text.split('*');
      const level = textArray.length;
      const userInput = textArray[level - 1];

      switch (level) {
        case 1:
          switch (userInput) {
            case '1':
              // View rescued food
              response = `CON Available rescued food:
              
1. Fresh Tomatoes - $2.50 (Expires: 2 days)
2. Organic Bread - $1.00 (Expires: 1 day)
3. Local Vegetables - $3.00 (Expires: 3 days)
4. Back to main menu

Enter option number:`;
              break;

            case '2':
              // My Goals
              response = `CON Your Goals:
              
1. Weight Loss - 15 lbs remaining
2. Budget Friendly - $50 saved this month
3. Sustainable - 25 items rescued
4. Back to main menu

Enter option number:`;
              break;

            case '3':
              // My Points
              response = `CON Your Points:
              
Current Balance: 150 points
Earned: 200 points
Spent: 50 points

1. View transactions
2. Back to main menu

Enter option number:`;
              break;

            case '4':
              // Gift / Donate
              response = `CON Gift or Donate Points:
              
1. Gift points to friend
2. Donate to food bank
3. Back to main menu

Enter option number:`;
              break;

            case '5':
              // Place Order
              response = `CON Place Order:
              
1. Tomatoes (2 lbs) - $5.00
2. Bread (1 loaf) - $2.00
3. Vegetables (1 bag) - $6.00

Enter item number to order:`;
              break;

            case '6':
              // Help
              response = `END Rebite Help:
              
Text 1 to view rescued food
Text 2 to check your goals
Text 3 to see your points
Text 4 to gift or donate
Text 5 to place an order

For support: support@rebite.com`;
              break;

            default:
              response = `END Invalid option. Please try again.`;
          }
          break;

        case 2:
          const firstChoice = textArray[0];
          
          switch (firstChoice) {
            case '1':
              // View rescued food - item details
              switch (userInput) {
                case '1':
                  response = `END Fresh Tomatoes:
                  
Price: $2.50
Quantity: 2 lbs
Expires: 2 days
Rescue Score: 85
Location: Local Farm

To order, text 5 from main menu.`;
                  break;

                case '2':
                  response = `END Organic Bread:
                  
Price: $1.00
Quantity: 1 loaf
Expires: 1 day
Rescue Score: 95
Location: Local Bakery

To order, text 5 from main menu.`;
                  break;

                case '3':
                  response = `END Local Vegetables:
                  
Price: $3.00
Quantity: 1 bag
Expires: 3 days
Rescue Score: 75
Location: Community Garden

To order, text 5 from main menu.`;
                  break;

                case '4':
                  response = `CON Welcome to Rebite Food Rescue!
                  
1. View rescued food
2. My Goals
3. My Points
4. Gift / Donate
5. Place Order
6. Help`;
                  break;

                default:
                  response = `END Invalid option. Please try again.`;
              }
              break;

            case '2':
              // My Goals - goal details
              switch (userInput) {
                case '1':
                  response = `END Weight Loss Goal:
                  
Target: Lose 50 lbs
Current: Lost 35 lbs
Remaining: 15 lbs
Progress: 70%

Keep up the great work!`;
                  break;

                case '2':
                  response = `END Budget Friendly Goal:
                  
Target: Save $100/month
Current: Saved $50
Remaining: $50
Progress: 50%

You're halfway there!`;
                  break;

                case '3':
                  response = `END Sustainable Goal:
                  
Target: Rescue 50 items
Current: Rescued 25 items
Remaining: 25 items
Progress: 50%

Great job helping the environment!`;
                  break;

                case '4':
                  response = `CON Welcome to Rebite Food Rescue!
                  
1. View rescued food
2. My Goals
3. My Points
4. Gift / Donate
5. Place Order
6. Help`;
                  break;

                default:
                  response = `END Invalid option. Please try again.`;
              }
              break;

            case '3':
              // My Points - points details
              switch (userInput) {
                case '1':
                  response = `END Recent Transactions:
                  
+10 points - Rescue bonus
+5 points - Discipline value
+15 points - Mindfulness value
-20 points - Gifted to friend

Total: +10 points`;
                  break;

                case '2':
                  response = `CON Welcome to Rebite Food Rescue!
                  
1. View rescued food
2. My Goals
3. My Points
4. Gift / Donate
5. Place Order
6. Help`;
                  break;

                default:
                  response = `END Invalid option. Please try again.`;
              }
              break;

            case '4':
              // Gift / Donate
              switch (userInput) {
                case '1':
                  response = `CON Gift Points:
                  
Enter friend's phone number:
(Format: 1234567890)`;
                  break;

                case '2':
                  response = `CON Donate to Food Bank:
                  
Enter points to donate:
(Your balance: 150 points)`;
                  break;

                case '3':
                  response = `CON Welcome to Rebite Food Rescue!
                  
1. View rescued food
2. My Goals
3. My Points
4. Gift / Donate
5. Place Order
6. Help`;
                  break;

                default:
                  response = `END Invalid option. Please try again.`;
              }
              break;

            case '5':
              // Place Order
              switch (userInput) {
                case '1':
                  response = `CON Order Tomatoes:
                  
Quantity: 2 lbs
Price: $5.00
Delivery: 24-48 hours

1. Confirm order
2. Cancel`;
                  break;

                case '2':
                  response = `CON Order Bread:
                  
Quantity: 1 loaf
Price: $2.00
Delivery: 24-48 hours

1. Confirm order
2. Cancel`;
                  break;

                case '3':
                  response = `CON Order Vegetables:
                  
Quantity: 1 bag
Price: $6.00
Delivery: 24-48 hours

1. Confirm order
2. Cancel`;
                  break;

                default:
                  response = `END Invalid option. Please try again.`;
              }
              break;

            default:
              response = `END Invalid option. Please try again.`;
          }
          break;

        case 3:
          const secondChoice = textArray[1];
          
          switch (secondChoice) {
            case '4':
              // Gift / Donate - handle phone number or donation amount
              if (textArray[0] === '1') {
                // Gift points
                const phoneNumber = userInput;
                if (phoneNumber.length === 10) {
                  response = `CON Gift Points:
                  
Enter points to gift:
(Your balance: 150 points)`;
                } else {
                  response = `END Invalid phone number format. Please try again.`;
                }
              } else if (textArray[0] === '2') {
                // Donate points
                const donationAmount = parseInt(userInput);
                if (donationAmount && donationAmount > 0 && donationAmount <= 150) {
                  response = `END Donation Successful!
                  
Donated: ${donationAmount} points
To: Local Food Bank
New Balance: ${150 - donationAmount} points

Thank you for your generosity!`;
                } else {
                  response = `END Invalid amount. Please try again.`;
                }
              }
              break;

            case '5':
              // Place Order - confirm order
              if (userInput === '1') {
                response = `END Order Confirmed!
                
Order: ${textArray[2] === '1' ? 'Tomatoes' : textArray[2] === '2' ? 'Bread' : 'Vegetables'}
Total: $${textArray[2] === '1' ? '5.00' : textArray[2] === '2' ? '2.00' : '6.00'}
Delivery: 24-48 hours

You'll receive a confirmation SMS.`;
              } else if (userInput === '2') {
                response = `END Order Cancelled.
                
Thank you for using Rebite!`;
              } else {
                response = `END Invalid option. Please try again.`;
              }
              break;

            default:
              response = `END Invalid option. Please try again.`;
          }
          break;

        case 4:
          // Handle gift points amount
          if (textArray[0] === '1' && textArray[1] === '1') {
            const giftAmount = parseInt(userInput);
            const phoneNumber = textArray[2];
            
            if (giftAmount && giftAmount > 0 && giftAmount <= 150) {
              response = `END Gift Sent!
              
Gifted: ${giftAmount} points
To: ${phoneNumber}
New Balance: ${150 - giftAmount} points

Your friend will receive a notification.`;
            } else {
              response = `END Invalid amount. Please try again.`;
            }
          } else {
            response = `END Invalid option. Please try again.`;
          }
          break;

        default:
          response = `END Invalid option. Please try again.`;
      }
    }

    res.json({
      sessionId,
      serviceCode,
      phoneNumber,
      text,
      response
    });

  } catch (error) {
    console.error('USSD webhook error:', error);
    res.status(500).json({ 
      sessionId,
      serviceCode,
      phoneNumber,
      text,
      response: 'END An error occurred. Please try again later.'
    });
  }
});

module.exports = router;