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
    const revealCount = document.getElementById('reveal-count');
    const numericKeypad = document.getElementById('numeric-keypad');
    const keypadButtons = document.querySelectorAll('.keypad-btn');

    let enteredDigits = [];
    let streak = 0;
    let lastDigitCorrect = true; // Track if the last digit entered was correct
    let isMobileDevice = false;

    // Check if the device is mobile
    function checkMobileDevice() {
        isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        
        // Show/hide numeric keypad based on device type
        numericKeypad.style.display = isMobileDevice ? 'flex' : 'none';
        
        // On mobile, make sure the pi-display doesn't show the system keyboard
        if (isMobileDevice) {
            piDisplay.setAttribute('readonly', 'readonly');
        } else {
            piDisplay.removeAttribute('readonly');
        }
    }

    // Check device type on load and resize
    checkMobileDevice();
    window.addEventListener('resize', checkMobileDevice);

    // Load saved reveal count from localStorage if available
    if (localStorage.getItem('revealCount')) {
        revealCount.value = localStorage.getItem('revealCount');
    }

    // Save reveal count when changed
    revealCount.addEventListener('change', () => {
        // Ensure the value is within the allowed range
        const count = parseInt(revealCount.value);
        if (count < 1) revealCount.value = 1;
        if (count > 1000) revealCount.value = 1000;
        
        // Save to localStorage
        localStorage.setItem('revealCount', revealCount.value);
    });
    
    // Handle Enter key in reveal count input
    revealCount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            revealDigits();
        }
    });

    // Focus on the PI display initially
    piDisplay.focus();

    // Setup event listeners
    piDisplay.addEventListener('keydown', handleKeyDown);
    resetBtn.addEventListener('click', resetGame);
    revealBtn.addEventListener('click', revealDigits);
    piDisplay.addEventListener('click', () => piDisplay.focus());
    
    // Handle resize events to ensure proper display
    window.addEventListener('resize', ensureDigitVisible);
    piDisplay.addEventListener('mouseup', ensureDigitVisible); // After resizing with mouse

    // Setup numeric keypad event listeners
    keypadButtons.forEach(button => {
        button.addEventListener('click', handleKeypadButtonClick);
    });

    // Handle keypad button clicks
    function handleKeypadButtonClick(e) {
        const key = e.target.getAttribute('data-key');
        
        if (key === 'delete') {
            // Handle delete key - remove the last digit
            if (enteredDigits.length > 0) {
                digitsDisplay.removeChild(digitsDisplay.lastChild);
                enteredDigits.pop();
                lastDigitCorrect = true; // Reset the flag after deletion
                updateStats();
            }
        } else if (key === 'reset') {
            // Handle reset key
            resetGame();
        } else {
            // Handle number keys (0-9)
            // Create a synthetic keyboard event to reuse existing logic
            const keyEvent = {
                key: key,
                preventDefault: () => {}
            };
            handleKeyDown(keyEvent);
        }
        
        // Focus back on the pi display
        piDisplay.focus();
    }

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
                    streak = 0;
                    lastDigitCorrect = false;
                    updateStats();
                    
                    // Add shake effect to the display
                    piDisplay.classList.add('shake');
                    document.body.classList.add('error');
                    
                    // Remove the shake effect after animation completes
                    setTimeout(() => {
                        piDisplay.classList.remove('shake');
                        document.body.classList.remove('error');
                    }, 500);
                }
                
                // Add the digit to the display
                digitsDisplay.appendChild(digitElement);
                enteredDigits.push(inputDigit);
                
                // Ensure the newly added digit is visible
                ensureDigitVisible();
                
                return;
            }
            
            // Normal case: adding a new digit
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
                streak = 0;
                lastDigitCorrect = false;
                updateStats();
                
                // Add shake effect to the display
                piDisplay.classList.add('shake');
                document.body.classList.add('error');
                
                // Remove the shake effect after animation completes
                setTimeout(() => {
                    piDisplay.classList.remove('shake');
                    document.body.classList.remove('error');
                }, 500);
            }
            
            // Add the digit to the display
            digitsDisplay.appendChild(digitElement);
            enteredDigits.push(inputDigit);
            
            // Ensure the newly added digit is visible
            ensureDigitVisible();
        }
    }
    
    // Ensure the last entered digit is visible in the display
    function ensureDigitVisible() {
        if (digitsDisplay.lastChild) {
            digitsDisplay.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Reset the game
    function resetGame() {
        digitsDisplay.innerHTML = '';
        enteredDigits = [];
        streak = 0;
        lastDigitCorrect = true;
        updateStats();
        piDisplay.focus();
    }
    
    // Update the stats display
    function updateStats() {
        currentStreak.textContent = streak;
    }
    
    // Reveal the next digits of PI
    function revealDigits() {
        const count = parseInt(revealCount.value);
        const startIndex = enteredDigits.length;
        
        // Don't reveal if we're at the end of our PI digits
        if (startIndex >= PI_DIGITS.length) {
            return;
        }
        
        // Remove any incorrect digit if present
        if (!lastDigitCorrect && enteredDigits.length > 0) {
            digitsDisplay.removeChild(digitsDisplay.lastChild);
            enteredDigits.pop();
        }
        
        // Reveal the next 'count' digits
        for (let i = 0; i < count && startIndex + i < PI_DIGITS.length; i++) {
            const digit = PI_DIGITS[startIndex + i];
            
            // Create a digit element to display
            const digitElement = document.createElement('span');
            digitElement.classList.add('digit', 'revealed');
            digitElement.textContent = digit;
            
            // Set color based on position
            digitElement.style.color = getDigitColor(startIndex + i);
            
            // Add the digit to the display
            digitsDisplay.appendChild(digitElement);
            enteredDigits.push(digit);
        }
        
        // Reset streak since we revealed digits
        streak = 0;
        lastDigitCorrect = true;
        updateStats();
        
        // Ensure the newly added digits are visible
        ensureDigitVisible();
        
        // Focus back on the display
        piDisplay.focus();
    }
}); 