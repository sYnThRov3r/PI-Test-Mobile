document.addEventListener('DOMContentLoaded', () => {
    // First 1000 digits of PI (excluding the 3 before the decimal)
    const PI_DIGITS = '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';

    // Define an array of colors to cycle through every 6 digits
    const DIGIT_COLORS = [
        '#3498db', // Blue
        '#2ecc71', // Green
        '#e74c3c', // Red
        '#f39c12', // Orange
        '#9b59b6', // Purple
        '#1abc9c'  // Turquoise
    ];

    const piDisplay = document.getElementById('pi-display');
    const digitsDisplay = document.getElementById('digits-display');
    const cursorIndicator = document.getElementById('cursor-indicator');
    const currentStreak = document.getElementById('current-streak');
    const resetBtn = document.getElementById('reset-btn');
    const revealBtn = document.getElementById('reveal-next-btn');

    let enteredDigits = [];
    let streak = 0;
    let lastDigitCorrect = true; // Track if the last digit entered was correct

    // Focus on the PI display initially
    piDisplay.focus();

    // Setup event listeners
    piDisplay.addEventListener('keydown', handleKeyDown);
    resetBtn.addEventListener('click', resetGame);
    revealBtn.addEventListener('click', revealCurrentDigit);
    piDisplay.addEventListener('click', () => piDisplay.focus());

    // Get color for a digit based on its position
    function getDigitColor(index) {
        return DIGIT_COLORS[Math.floor(index / 6) % DIGIT_COLORS.length];
    }

    // Handle key presses
    function handleKeyDown(e) {
        // Only process if it's a digit key (0-9)
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // Prevent default to avoid scrolling or other behaviors
            
            // If the last digit was incorrect, only allow replacing it, not adding new digits
            if (!lastDigitCorrect && enteredDigits.length > 0) {
                // Remove the last incorrect digit from the display
                digitsDisplay.removeChild(digitsDisplay.lastChild);
                enteredDigits.pop(); // Remove the last digit from our array
                
                const inputDigit = e.key;
                const correctDigit = PI_DIGITS[enteredDigits.length];
                
                // Create a digit element to display
                const digitElement = document.createElement('span');
                digitElement.classList.add('digit');
                digitElement.textContent = inputDigit;
                
                // Set color based on position
                digitElement.style.color = getDigitColor(enteredDigits.length);
                
                // Check if the input digit is correct
                const isCorrect = inputDigit === correctDigit;
                
                if (isCorrect) {
                    digitElement.classList.add('correct');
                    streak++;
                    lastDigitCorrect = true;
                    updateStats();
                } else {
                    digitElement.classList.add('incorrect');
                    // Add the temporary error background effect
                    document.body.classList.add('error');
                    setTimeout(() => {
                        document.body.classList.remove('error');
                    }, 500);
                    
                    // Add a shake effect to the display
                    piDisplay.classList.add('shake');
                    setTimeout(() => {
                        piDisplay.classList.remove('shake');
                    }, 500);
                    
                    // Set lastDigitCorrect to false
                    lastDigitCorrect = false;
                }
                
                // Add digit to display and list
                digitsDisplay.appendChild(digitElement);
                enteredDigits.push(inputDigit);
                
                // Ensure the latest digit is visible by scrolling to it if needed
                ensureDigitVisible();
            } 
            // Only add a new digit if the last one was correct
            else if (lastDigitCorrect) {
                const inputDigit = e.key;
                const correctDigit = PI_DIGITS[enteredDigits.length];
                
                // Create a digit element to display
                const digitElement = document.createElement('span');
                digitElement.classList.add('digit');
                digitElement.textContent = inputDigit;
                
                // Set color based on position
                digitElement.style.color = getDigitColor(enteredDigits.length);
                
                // Check if the input digit is correct
                const isCorrect = inputDigit === correctDigit;
                
                if (isCorrect) {
                    digitElement.classList.add('correct');
                    streak++;
                    lastDigitCorrect = true;
                    updateStats();
                } else {
                    digitElement.classList.add('incorrect');
                    // Add the temporary error background effect
                    document.body.classList.add('error');
                    setTimeout(() => {
                        document.body.classList.remove('error');
                    }, 500);
                    
                    // Add a shake effect to the display
                    piDisplay.classList.add('shake');
                    setTimeout(() => {
                        piDisplay.classList.remove('shake');
                    }, 500);
                    
                    // Set lastDigitCorrect to false
                    lastDigitCorrect = false;
                }
                
                // Add digit to display and list
                digitsDisplay.appendChild(digitElement);
                enteredDigits.push(inputDigit);
                
                // Ensure the latest digit is visible by scrolling to it if needed
                ensureDigitVisible();
            }
        } else if (e.key === 'Backspace') {
            // Prevent backspace from navigating back
            e.preventDefault();
            
            // Allow backspace to remove the last digit if there are any
            if (enteredDigits.length > 0) {
                digitsDisplay.removeChild(digitsDisplay.lastChild);
                
                // If the last digit was correct, decrement the streak
                if (lastDigitCorrect) {
                    streak = Math.max(0, streak - 1);
                    updateStats();
                }
                
                enteredDigits.pop();
                
                // Set lastDigitCorrect based on the new last digit
                if (enteredDigits.length > 0) {
                    const lastIndex = enteredDigits.length - 1;
                    lastDigitCorrect = enteredDigits[lastIndex] === PI_DIGITS[lastIndex];
                } else {
                    lastDigitCorrect = true; // Reset if no digits left
                }
                
                // Ensure proper cursor positioning
                ensureDigitVisible();
            }
        }
    }

    // Ensure the latest digit is visible
    function ensureDigitVisible() {
        // Scroll to the bottom to ensure the latest digit is visible
        piDisplay.scrollTop = piDisplay.scrollHeight;
    }

    // Reset the game
    function resetGame() {
        enteredDigits = [];
        streak = 0;
        lastDigitCorrect = true;
        updateStats();
        digitsDisplay.innerHTML = '';
        piDisplay.focus();
        piDisplay.scrollTop = 0; // Scroll back to the top
    }

    // Update the statistics display
    function updateStats() {
        currentStreak.textContent = streak;
    }

    // Reveal the current digit of PI (the one the user is stuck on)
    function revealCurrentDigit() {
        // If the last digit was incorrect, replace it
        if (!lastDigitCorrect && enteredDigits.length > 0) {
            digitsDisplay.removeChild(digitsDisplay.lastChild);
            enteredDigits.pop();
        }
        
        const currentIndex = enteredDigits.length;
        
        if (currentIndex < PI_DIGITS.length) {
            const digitElement = document.createElement('span');
            digitElement.classList.add('digit', 'revealed');
            digitElement.textContent = PI_DIGITS[currentIndex];
            
            // Set color based on position
            digitElement.style.color = getDigitColor(currentIndex);
            
            digitsDisplay.appendChild(digitElement);
            
            // Add to entered digits so we can continue after
            enteredDigits.push(PI_DIGITS[currentIndex]);
            lastDigitCorrect = true;
            
            // Ensure the revealed digit is visible
            ensureDigitVisible();
        }
        
        piDisplay.focus();
    }

    // Add keyboard shortcut for reset (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetGame();
        }
    });
}); 