document.addEventListener('DOMContentLoaded', () => {
    // First 1000 digits of PI (excluding the 3 before the decimal)
    const PI_DIGITS = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';

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

    // Handle key presses
    function handleKeyDown(e) {
        // Only process if it's a digit key (0-9)
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // Prevent default to avoid scrolling or other behaviors
            const inputDigit = e.key;
            
            // If the last digit was incorrect, replace it instead of adding a new one
            if (!lastDigitCorrect && enteredDigits.length > 0) {
                // Remove the last incorrect digit from the display
                digitsDisplay.removeChild(digitsDisplay.lastChild);
                enteredDigits.pop(); // Remove the last digit from our array
            }
            
            const correctDigit = PI_DIGITS[enteredDigits.length];
            
            // Create a digit element to display
            const digitElement = document.createElement('span');
            digitElement.classList.add('digit');
            digitElement.textContent = inputDigit;
            
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
                
                // Set lastDigitCorrect to false but don't reset streak
                lastDigitCorrect = false;
            }
            
            // Add digit to display and list
            digitsDisplay.appendChild(digitElement);
            enteredDigits.push(inputDigit);
            
            // Scroll to the right to see the latest digit
            piDisplay.scrollLeft = piDisplay.scrollWidth;
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
            }
        }
    }

    // Reset the game
    function resetGame() {
        enteredDigits = [];
        streak = 0;
        lastDigitCorrect = true;
        updateStats();
        digitsDisplay.innerHTML = '';
        piDisplay.focus();
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
            digitsDisplay.appendChild(digitElement);
            
            // Add to entered digits so we can continue after
            enteredDigits.push(PI_DIGITS[currentIndex]);
            lastDigitCorrect = true;
            
            // Scroll to see the latest digit
            piDisplay.scrollLeft = piDisplay.scrollWidth;
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