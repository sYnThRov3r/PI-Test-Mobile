document.addEventListener('DOMContentLoaded', () => {
    // First 1000 digits of PI (excluding the 3 before the decimal)
    const PI_DIGITS = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';

    const digitInput = document.getElementById('digit-input');
    const digitsDisplay = document.getElementById('digits-display');
    const correctCount = document.getElementById('correct-count');
    const currentStreak = document.getElementById('current-streak');
    const resetBtn = document.getElementById('reset-btn');
    const revealNextBtn = document.getElementById('reveal-next-btn');
    const showPiBtn = document.getElementById('show-pi-btn');
    const revealDigitsInput = document.getElementById('reveal-digits');
    const piReveal = document.getElementById('pi-reveal');
    const piRevealDisplay = document.getElementById('pi-reveal-display');

    let enteredDigits = [];
    let correctDigitsCount = 0;
    let streak = 0;

    // Focus on input initially
    digitInput.focus();

    // Setup event listeners
    digitInput.addEventListener('input', handleDigitInput);
    resetBtn.addEventListener('click', resetGame);
    revealNextBtn.addEventListener('click', revealNextDigit);
    showPiBtn.addEventListener('click', showPiDigits);

    // Handle digits input
    function handleDigitInput(e) {
        // Only process if there's a value and it's a single digit
        if (e.target.value && e.target.value.length > 0) {
            const inputDigit = e.target.value.slice(-1);
            const correctDigit = PI_DIGITS[enteredDigits.length];
            
            // Create a digit element to display
            const digitElement = document.createElement('span');
            digitElement.classList.add('digit');
            digitElement.textContent = inputDigit;
            
            // Check if the input digit is correct
            const isCorrect = inputDigit === correctDigit;
            
            if (isCorrect) {
                digitElement.classList.add('correct');
                correctDigitsCount++;
                streak++;
                updateStats();
            } else {
                digitElement.classList.add('incorrect');
                // Add the temporary error background effect
                document.body.classList.add('error');
                setTimeout(() => {
                    document.body.classList.remove('error');
                }, 500);
                
                // Add a shake effect to the input
                digitInput.classList.add('shake');
                setTimeout(() => {
                    digitInput.classList.remove('shake');
                }, 500);
                
                // Reset streak
                streak = 0;
                updateStats();
            }
            
            // Add digit to display and list
            digitsDisplay.appendChild(digitElement);
            enteredDigits.push(inputDigit);
            
            // Clear input field for next digit
            e.target.value = '';
            
            // Scroll to the right to see the latest digit
            digitsDisplay.scrollLeft = digitsDisplay.scrollWidth;
        }
    }

    // Reset the game
    function resetGame() {
        enteredDigits = [];
        correctDigitsCount = 0;
        streak = 0;
        updateStats();
        digitsDisplay.innerHTML = '';
        digitInput.value = '';
        digitInput.focus();
        piRevealDisplay.style.display = 'none';
    }

    // Update the statistics display
    function updateStats() {
        correctCount.textContent = correctDigitsCount;
        currentStreak.textContent = streak;
    }

    // Reveal the next digit of PI
    function revealNextDigit() {
        const nextDigitIndex = enteredDigits.length;
        
        if (nextDigitIndex < PI_DIGITS.length) {
            const digitElement = document.createElement('span');
            digitElement.classList.add('digit', 'revealed');
            digitElement.textContent = PI_DIGITS[nextDigitIndex];
            digitsDisplay.appendChild(digitElement);
            
            // Add to entered digits so we can continue after
            enteredDigits.push(PI_DIGITS[nextDigitIndex]);
            
            // Reset streak since we revealed a digit
            streak = 0;
            updateStats();
            
            // Scroll to see the latest digit
            digitsDisplay.scrollLeft = digitsDisplay.scrollWidth;
        }
        
        digitInput.focus();
    }

    // Show PI to specified number of digits
    function showPiDigits() {
        const numDigits = parseInt(revealDigitsInput.value);
        
        if (numDigits > 0 && numDigits <= 1000) {
            piReveal.textContent = PI_DIGITS.substring(0, numDigits);
            piRevealDisplay.style.display = 'block';
        } else {
            alert("Please enter a number between 1 and 1000.");
        }
    }

    // Add keyboard shortcut for reset (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetGame();
        }
    });

    // Keep focus on input field
    document.addEventListener('click', () => {
        digitInput.focus();
    });
}); 