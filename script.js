// PI Digits Challenge - A simple web app to test your knowledge of PI
// Last updated: March 2025
document.addEventListener('DOMContentLoaded', () => {
    // First 1000 digits of PI (excluding the 3 before the decimal)
    const PI_DIGITS = '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';

    // Define an array of colors to cycle through every 6 digits
    // No longer used since we're using a uniform dark grey color
    // const DIGIT_COLORS = [
    //     '#3498db', // Blue
    //     '#2ecc71', // Green
    //     '#e74c3c', // Red
    //     '#f39c12', // Orange
    //     '#9b59b6', // Purple
    //     '#1abc9c'  // Turquoise
    // ];

    const piDisplay = document.getElementById('pi-display');
    const digitsDisplay = document.getElementById('digits-display');
    const cursorIndicator = document.getElementById('cursor-indicator');
    const currentStreak = document.getElementById('current-streak');
    const resetBtn = document.getElementById('reset-btn');
    const numericKeypad = document.getElementById('numeric-keypad');
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    
    // Info popup elements
    const infoBtn = document.getElementById('info-btn');
    const infoPopup = document.getElementById('info-popup');
    const closePopupButtons = document.querySelectorAll('.close-popup');
    
    // All PI digits popup elements
    const showPiBtn = document.getElementById('show-pi-btn');
    const piDigitsPopup = document.getElementById('pi-digits-popup');
    const allDigitsDisplay = document.getElementById('all-digits');
    
    // Search feature elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    let enteredDigits = [];
    let streak = 0;
    let lastDigitCorrect = true; // Track if the last digit entered was correct
    let isMobileDevice = false;

    // Initialize the all digits display
    function initializeAllDigitsDisplay() {
        // Display digits without grouping
        allDigitsDisplay.textContent = PI_DIGITS;
    }
    
    // Initialize the all digits display
    initializeAllDigitsDisplay();

    // Info popup functionality
    infoBtn.addEventListener('click', () => {
        infoPopup.classList.add('show');
    });
    
    // Show all PI digits popup functionality
    showPiBtn.addEventListener('click', () => {
        piDigitsPopup.classList.add('show');
    });
    
    // Close popup buttons
    closePopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the parent popup and hide it
            const popup = button.closest('.info-popup');
            popup.classList.remove('show');
        });
    });
    
    // Close popup when clicking outside the content
    document.querySelectorAll('.info-popup').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('show');
            }
        });
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.info-popup').forEach(popup => {
                if (popup.classList.contains('show')) {
                    popup.classList.remove('show');
                }
            });
        }
    });
    
    // Search for digits in PI
    function searchDigits(query) {
        if (!query || !/^\d+$/.test(query)) {
            return { found: false, message: 'Please enter a valid sequence of digits.' };
        }
        
        const position = PI_DIGITS.indexOf(query);
        if (position === -1) {
            return { found: false, message: `The sequence "${query}" was not found in the first 1000 digits of PI.` };
        }
        
        // Add 1 to position because we're excluding the "3." at the beginning
        const startPosition = position + 1;
        const endPosition = startPosition + query.length - 1;
        
        return { 
            found: true, 
            startPosition, 
            endPosition,
            message: `Found "${query}" at position ${startPosition} to ${endPosition} (counting after the decimal point).`
        };
    }
    
    // Reset search feature
    function resetSearchFeature() {
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchResults) {
            searchResults.textContent = '';
            searchResults.classList.remove('success', 'error');
        }
    }
    
    // Search button click handler
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            const result = searchDigits(query);
            
            if (result.found) {
                // Create a more detailed results display
                searchResults.innerHTML = '';
                
                // Create result container
                const resultContainer = document.createElement('div');
                resultContainer.classList.add('search-result-container');
                
                // Add search string display
                const searchStringDisplay = document.createElement('div');
                searchStringDisplay.classList.add('search-string-display');
                searchStringDisplay.innerHTML = `<strong>Search string:</strong> <span class="search-digits">${query}</span>`;
                resultContainer.appendChild(searchStringDisplay);
                
                // Add position information
                const positionInfo = document.createElement('div');
                positionInfo.classList.add('position-info');
                positionInfo.innerHTML = `<strong>Position:</strong> ${result.startPosition} to ${result.endPosition} (after decimal point)`;
                resultContainer.appendChild(positionInfo);
                
                // Add the result container to search results
                searchResults.appendChild(resultContainer);
                searchResults.classList.remove('error');
                searchResults.classList.add('success');
            } else {
                searchResults.textContent = result.message;
                searchResults.classList.remove('success');
                searchResults.classList.add('error');
            }
        });
    }
    
    // Search input enter key handler
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBtn.click();
            }
        });
    }

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

    // Focus on the PI display initially
    piDisplay.focus();

    // Setup event listeners
    piDisplay.addEventListener('keydown', handleKeyDown);
    resetBtn.addEventListener('click', resetGame);
    piDisplay.addEventListener('click', () => piDisplay.focus());
    
    // Handle resize events to ensure proper display
    window.addEventListener('resize', ensureDigitVisible);
    piDisplay.addEventListener('mouseup', ensureDigitVisible); // After resizing with mouse

    // Setup numeric keypad event listeners
    keypadButtons.forEach(button => {
        button.addEventListener('click', handleKeypadButtonClick);
        
        // Add event listeners to reset button state after click
        button.addEventListener('mouseup', function() {
            // Remove focus to ensure the button returns to default state
            this.blur();
        });
        
        button.addEventListener('touchend', function() {
            // Remove focus to ensure the button returns to default state
            this.blur();
        });
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
        
        // Remove focus from the button to ensure it returns to default state
        e.target.blur();
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
                
                // Check if the input digit is correct
                const isCorrect = inputDigit === correctDigit;
                
                if (isCorrect) {
                    digitElement.classList.add('correct');
                    streak++;
                    lastDigitCorrect = true;
                    updateStats();
                } else {
                    digitElement.classList.add('incorrect');
                    // No longer reset streak on incorrect digit
                    // streak = 0;
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
            
            // Check if the input digit is correct
            const isCorrect = inputDigit === correctDigit;
            
            if (isCorrect) {
                digitElement.classList.add('correct');
                streak++;
                lastDigitCorrect = true;
                updateStats();
            } else {
                digitElement.classList.add('incorrect');
                // No longer reset streak on incorrect digit
                // streak = 0;
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
            // Scroll to the last digit with smooth behavior
            digitsDisplay.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Also ensure the container scrolls to show the latest content
            piDisplay.scrollTop = piDisplay.scrollHeight;
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
        
        // Also reset the search feature
        resetSearchFeature();
        
        // Reset the all digits display
        resetAllDigitsDisplay();
    }
    
    // Update the stats display
    function updateStats() {
        currentStreak.textContent = streak;
    }
    
    // Reset the all digits display to show all digits without highlighting
    function resetAllDigitsDisplay() {
        allDigitsDisplay.textContent = PI_DIGITS;
    }
    
    // Add event listener to reset the all digits display when the popup is closed
    closePopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset the all digits display when the popup is closed
            resetAllDigitsDisplay();
            
            // Clear search input and results
            resetSearchFeature();
        });
    });
    
    // Also reset the all digits display when clicking outside the popup
    piDigitsPopup.addEventListener('click', (e) => {
        if (e.target === piDigitsPopup) {
            resetAllDigitsDisplay();
            
            // Clear search input and results
            resetSearchFeature();
        }
    });
}); 